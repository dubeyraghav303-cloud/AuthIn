import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '@authkit/db';
import { UsersService } from '../../users/users.service';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector, private usersService: UsersService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const tenantId = request.params.tenantId || request.headers['x-tenant-id'];

        if (!user || !tenantId) {
            throw new ForbiddenException('User or Tenant ID missing for RBAC check');
        }

        const member = await this.usersService.findTenantMember(user.id, tenantId);
        if (!member) {
            throw new ForbiddenException('User is not a member of this tenant');
        }

        // Role Hierarchy: OWNER > ADMIN > MEMBER
        // Simple check: Exact match or hierarchy if we implement it.
        // For now, assume exact match or include hierarchy logic.
        // Let's implement simple hierarchy:
        // If required is MEMBER, OWNER/ADMIN also passes.

        const roleHierarchy = {
            [Role.OWNER]: 3,
            [Role.ADMIN]: 2,
            [Role.MEMBER]: 1,
            [Role.GUEST]: 0,
        };

        const memberRoleLevel = roleHierarchy[member.role] || 0;

        // Check if member has AT LEAST one of the required roles logic or simpler "has sufficient privilege"
        // Usually @Roles(ADMIN) means ADMIN or higher.

        const hasRole = requiredRoles.some((role) => memberRoleLevel >= roleHierarchy[role]);

        return hasRole;
    }
}
