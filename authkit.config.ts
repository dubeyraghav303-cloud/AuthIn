import { defineConfig } from '@authkit/config';

export default defineConfig({
    providers: ['email', 'google', 'passkey'],
    session: {
        strategy: 'database',
        maxAge: 7 * 24 * 60 * 60, // 7 days
    },
    roles: ['OWNER', 'ADMIN', 'MEMBER', 'BILLING'],
    security: {
        requirePasskeysForAdmins: true,
        blockDisposableEmails: true,
    },
});
