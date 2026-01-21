import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  BadRequestException,
  NotFoundException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post-input.dto';
import { UpdatePostDto } from './dto/update-post-input.dto';
import { ListPostsQueryDto } from './dto/list-posts-query-payload.dto';
import { PaginationQueryDto } from './dto/pagination-query-input.dto';
import { User } from '../customDecorators/user.decorator';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../lib/constants';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createPostDto: CreatePostDto,
    @User('id') userId: number,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.postsService.createPost(createPostDto, userId, file);
  }

  @Get()
  async list(@Query() query: ListPostsQueryDto) {
    return this.postsService.listPosts(query);
  }

  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number) {
    const post = await this.postsService.findPostWithAuthor(id);
    if (!post) {
      throw new NotFoundException(ERROR_MESSAGES.POST_NOT_FOUND);
    }
    return {
      data: post,
    };
  }

  @Get(':postId/comments')
  async getPostComments(
    @Param('postId', ParseIntPipe) postId: number,
    @Query() query: PaginationQueryDto,
  ) {
    return this.postsService.getPostWithComments(postId, query);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
    @User('id') userId: number,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    // Check if at least one field is being updated
    const hasBodyFields = Object.keys(updatePostDto).length > 0;
    const hasFileUpload = file !== undefined;

    if (!hasBodyFields && !hasFileUpload) {
      throw new BadRequestException(ERROR_MESSAGES.AT_LEAST_ONE_FIELD_REQUIRED);
    }

    return this.postsService.updatePost(id, userId, updatePostDto, file);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @User('id') userId: number,
  ) {
    await this.postsService.deletePost(id, userId);
    return {
      data: { message: SUCCESS_MESSAGES.POST_DELETED },
    };
  }
}
