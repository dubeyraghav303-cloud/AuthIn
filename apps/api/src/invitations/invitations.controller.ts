import { Controller, Post, Get, Delete, Body, Param, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@authkit/db';
import { Tenant } from '../common/decorators/tenant.decorator';

@Controller('invitations')
export class InvitationsController {
    constructor(private invitationsService: InvitationsService) { }

    @Post('accept')
    @UseGuards(JwtAuthGuard)
    async accept(@Body('token') token: string, @Request() req: any) {
        return this.invitationsService.accept(token, req.user.id);
    }

    @Post(':tenantId')
    @UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
    @Roles(Role.OWNER, Role.ADMIN)
    async create(
        @Tenant() tenantId: string,
        @Body('email') email: string,
        @Body('role') role: Role,
        @Request() req: any
    ) {
        return this.invitationsService.create(tenantId, email, role, req.user.id);
    }

    @Get(':tenantId')
    @UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
    @Roles(Role.OWNER, Role.ADMIN)
    async list(@Tenant() tenantId: string) {
        return this.invitationsService.list(tenantId);
    }

    @Delete(':tenantId/:id')
    @UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
    @Roles(Role.OWNER, Role.ADMIN)
    async delete(@Tenant() tenantId: string, @Param('id') id: string) {
        return this.invitationsService.delete(id, tenantId);
    }
}
