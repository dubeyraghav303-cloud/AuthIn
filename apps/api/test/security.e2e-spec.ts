import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, Controller, Get, UseGuards, SetMetadata } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import cookieParser from 'cookie-parser';
import { RolesGuard } from '../src/common/guards/roles.guard';
import { TenantGuard } from '../src/common/guards/tenant.guard';
import { Roles } from '../src/common/decorators/roles.decorator';
import { Role } from '@authkit/db';
import { Tenant } from '../src/common/decorators/tenant.decorator';
import { UsersModule } from '../src/users/users.module';
import * as argon2 from 'argon2';

import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard';

@Controller('test')
@UseGuards(JwtAuthGuard, RolesGuard, TenantGuard)
class TestController {
    @Get('admin')
    @Roles(Role.ADMIN)
    adminOnly() {
        return 'admin';
    }

    @Get('tenant')
    tenantOnly(@Tenant() tenantId: string) {
        return { tenantId };
    }
}

describe('Security (e2e)', () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let userOwner: any;
    let userMember: any;
    let tenantA: any;
    let tenantB: any;
    let ownerToken: string;
    let memberToken: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule, UsersModule],
            controllers: [TestController],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        app.use(cookieParser());
        app.useLogger(['error', 'warn', 'log', 'debug', 'verbose']);
        await app.init();

        prisma = app.get<PrismaService>(PrismaService);

        // Clean DB
        await prisma.authenticator.deleteMany();
        await prisma.session.deleteMany();
        await prisma.tenantMember.deleteMany();
        await prisma.auditLog.deleteMany();
        await prisma.user.deleteMany();
        await prisma.tenant.deleteMany();

        // Setup Tenants
        tenantA = await prisma.tenant.create({ data: { name: 'Tenant A', slug: 'tenant-a' } });
        tenantB = await prisma.tenant.create({ data: { name: 'Tenant B', slug: 'tenant-b' } });

        const passwordHash = await argon2.hash('password123');

        // Setup Owner (Admin in Tenant A)
        userOwner = await prisma.user.create({
            data: {
                email: 'owner@example.com',
                passwordHash: passwordHash,
                name: 'Owner',
            }
        });
        await prisma.tenantMember.create({
            data: { userId: userOwner.id, tenantId: tenantA.id, role: 'ADMIN' }
        });

        // Setup Member (Member in Tenant A)
        userMember = await prisma.user.create({
            data: {
                email: 'member@example.com',
                passwordHash: passwordHash,
                name: 'Member',
            }
        });
        await prisma.tenantMember.create({
            data: { userId: userMember.id, tenantId: tenantA.id, role: 'MEMBER' }
        });

        // Get Tokens (Login)
        // Owner
        const resOwner = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ email: 'owner@example.com', password: 'password123' });

        if (resOwner.status !== 201) {
            console.error('Owner Login Failed:', resOwner.body);
        }

        expect(resOwner.status).toBe(201);
        const cookiesOwner = [resOwner.headers['set-cookie']].flat();
        ownerToken = cookiesOwner.find(c => c && c.startsWith('access_token')).split(';')[0];

        // Member
        const resMember = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ email: 'member@example.com', password: 'password123' });

        if (resMember.status !== 201) {
            console.error('Member Login Failed:', resMember.body);
        }

        expect(resMember.status).toBe(201);
        const cookiesMember = [resMember.headers['set-cookie']].flat();
        memberToken = cookiesMember.find(c => c && c.startsWith('access_token')).split(';')[0];
    });

    afterAll(async () => {
        await app.close();
    });

    describe('Cookies & Hashing', () => {
        it('should return http-only cookies', async () => {
            const res = await request(app.getHttpServer())
                .post('/auth/login')
                .send({ email: 'owner@example.com', password: 'password123' });
            const cookies = [res.headers['set-cookie']].flat();
            expect(JSON.stringify(cookies)).toContain('HttpOnly');
        });
    });

    describe('RBAC', () => {
        it('Admin should access admin endpoint', async () => {
            await request(app.getHttpServer())
                .get('/test/admin')
                .set('Cookie', [ownerToken])
                .set('x-tenant-id', tenantA.id)
                .expect(200);
        });

        it('Member should NOT access admin endpoint', async () => {
            await request(app.getHttpServer())
                .get('/test/admin')
                .set('Cookie', [memberToken])
                .set('x-tenant-id', tenantA.id)
                .expect(403);
        });
    });

    describe('Tenant Boundary', () => {
        it('Member of Tenant A should access Tenant A', async () => {
            await request(app.getHttpServer())
                .get('/test/tenant')
                .set('Cookie', [memberToken])
                .set('x-tenant-id', tenantA.id)
                .expect(200)
                .expect(res => expect(res.body.tenantId).toBe(tenantA.id));
        });

        it('Member of Tenant A should NOT access Tenant B', async () => {
            await request(app.getHttpServer())
                .get('/test/tenant')
                .set('Cookie', [memberToken])
                .set('x-tenant-id', tenantB.id)
                .expect(403); // TenantGuard should block
        });
    });
});
