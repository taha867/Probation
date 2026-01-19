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
import { CreateCommentDto } from './dto/createComment.dto';
import { UpdateCommentDto } from './dto/updateComment.dto';
import { ListCommentsQueryDto } from './dto/listCommentsQuery.dto';
import { User } from '../common/decorators/user.decorator';
import { SUCCESS_MESSAGES } from '../shared/constants/constants';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @User('id') userId: number
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
      throw new NotFoundException('COMMENT_NOT_FOUND');
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
    @User('id') userId: number
  ) {
    return this.commentsService.updateComment(id, userId, updateCommentDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @User('id') userId: number
  ) {
    await this.commentsService.deleteComment(id, userId);
    return {
      data: { message: SUCCESS_MESSAGES.COMMENT_DELETED },
    };
  }
}

