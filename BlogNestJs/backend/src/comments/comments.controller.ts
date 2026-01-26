import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment-input.dto';
import { UpdateCommentDto } from './dto/update-comment-input.dto';
import { ListCommentsQueryDto } from './dto/list-comments-query-payload.dto';
import { User } from '../custom-decorators/user.decorator';
import { Public } from '../custom-decorators/public.decorator';
import { SUCCESS_MESSAGES } from '../lib/constants';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @User('id') userId: number,
  ) {
    return this.commentsService.createCommentOrReply(createCommentDto, userId);
  }

  @Public()
  @Get()
  async list(@Query() query: ListCommentsQueryDto) {
    return this.commentsService.listTopLevelComments(query);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCommentDto: UpdateCommentDto,
    @User('id') userId: number,
  ) {
    return this.commentsService.updateComment(id, userId, updateCommentDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @User('id') userId: number,
  ) {
    await this.commentsService.deleteComment(id, userId);
    return {
      data: { message: SUCCESS_MESSAGES.COMMENT_DELETED },
    };
  }
}
