import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { Post } from '../posts/post.entity';
import { mapAuthorData } from '../lib/utils/mappers';
import { AppException } from '../common/exceptions/app.exception';
import { CreateCommentDto } from './dto/createComment.dto';
import { UpdateCommentDto } from './dto/updateComment.dto';
import { ListCommentsQueryDto } from './dto/listCommentsQuery.dto';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../lib/constants';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async createCommentOrReply(
    createCommentDto: CreateCommentDto,
    userId: number,
  ) {
    const { body, postId, parentId } = createCommentDto;

    // Validate that either postId or parentId is provided
    if (!postId && !parentId) {
      throw new BadRequestException(
        ERROR_MESSAGES.EITHER_POST_ID_OR_PARENT_ID_REQUIRED,
      );
    }

    let finalPostId: number;

    if (parentId) {
      // This is a reply to another comment
      const parentComment = await this.commentRepository.findOne({
        where: { id: parentId },
        select: {
          id: true,
          postId: true,
        },
      });

      if (!parentComment) {
        throw new NotFoundException('PARENT_COMMENT_NOT_FOUND');
      }

      finalPostId = parentComment.postId;
    } else {
      // This is a top-level comment
      if (!postId) {
        throw new BadRequestException(ERROR_MESSAGES.POST_ID_REQUIRED);
      }

      const post = await this.postRepository.findOne({
        where: { id: postId },
      });

      if (!post) {
        throw new NotFoundException('POST_NOT_FOUND');
      }

      finalPostId = postId;
    }

    // Create comment
    const comment = this.commentRepository.create({
      body,
      postId: finalPostId,
      userId,
      parentId: parentId || null,
    });

    await this.commentRepository.save(comment);

    // Fetch created comment with relations
    const createdComment = await this.findCommentWithRelations(comment.id);

    if (!createdComment) {
      throw new AppException(
        'COMMENT_CREATION_FAILED',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      data: createdComment,
      message: SUCCESS_MESSAGES.COMMENT_CREATED,
    };
  }

  async listTopLevelComments(query: ListCommentsQueryDto) {
    const { postId } = query;

    const whereCondition: any = {
      parentId: null, // Only top-level comments
    };

    if (postId) {
      whereCondition.postId = postId;
    }

    const comments = await this.commentRepository.find({
      where: whereCondition,
      relations: { author: true },
      select: {
        id: true,
        body: true,
        postId: true,
        userId: true,
        parentId: true,
        createdAt: true,
        updatedAt: true,
        author: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });

    const commentRows = comments.map((comment) => {
      const {
        id,
        body,
        postId,
        userId,
        parentId,
        createdAt,
        updatedAt,
        author,
      } = comment;
      return {
        id,
        body,
        postId,
        userId,
        parentId: parentId ?? null,
        createdAt,
        updatedAt,
        author: mapAuthorData(author),
      };
    });

    return {
      data: commentRows,
    };
  }

  async findCommentWithRelations(id: number) {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: { author: true, post: true },
      select: {
        id: true,
        body: true,
        postId: true,
        userId: true,
        parentId: true,
        createdAt: true,
        updatedAt: true,
        author: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
        post: {
          id: true,
          title: true,
        },
      },
    });

    if (!comment) {
      return null;
    }

    // Load replies for this comment
    const replies = await this.commentRepository.find({
      where: { parentId: id },
      relations: { author: true },
      select: {
        id: true,
        body: true,
        postId: true,
        userId: true,
        parentId: true,
        createdAt: true,
        updatedAt: true,
        author: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      order: {
        createdAt: 'ASC',
      },
    });

    const replyRows = replies.map((reply) => {
      const {
        id,
        body,
        postId,
        userId,
        parentId,
        createdAt,
        updatedAt,
        author,
      } = reply;
      return {
        id,
        body,
        postId,
        userId,
        parentId: parentId ?? null,
        createdAt,
        updatedAt,
        author: mapAuthorData(author),
      };
    });

    const {
      id: commentId,
      body,
      postId,
      userId,
      parentId,
      createdAt,
      updatedAt,
      author,
      post,
    } = comment;

    return {
      id: commentId,
      body,
      postId,
      userId,
      parentId: parentId ?? null,
      createdAt,
      updatedAt,
      author: mapAuthorData(author),
      post: {
        id: post.id,
        title: post.title,
      },
      replies: replyRows,
    };
  }

  async updateComment(
    commentId: number,
    userId: number,
    updateCommentDto: UpdateCommentDto,
  ) {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('COMMENT_NOT_FOUND');
    }

    if (comment.userId !== userId) {
      throw new ForbiddenException('CANNOT_UPDATE_OTHER_COMMENT');
    }

    // Update comment
    comment.body = updateCommentDto.body;
    await this.commentRepository.save(comment);

    // Fetch updated comment with relations
    const updated = await this.findCommentWithRelations(commentId);

    if (!updated) {
      throw new AppException(
        'COMMENT_UPDATE_FAILED',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      data: updated,
      message: SUCCESS_MESSAGES.COMMENT_UPDATED,
    };
  }

  async deleteComment(commentId: number, userId: number) {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
      select: {
        id: true,
        userId: true,
      },
    });

    if (!comment) {
      throw new NotFoundException('COMMENT_NOT_FOUND');
    }

    if (comment.userId !== userId) {
      throw new ForbiddenException('CANNOT_DELETE_OTHER_COMMENT');
    }

    // Delete comment (cascade will delete replies automatically)
    await this.commentRepository.delete(commentId);
  }
}
