import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AuthController (e2e)', () => {
    let app: INestApplication;
    let authTokens: { access_token: string; refresh_token: string };

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();
    });

    const email = `test-${Date.now()}@example.com`;
    const password = 'StrongPassword123!';

    it('/auth/register (POST)', () => {
        return request(app.getHttpServer())
            .post('/auth/register')
            .send({ email, password, name: 'Test User' })
            .expect(201)
            .expect((res) => {
                expect(res.body).toHaveProperty('access_token');
                expect(res.body).toHaveProperty('refresh_token');
                expect(res.body.user).toHaveProperty('email', email);
                authTokens = res.body;
            });
    });

    it('/auth/login (POST)', () => {
        return request(app.getHttpServer())
            .post('/auth/login')
            .send({ email, password })
            .expect(201)
            .expect((res) => {
                expect(res.body).toHaveProperty('access_token');
                expect(res.body).toHaveProperty('refresh_token');
            });
    });

    it('/auth/profile (GET) - with token', () => {
        return request(app.getHttpServer())
            .get('/auth/profile')
            .set('Authorization', `Bearer ${authTokens.access_token}`)
            .expect(200)
            .expect((res) => {
                expect(res.body).toHaveProperty('username', email);
            });
    });

    it('/auth/refresh (POST)', async () => {
        await new Promise((resolve) => setTimeout(resolve, 1100)); // Ensure JWT iat diff
        return request(app.getHttpServer())
            .post('/auth/refresh')
            .send({ refresh_token: authTokens.refresh_token })
            .expect(201)
            .expect((res) => {
                expect(res.body).toHaveProperty('access_token');
                expect(res.body).toHaveProperty('refresh_token');
                expect(res.body.access_token).not.toEqual(authTokens.access_token);
            });
    });

    afterAll(async () => {
        await app.close();
    });
});
