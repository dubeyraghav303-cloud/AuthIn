import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@authkit/db';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async findOne(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    async findById(id: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }

    async create(data: Prisma.UserCreateInput): Promise<User> {
        return this.prisma.user.create({
            data,
        });
    }

    async createSession(data: Prisma.SessionCreateInput) {
        return this.prisma.session.create({ data });
    }

    async findSession(sessionTokenHash: string) {
        return this.prisma.session.findUnique({
            where: { sessionTokenHash },
        });
    }

    async revokeFamily(familyId: string) {
        return this.prisma.session.updateMany({
            where: { familyId },
            data: { revokedAt: new Date() },
        });
    }

    async replaceSession(oldSessionId: string, newSessionData: Prisma.SessionCreateInput) {
        return this.prisma.$transaction(async (tx) => {
            const newSession = await tx.session.create({ data: newSessionData });
            await tx.session.update({
                where: { id: oldSessionId },
                data: {
                    replacedByTokenId: newSession.id,
                },
            });
            return newSession;
        });
    }

    async updateSession(id: string, data: Prisma.SessionUpdateInput) {
        return this.prisma.session.update({
            where: { id },
            data,
        });
    }

    async addAuthenticator(data: Prisma.AuthenticatorCreateInput) {
        return this.prisma.authenticator.create({ data });
    }

    async findAuthenticators(userId: string) {
        return this.prisma.authenticator.findMany({ where: { userId } });
    }

    async findAuthenticator(credentialID: string) {
        return this.prisma.authenticator.findUnique({ where: { credentialID } });
    }

    async updateAuthenticatorCounter(credentialID: string, counter: number) {
        return this.prisma.authenticator.update({
            where: { credentialID },
            data: { counter },
        });
    }

    async findTenantMember(userId: string, tenantId: string) {
        return this.prisma.tenantMember.findUnique({
            where: {
                userId_tenantId: {
                    userId,
                    tenantId,
                },
            },
        });
    }

    async updateUser(id: string, data: Prisma.UserUpdateInput) {
        return this.prisma.user.update({
            where: { id },
            data,
        });
    }

    async findByResetToken(resetTokenHash: string) {
        return this.prisma.user.findFirst({
            where: { resetTokenHash },
        });
    }
}
