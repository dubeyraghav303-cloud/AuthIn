# Security Architecture

## Authentication Flow

1. **Login**: User authenticates via Email/Password or OAuth.
2. **Tokens**:
   - `access_token` (JWT): Short-lived (15m), stored in HTTP-only `SameSite=Lax` cookie.
   - `refresh_token` (Opaque): Long-lived (7d), stored in HTTP-only `SameSite=Lax` cookie (path restricted).
3. **Database**:
   - Refresh tokens are **Hashed** using SHA-256 before storage.
   - Reuse detection is enabled: if a used token is presented, the entire token family is revoked.

## Multi-Tenancy

- **Isolation**: Tenant ID is enforced via `TenantGuard`.
- **Headers**: Clients must send `x-tenant-id` header for tenant-scoped operations.
- **RBAC**: `RolesGuard` verifies user membership and role (OWNER, ADMIN, MEMBER) within the target tenant.

## RBAC & Permissions

| Role  | Access Level |
|-------|--------------|
| OWNER | Full access to tenant settings, billing, and members. |
| ADMIN | Can manage members and integrations. |
| MEMBER| minimal access. |
