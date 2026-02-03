import { z } from 'zod';

export const AuthKitConfigSchema = z.object({
    providers: z.array(z.enum(['email', 'google', 'github', 'passkey'])),
    session: z.object({
        strategy: z.enum(['jwt', 'database']).default('database'),
        maxAge: z.number().default(30 * 24 * 60 * 60), // 30 days
    }),
    roles: z.array(z.string()).default(['OWNER', 'ADMIN', 'MEMBER']),
    security: z.object({
        requirePasskeysForAdmins: z.boolean().default(false),
        blockDisposableEmails: z.boolean().default(true),
    }).optional(),
});

export type AuthKitConfig = z.infer<typeof AuthKitConfigSchema>;

export function defineConfig(config: AuthKitConfig) {
    return config;
}
