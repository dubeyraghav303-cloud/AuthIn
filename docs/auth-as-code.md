# Auth-as-Code

AuthKit allows you to define your authentication logic, roles, and security policies as code.

## `authkit.config.ts`

Place this file in the root of your project:

```typescript
import { defineConfig } from '@authkit/config';

export default defineConfig({
  providers: ['email', 'google', 'passkey'],
  roles: ['OWNER', 'ADMIN', 'MEMBER'],
  security: {
    requirePasskeysForAdmins: true,
    blockDisposableEmails: true,
  },
});
```

## Syncing

To apply changes to your database:

```bash
pnpm authkit sync
```

This ensures your database state (Roles, Policies) always matches your codebase.
