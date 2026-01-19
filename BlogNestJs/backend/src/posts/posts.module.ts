import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { Post } from '../entities/Post';
import { Comment } from '../entities/Comment';
import { CloudinaryService } from '../shared/services/cloudinary.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, Comment]),
  ],
  controllers: [PostsController],
  providers: [PostsService, CloudinaryService],
  exports: [PostsService],
})
export class PostsModule {}

