import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLog } from '@authkit/db';

@Injectable()
export class AuditService {
    constructor(private prisma: PrismaService) { }

    async logAction(data: {
        action: string;
        userId: string;
        tenantId?: string;
        ipAddress?: string;
        metadata?: any;
    }): Promise<AuditLog> {
        return this.prisma.auditLog.create({
            data: {
                action: data.action,
                userId: data.userId,
                tenantId: data.tenantId,
                ipAddress: data.ipAddress,
                metadata: data.metadata || {},
            },
        });
    }
}
