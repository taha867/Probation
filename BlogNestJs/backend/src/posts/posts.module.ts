import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { Post } from './post.entity';
import { Comment } from '../comments/comment.entity';
import { User } from '../users/user.entity';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { PaginationModule } from '../pagination/pagination.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, Comment, User]),
    CloudinaryModule,
    PaginationModule,
  ],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
