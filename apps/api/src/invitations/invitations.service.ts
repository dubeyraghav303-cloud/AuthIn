import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@authkit/db';
import * as crypto from 'crypto';

@Injectable()
export class InvitationsService {
    constructor(private prisma: PrismaService) { }

    async create(tenantId: string, email: string, role: Role, inviterId: string) {
        // Check if user is already a member
        const existingMember = await this.prisma.tenantMember.findFirst({
            where: {
                tenantId,
                user: { email }
            }
        });

        if (existingMember) {
            throw new BadRequestException('User is already a member of this tenant');
        }

        // Check if invite already exists
        const existingInvite = await this.prisma.tenantInvitation.findFirst({
            where: { tenantId, email }
        });

        if (existingInvite) {
            // Resend logic or error? For now update token
            const token = crypto.randomBytes(32).toString('hex');
            const expires = new Date();
            expires.setDate(expires.getDate() + 7); // 7 days

            return this.prisma.tenantInvitation.update({
                where: { id: existingInvite.id },
                data: { token, expires, role, inviterId }
            });
        }

        const token = crypto.randomBytes(32).toString('hex');
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);

        return this.prisma.tenantInvitation.create({
            data: {
                tenantId,
                email,
                role,
                inviterId,
                token,
                expires
            }
        });
    }

    async accept(token: string, userId: string) {
        const invite = await this.prisma.tenantInvitation.findUnique({
            where: { token }
        });

        if (!invite) {
            throw new NotFoundException('Invitation not found');
        }

        if (new Date() > invite.expires) {
            throw new BadRequestException('Invitation expired');
        }

        // Add member
        await this.prisma.tenantMember.create({
            data: {
                tenantId: invite.tenantId,
                userId: userId,
                role: invite.role
            }
        });

        // Delete invite
        await this.prisma.tenantInvitation.delete({
            where: { id: invite.id }
        });

        return { success: true, tenantId: invite.tenantId };
    }

    async list(tenantId: string) {
        return this.prisma.tenantInvitation.findMany({
            where: { tenantId }
        });
    }

    async delete(id: string, tenantId: string) {
        const invite = await this.prisma.tenantInvitation.findUnique({ where: { id } });
        if (!invite || invite.tenantId !== tenantId) {
            throw new NotFoundException('Invitation not found');
        }
        return this.prisma.tenantInvitation.delete({ where: { id } });
    }
}
