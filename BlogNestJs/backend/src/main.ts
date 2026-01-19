
import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core'; // A factory class that creates a NestJS application instance
import { AppModule } from './app.module'; // The root module of the application
import { ValidationPipe } from '@nestjs/common'; // A global validation pipe that validates all DTOs automatically
import { AppExceptionFilter } from './common/filters/http-exception.filter'; // A global exception filter that catches all errors
import { NestExpressApplication } from '@nestjs/platform-express'; // A class that extends the Express application class
import helmet from 'helmet'; // A middleware that sets various HTTP headers for security
import cookieParser from 'cookie-parser'; // A middleware that parses cookies from the request

async function bootstrap() {
  // Environment variables are already loaded above

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Security middleware (ORDER MATTERS!)
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
      validateCustomDecorators: true,
      transformOptions: {
        enableImplicitConversion: true, // Automatically transform primitive types
      },
    }),
  );

  // Global exception filter(Error handling Layer)
  app.useGlobalFilters(new AppExceptionFilter());

  // Trust proxy (if behind load balancer/reverse proxy)
  app.set('trust proxy', true);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();

