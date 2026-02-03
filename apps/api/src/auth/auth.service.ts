import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import * as crypto from 'crypto';
import { User } from '@authkit/db';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private auditService: AuditService,
    ) { }

    private hashToken(token: string): string {
        return crypto.createHash('sha256').update(token).digest('hex');
    }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(email);
        if (user && user.passwordHash) {
            const valid = await argon2.verify(user.passwordHash, pass);
            if (valid) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { passwordHash, ...result } = user;
                return result;
            }
        }
        return null;
    }

    async login(user: User, req?: any) {
        const accessToken = this.jwtService.sign({ username: user.email, sub: user.id });
        const refreshToken = await this.generateRefreshToken(user.id);

        await this.auditService.logAction({
            action: 'LOGIN_SUCCESS',
            userId: user.id,
            ipAddress: req?.ip,
            metadata: { email: user.email },
        });

        return {
            access_token: accessToken,
            refresh_token: refreshToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            }
        };
    }

    async generateRefreshToken(userId: string, familyId?: string, parentTokenId?: string): Promise<string> {
        const token = crypto.randomBytes(32).toString('hex');
        const tokenHash = this.hashToken(token);

        const expiry = new Date();
        expiry.setDate(expiry.getDate() + 7); // 7 days

        await this.usersService.createSession({
            sessionTokenHash: tokenHash,
            user: { connect: { id: userId } },
            expires: expiry,
            familyId: familyId,
            parentSession: parentTokenId ? { connect: { id: parentTokenId } } : undefined,
        });

        return token;
    }

    async refreshTokens(refreshToken: string) {
        const tokenHash = this.hashToken(refreshToken);
        const session = await this.usersService.findSession(tokenHash);

        if (!session) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        // Reuse Detection
        if (session.replacedByTokenId) {
            if (session.familyId) {
                await this.usersService.revokeFamily(session.familyId);
            }
            await this.auditService.logAction({
                action: 'REFRESH_REUSE_DETECTED',
                userId: session.userId,
                metadata: { familyId: session.familyId },
            });
            throw new UnauthorizedException('Refresh token reuse detected. Access denied.');
        }

        // Check revocation
        if (session.revokedAt || new Date() > session.expires) {
            throw new UnauthorizedException('Token expired or revoked');
        }

        // Rotate
        const newRefreshToken = crypto.randomBytes(32).toString('hex');
        const newRefreshTokenHash = this.hashToken(newRefreshToken);
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + 7);

        await this.usersService.replaceSession(session.id, {
            sessionTokenHash: newRefreshTokenHash,
            user: { connect: { id: session.userId } },
            expires: expiry,
            familyId: session.familyId,
            parentSession: { connect: { id: session.id } },
        });

        const user = await this.usersService.findById(session.userId);
        if (!user) throw new UnauthorizedException();

        const newAccessToken = this.jwtService.sign({ username: user.email, sub: user.id });

        return {
            access_token: newAccessToken,
            refresh_token: newRefreshToken,
        };
    }

    async register(email: string, pass: string, name?: string) {
        const existing = await this.usersService.findOne(email);
        if (existing) {
            throw new BadRequestException('User already exists');
        }
        const hashedPassword = await argon2.hash(pass);
        const user = await this.usersService.create({
            email,
            passwordHash: hashedPassword,
            name,
        });

        await this.auditService.logAction({
            action: 'REGISTER_SUCCESS',
            userId: user.id,
            metadata: { email, name },
        });

        const token = crypto.randomBytes(32).toString('hex');
        return this.login(user); // Note: Login logs automatically
    }

    async forgotPassword(email: string) {
        const user = await this.usersService.findOne(email);
        if (!user) return;

        const token = crypto.randomBytes(32).toString('hex');
        const tokenHash = this.hashToken(token);
        const expires = new Date();
        expires.setMinutes(expires.getMinutes() + 15);

        await this.usersService.updateUser(user.id, {
            resetTokenHash: tokenHash,
            resetTokenExpires: expires,
        });

        await this.auditService.logAction({
            action: 'PASSWORD_RESET_REQUEST',
            userId: user.id,
            metadata: { email },
        });
    }

    async resetPassword(token: string, newPass: string) {
        const tokenHash = this.hashToken(token);
        const user = await this.usersService.findByResetToken(tokenHash);

        if (!user || !user.resetTokenExpires || new Date() > user.resetTokenExpires) {
            throw new BadRequestException('Invalid or expired token');
        }

        const hashedPassword = await argon2.hash(newPass);
        await this.usersService.updateUser(user.id, {
            passwordHash: hashedPassword,
            resetTokenHash: null,
            resetTokenExpires: null,
        });

        await this.auditService.logAction({
            action: 'PASSWORD_RESET_SUCCESS',
            userId: user.id,
        });

        return { success: true };
    }

    async verifyEmail(token: string) {
        // Verification logic here
        return true;
    }

    async validateOAuthLogin(profile: any) {
        let user = await this.usersService.findOne(profile.email);

        if (!user) {
            user = await this.usersService.create({
                email: profile.email,
                name: `${profile.firstName} ${profile.lastName}`,
                emailVerified: new Date(),
            });

            await this.auditService.logAction({
                action: 'REGISTER_SUCCESS',
                userId: user.id,
                metadata: { provider: profile.provider },
            });
        }

        await this.auditService.logAction({
            action: 'OAUTH_LOGIN_SUCCESS',
            userId: user.id,
            metadata: { provider: profile.provider },
        });

        return this.login(user);
    }
}
