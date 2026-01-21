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
  NotFoundException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment-input.dto';
import { UpdateCommentDto } from './dto/update-comment-input.dto';
import { ListCommentsQueryDto } from './dto/list-comments-query-payload.dto';
import { User } from '../customDecorators/user.decorator';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../lib/constants';

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

  @Get()
  async list(@Query() query: ListCommentsQueryDto) {
    return this.commentsService.listTopLevelComments(query);
  }

  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number) {
    const comment = await this.commentsService.findCommentWithRelations(id);
    if (!comment) {
      throw new NotFoundException(ERROR_MESSAGES.COMMENT_NOT_FOUND);
    }
    return {
      data: comment,
    };
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
