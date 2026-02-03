import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Auth Reuse (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    const email = `reuse-${Date.now()}@example.com`;
    const password = 'StrongPassword123!';

    it('should detect reuse and revoke family', async () => {
        // 1. Register
        const regRes = await request(app.getHttpServer())
            .post('/auth/register')
            .send({ email, password })
            .expect(201);

        let token1 = regRes.body.refresh_token;

        // 2. Refresh (Token1 -> Token2)
        await new Promise((r) => setTimeout(r, 100)); // ensure unique timestamps if needed
        const refRes = await request(app.getHttpServer())
            .post('/auth/refresh')
            .send({ refresh_token: token1 })
            .expect(201);

        let token2 = refRes.body.refresh_token;

        // 3. Reuse Token1 (Should Fail and Revoke Family)
        await request(app.getHttpServer())
            .post('/auth/refresh')
            .send({ refresh_token: token1 })
            .expect(401);

        // 4. Try Token2 (Should now be invalid because family revoked)
        await request(app.getHttpServer())
            .post('/auth/refresh')
            .send({ refresh_token: token2 })
            .expect(401);
    });

    afterAll(async () => {
        await app.close();
    });
});
