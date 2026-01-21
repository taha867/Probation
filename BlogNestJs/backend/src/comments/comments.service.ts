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
import { AppException } from '../common/exceptions/app.exception';
import { CreateCommentDto } from './dto/create-comment-input.dto';
import { UpdateCommentDto } from './dto/update-comment-input.dto';
import { ListCommentsQueryDto } from './dto/list-comments-query-payload.dto';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../lib/constants';
const { EITHER_POST_ID_OR_PARENT_ID_REQUIRED, POST_ID_REQUIRED } =
  ERROR_MESSAGES;
const { COMMENT_CREATED, COMMENT_UPDATED } = SUCCESS_MESSAGES;
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
      throw new BadRequestException(EITHER_POST_ID_OR_PARENT_ID_REQUIRED);
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
        throw new NotFoundException(ERROR_MESSAGES.PARENT_COMMENT_NOT_FOUND);
      }

      finalPostId = parentComment.postId;
    } else {
      // This is a top-level comment
      if (!postId) {
        throw new BadRequestException(POST_ID_REQUIRED);
      }

      const post = await this.postRepository.findOne({
        where: { id: postId },
      });

      if (!post) {
        throw new NotFoundException(ERROR_MESSAGES.POST_NOT_FOUND);
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
      message: COMMENT_CREATED,
    };
  }

  async listTopLevelComments(query: ListCommentsQueryDto) {
    const { postId } = query;

    // If postId is provided, validate that the post exists
    if (postId) {
      const post = await this.postRepository.findOne({
        where: { id: postId },
        select: { id: true },
      });

      if (!post) {
        throw new NotFoundException(ERROR_MESSAGES.POST_NOT_FOUND);
      }
    }

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
        author: {
          id: author.id,
          name: author.name,
          email: author.email,
          image: author.image ?? null,
        },
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
        author: {
          id: author.id,
          name: author.name,
          email: author.email,
          image: author.image ?? null,
        },
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
      author: {
        id: author.id,
        name: author.name,
        email: author.email,
        image: author.image ?? null,
      },
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
      throw new NotFoundException(ERROR_MESSAGES.COMMENT_NOT_FOUND);
    }

    if (comment.userId !== userId) {
      throw new ForbiddenException(ERROR_MESSAGES.CANNOT_UPDATE_OTHER_COMMENT);
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
      message: COMMENT_UPDATED,
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
      throw new NotFoundException(ERROR_MESSAGES.COMMENT_NOT_FOUND);
    }

    if (comment.userId !== userId) {
      throw new ForbiddenException(ERROR_MESSAGES.CANNOT_DELETE_OTHER_COMMENT);
    }

    // Delete comment (cascade will delete replies automatically)
    await this.commentRepository.delete(commentId);
  }
}
