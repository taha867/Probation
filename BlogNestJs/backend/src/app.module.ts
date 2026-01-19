import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { DatabaseModule } from './config/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { AuthGuard } from './auth/guards/auth.guard';

@Module({
  imports: [
    DatabaseModule, // ← Database connection (TypeORM)
    CommonModule, // ← Shared utilities
    AuthModule, // ← Authentication routes (/auth/*)
    UsersModule, // ← User routes (/users/*)
    PostsModule, // ← Post routes (/posts/*)
    CommentsModule, // ← Comment routes (/comments/*)
    // Global rate limiting configuration
    ThrottlerModule.forRoot([
      {
        name: 'short', // Short-lived requests (e.g., login)
        ttl: 1000, 
        limit: 3, // max 3 requests per second
      },
      {
        name: 'default', // General API usage
        ttl: 60000, // 1 minute
        limit: 20, // 20 requests per minute
      },
      {
        name: 'login', // Login endpoint
        ttl: 60000, // 1 minute
        limit: 5, // 5 login attempts per minute
      },
    ]),
  ],
  controllers: [AppController],
  providers: [ // providers are injectable classes
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard, // Global auth guard
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard, // Global rate limiting guard
    },
  ],
})
export class AppModule {}

