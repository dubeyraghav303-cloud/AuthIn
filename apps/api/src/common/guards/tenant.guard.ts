import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { UsersService } from '../../users/users.service';

@Injectable()
export class TenantGuard implements CanActivate {
    constructor(private usersService: UsersService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const tenantId = request.params.tenantId || request.headers['x-tenant-id'];

        if (!user || !tenantId) {
            throw new ForbiddenException('User or Tenant ID missing');
        }

        const member = await this.usersService.findTenantMember(user.id, tenantId);
        if (!member) {
            throw new ForbiddenException('User is not a member of this tenant');
        }

        // Attach membership to request for decorators
        request.member = member;
        return true;
    }
}
