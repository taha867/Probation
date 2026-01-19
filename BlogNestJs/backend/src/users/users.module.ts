import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from '../entities/User';
import { Post } from '../entities/Post';
import { CloudinaryService } from '../shared/services/cloudinary.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Post]),
  ],
  controllers: [UsersController],
  providers: [UsersService, CloudinaryService],
  exports: [UsersService],
})
export class UsersModule {}

