import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
const cookieSession = require('cookie-session');
import * as cookieParser from 'cookie-parser';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    cookieSession({
      name: process.env.COOKIE_NAME,
      keys: [process.env.COOKIE_KEYS],

      maxAge: 4 * 60 * 60 * 1000, // 4 hours
    }),
  );
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.enableCors({
    origin: [
      'http://localhost:5173', // or other port you listen to in your front-end

      //'https://your-production/dev-url.com', // or add your production URL here
    ],
    credentials: true,
  });
  await app.listen(3001);
}
bootstrap();
