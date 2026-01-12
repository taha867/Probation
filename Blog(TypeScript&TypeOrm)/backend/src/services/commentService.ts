import { AppDataSource } from "../config/data-source.js";
import { Comment } from "../entities/Comment.js";
import { HTTP_STATUS } from "../utils/constants.js";
import { AppError } from "../utils/errors.js";
import {
  CommentRepository,
  PostRepository,
} from "../repositories/index.js";
import {
  CreateCommentServiceInput,
  CreateCommentServiceResult,
  UpdateCommentServiceInput,
  UpdateCommentServiceResult,
  DeleteCommentServiceInput,
  ListCommentsServiceInput,
  ListCommentsServiceResult,
  CommentWithAuthor,
  CommentWithRelations,
} from "../interfaces/commentInterface.js";
import type { ServiceResult } from "../interfaces/commonInterface.js";
import type { BaseUserProfile } from "../interfaces/userInterface.js";

const { NOT_FOUND, FORBIDDEN, INTERNAL_SERVER_ERROR, BAD_REQUEST } = HTTP_STATUS;

/**
 * Maps author data to BaseUserProfile
 * Helper function to avoid duplication and ensure consistency
 *
 * @param authorData - Author data from TypeORM relation (can be null/undefined)
 * @returns BaseUserProfile object
 */
const mapAuthorData = (authorData: any): BaseUserProfile => {
  if (!authorData) {
    throw new Error(
      "Author data missing - TypeORM relation may be misconfigured"
    );
  }
  const { id, name, email, image } = authorData;
  return {
    id,
    name,
    email,
    image: image || null,
  };
};


/**
 * Comment Service
 * Handles comment-related business logic including CRUD operations
 * Supports nested comments (replies) with self-referential relationships
 */
export class CommentService {
  /**
   * Comment repository instance
   * Used for database operations on Comment table
   */
  private commentRepo: CommentRepository;

  /**
   * Post repository instance
   * Used for validating post existence
   */
  private postRepo: PostRepository;

  /**
   * Constructor initializes the service with repositories
   * Supports dependency injection for testability
   */
  constructor(
    commentRepo?: CommentRepository,
    postRepo?: PostRepository
  ) {
    this.commentRepo = commentRepo || new CommentRepository(AppDataSource);
    this.postRepo = postRepo || new PostRepository(AppDataSource);
  }

  /**
   * Create a new comment or reply to an existing comment
   * Handles both top-level comments and nested replies
   * 
   * @param params - Create parameters
   * @param params.authUserId - ID of user creating the comment
   * @param params.data - Comment data (body, postId or parentId)
   * @returns Promise resolving to created comment with relations
   * @throws AppError if post/parent comment not found
   */
  async createCommentOrReply(
    params: CreateCommentServiceInput
  ): Promise<CreateCommentServiceResult> {
    const { authUserId, data } = params;
    const { body, postId, parentId } = data;

    let finalPostId: number;

    if (parentId) {
      // This is a reply to another comment
      const parentComment = await this.commentRepo.findByIdWithFields(parentId, [
        "id",
        "postId",
      ]);

      if (!parentComment) {
        throw new AppError("PARENT_COMMENT_NOT_FOUND", NOT_FOUND);
      }

      finalPostId = parentComment.postId;
    } else {
      // This is a top-level comment
      if (!postId) {
        throw new AppError("POST_ID_REQUIRED", BAD_REQUEST);
      }

      const post = await this.postRepo.findById(postId);
      if (!post) {
        throw new AppError("POST_NOT_FOUND", NOT_FOUND);
      }

      finalPostId = postId;
    }

    const comment = new Comment();
    comment.body = body;
    comment.postId = finalPostId;
    comment.userId = authUserId;
    comment.parentId = parentId || null;

    await this.commentRepo.save(comment);

    // Use repository method to fetch created comment with relations
    const createdComment = await this.commentRepo.findWithRelations(comment.id);

    if (!createdComment) {
      throw new AppError("COMMENT_CREATION_FAILED", INTERNAL_SERVER_ERROR);
    }

    const commentResult: CommentWithRelations = createdComment;

    return {
      ok: true,
      data: commentResult,
    };
  }

  /**
   * List top-level comments, optionally filtered by post
   * 
   * @param params - Query parameters
   * @param params.postId - Optional post ID to filter comments
   * @returns Promise resolving to array of comments with author and post
   */
  async listTopLevelComments(
    params: ListCommentsServiceInput
  ): Promise<ListCommentsServiceResult> {
    const { postId } = params;

    // Use repository method to load comments
    const comments = await this.commentRepo.findAllTopLevel(postId);

    // Map TypeORM entities to CommentWithAuthor interface
    const commentRows: CommentWithAuthor[] = comments.map((comment: any) => {
      return {
        id: comment.id,
        body: comment.body,
        postId: comment.postId,
        userId: comment.userId,
        parentId: comment.parentId ?? null,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        author: mapAuthorData(comment.author),
      };
    });

    return commentRows;
  }

  /**
   * Find comment by ID with all related entities (author, post, replies)
   * 
   * @param id - Comment ID to find
   * @returns Promise resolving to comment with relations or null if not found
   */
  async findCommentWithRelations(id: number): Promise<CommentWithRelations | null> {
    // Use repository method to get comment with relations
    const comment = await this.commentRepo.findWithRelations(id);

    if (!comment) {
      return null;
    }

    // Load replies for this comment (if any)
    const replies = await this.commentRepo.findByParentId(id);

    // Map replies to CommentWithAuthor interface
    const replyRows: CommentWithAuthor[] = replies.map((reply) => {
      return {
        id: reply.id,
        body: reply.body,
        postId: reply.postId,
        userId: reply.userId,
        parentId: reply.parentId ?? null,
        createdAt: reply.createdAt,
        updatedAt: reply.updatedAt,
        author: mapAuthorData(reply.author),
      };
    });

    return {
      ...comment,
      replies: replyRows,
    };
  }

  /**
   * Update comment (owner-only)
   * Users can only update their own comments
   * 
   * @param params - Update parameters
   * @param params.commentId - ID of comment to update
   * @param params.authUserId - ID of authenticated user (must match comment owner)
   * @param params.body - New comment body
   * @returns Promise resolving to updated comment with relations
   * @throws AppError if comment not found or unauthorized
   */
  async updateCommentForUser(
    params: UpdateCommentServiceInput
  ): Promise<UpdateCommentServiceResult> {
    const { commentId, authUserId, body } = params;

    const comment = await this.commentRepo.findByIdWithFields(commentId, [
      "id",
      "userId",
    ]);

    if (!comment) {
      throw new AppError("COMMENT_NOT_FOUND", NOT_FOUND);
    }

    if (comment.userId !== authUserId) {
      throw new AppError("CANNOT_UPDATE_OTHER_COMMENT", FORBIDDEN);
    }

    // Use repository method for update
    await this.commentRepo.update(commentId, { body });

    const updated = await this.findCommentWithRelations(commentId);
    
    if (!updated) {
      throw new AppError("COMMENT_UPDATE_FAILED", INTERNAL_SERVER_ERROR);
    }

    return {
      ok: true,
      data: updated,
    };
  }

  /**
   * Delete comment (owner-only)
   * Users can only delete their own comments
   * Cascades to replies automatically via database constraints
   * 
   * @param params - Delete parameters
   * @param params.commentId - ID of comment to delete
   * @param params.authUserId - ID of authenticated user (must match comment owner)
   * @returns Promise resolving to success response
   * @throws AppError if comment not found or unauthorized
   */
  async deleteCommentForUser(
    params: DeleteCommentServiceInput
  ): Promise<ServiceResult<void>> {
    const { commentId, authUserId } = params;

    const comment = await this.commentRepo.findByIdWithFields(commentId, [
      "id",
      "userId",
    ]);

    if (!comment) {
      throw new AppError("COMMENT_NOT_FOUND", NOT_FOUND);
    }

    if (comment.userId !== authUserId) {
      throw new AppError("CANNOT_DELETE_OTHER_COMMENT", FORBIDDEN);
    }

    // Use repository method for deletion
    await this.commentRepo.deleteWithQueryBuilder(commentId);

    return { ok: true };
  }
}

// Export singleton instance
export const commentService = new CommentService();
