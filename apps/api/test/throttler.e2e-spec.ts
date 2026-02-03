import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Throttler (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    const email = `throttle-${Date.now()}@example.com`;
    const password = 'StrongPassword123!';

    // The register endpoint has a limit of 3 per minute
    it('should rate limit /auth/register', async () => {
        let limited = false;
        for (let i = 0; i < 10; i++) {
            const res = await request(app.getHttpServer())
                .post('/auth/register')
                .send({ email, password, name: `T${i}` });

            if (res.status === 429) {
                limited = true;
                break;
            }
        }
        expect(limited).toBe(true);
    });

    afterAll(async () => {
        await app.close();
    });
});
