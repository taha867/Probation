import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './config/data-source-options';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { AuthGuard } from './users/auth/guards/auth.guard';

// Exclude migrations from runtime config (only needed for CLI)
const { migrations, migrationsTableName, ...nestOptions } = dataSourceOptions;

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...nestOptions,
      autoLoadEntities: true,
    }),
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
    UsersModule, // ← User routes (/users/*) and Auth routes (/auth/*)
    PostsModule, // ← Post routes (/posts/*)
    CommentsModule, // ← Comment routes (/comments/*)
  ],
  controllers: [],
  providers: [
    // providers are injectable classes
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
