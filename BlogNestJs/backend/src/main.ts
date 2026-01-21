import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AppExceptionFilter } from './common/filters/httpException.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { LOG_MESSAGES } from './lib/constants';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(helmet()); //Protects against: XSS, Clickjacking, MIME sniffing
  app.use(cookieParser());

  // CORS configuration
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip away properties that do not have any decorators
      forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are present
      transform: true, // Automatically transform payloads to DTO instances
      validateCustomDecorators: true, // Validate custom decorators
      transformOptions: {
        enableImplicitConversion: true, // Automatically converts string query/body parameters to their expected types.
      },
    }),
  );

  // Global exception filter(Error handling Layer)
  app.useGlobalFilters(new AppExceptionFilter());

  // Trust proxy (if behind load balancer/reverse proxy)
  app.set('trust proxy', true);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`${LOG_MESSAGES.APP_RUNNING} ${await app.getUrl()}`);
}
bootstrap();
