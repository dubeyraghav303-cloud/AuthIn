import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

import cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  // Security: Trust Proxy (Required for correct IP/Protocol detection behind Nginx/ELB)
  app.set('trust proxy', 1); // 1 = trust first proxy

  app.use(cookieParser());

  app.enableCors({
    origin: process.env.ORIGIN || 'http://localhost:3000',
    credentials: true, // Required for cookies
  });

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
