import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './config/data-source-options';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { AuthGuard } from './users/auth/guards/auth.guard';
import { UserSubscriber } from './users/subscribers/user.subscriber';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigService available globally
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      ...dataSourceOptions,
      autoLoadEntities: true,
      subscribers: [UserSubscriber], // Register TypeORM entity subscriber
    }),
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60000, // 1 minute
        limit: 20, // 20 requests per minute
      },
      {
        name: 'login', // Login endpoint
        ttl: 60000, // 1 minute
        limit: 5, // 5 login attempts per minute
      },
    ]),
    UsersModule,
    PostsModule,
    CommentsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard, // rate limiting guard, throws 429 if limit exceeds
    },
  ],
})
export class AppModule {}
