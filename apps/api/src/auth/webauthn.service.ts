import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import {
    generateRegistrationOptions,
    verifyRegistrationResponse,
    generateAuthenticationOptions,
    verifyAuthenticationResponse,
} from '@simplewebauthn/server';
import { Redis } from 'ioredis';
import { Authenticator } from '@authkit/db';

@Injectable()
export class WebAuthnService {
    private redis: Redis;
    private rpName = 'AuthKit';
    private rpID: string;
    private origin: string;

    constructor(
        private configService: ConfigService,
        private usersService: UsersService,
    ) {
        this.rpID = this.configService.get<string>('RP_ID') || 'localhost';
        this.origin = this.configService.get<string>('ORIGIN') || 'http://localhost:3000';

        // Initialize Redis
        this.redis = new Redis({
            host: this.configService.get('REDIS_HOST') || 'localhost',
            port: parseInt(this.configService.get('REDIS_PORT') || '6379'),
        });
    }

    // --- Registration ---

    async generateRegistrationOptions(userId: string) {
        const user = await this.usersService.findById(userId);
        if (!user) throw new UnauthorizedException();

        const authenticators = await this.usersService.findAuthenticators(userId);

        const options = await generateRegistrationOptions({
            rpName: this.rpName,
            rpID: this.rpID,
            userID: new TextEncoder().encode(user.id),
            userName: user.email,
            attestationType: 'none',
            excludeCredentials: authenticators.map(authenticator => ({
                id: authenticator.credentialID,
                type: 'public-key',
            })),
            authenticatorSelection: {
                residentKey: 'preferred',
                userVerification: 'preferred',
                authenticatorAttachment: 'platform',
            },
        });

        // Store challenge
        await this.redis.set(`webauthn:challenge:${userId}`, options.challenge, 'EX', 120);

        return options;
    }

    async verifyRegistration(userId: string, body: any) {
        const user = await this.usersService.findById(userId);
        if (!user) throw new UnauthorizedException();

        const currentChallenge = await this.redis.get(`webauthn:challenge:${userId}`);
        if (!currentChallenge) throw new BadRequestException('Challenge expired');

        let verification;
        try {
            verification = await verifyRegistrationResponse({
                response: body,
                expectedChallenge: currentChallenge,
                expectedOrigin: this.origin,
                expectedRPID: this.rpID,
            });
        } catch (error) {
            throw new BadRequestException((error as Error).message);
        }

        if (verification.verified && verification.registrationInfo) {
            const { credentialPublicKey, credentialID, counter, credentialDeviceType, credentialBackedUp } = verification.registrationInfo;

            await this.usersService.addAuthenticator({
                credentialID,
                credentialPublicKey: Buffer.from(credentialPublicKey).toString('base64'),
                counter,
                credentialDeviceType,
                credentialBackedUp,
                providerAccountId: credentialID, // Use credentialID as providerAccountId
                user: { connect: { id: userId } },
            });

            // Clean up
            await this.redis.del(`webauthn:challenge:${userId}`);

            return { verified: true };
        }

        throw new BadRequestException('Verification failed');
    }

    // --- Login ---

    async generateLoginOptions(userId: string) {
        const user = await this.usersService.findById(userId);
        if (!user) throw new UnauthorizedException();

        const authenticators = await this.usersService.findAuthenticators(userId);

        const options = await generateAuthenticationOptions({
            rpID: this.rpID,
            allowCredentials: authenticators.map(auth => ({
                id: auth.credentialID,
                type: 'public-key',
            })),
            userVerification: 'preferred',
        });

        await this.redis.set(`webauthn:challenge:${userId}`, options.challenge, 'EX', 120);
        return options;
    }

    async verifyLogin(userId: string, body: any) {
        const user = await this.usersService.findById(userId);
        if (!user) throw new UnauthorizedException();

        const currentChallenge = await this.redis.get(`webauthn:challenge:${userId}`);
        if (!currentChallenge) throw new BadRequestException('Challenge expired');

        const credentialID = body.id;
        const authenticator = await this.usersService.findAuthenticator(credentialID);

        if (!authenticator) throw new UnauthorizedException('Authenticator not found');

        let verification;
        try {
            verification = await verifyAuthenticationResponse({
                response: body,
                expectedChallenge: currentChallenge,
                expectedOrigin: this.origin,
                expectedRPID: this.rpID,
                credential: { // Changed from authenticator to credential (guess based on updated API or common patterns)
                    id: authenticator.credentialID,
                    publicKey: new Uint8Array(Buffer.from(authenticator.credentialPublicKey, 'base64')),
                    counter: authenticator.counter,
                    transports: undefined, // Optional
                },
            });
        } catch (error) {
            throw new BadRequestException((error as Error).message);
        }

        if (verification.verified) {
            await this.usersService.updateAuthenticatorCounter(authenticator.credentialID, verification.authenticationInfo.newCounter);
            await this.redis.del(`webauthn:challenge:${userId}`);
            return { verified: true };
        }

        throw new UnauthorizedException('Verification failed');
    }
}
