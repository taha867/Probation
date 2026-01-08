import { Model, ModelStatic } from "sequelize";
import models from "../models/index.js";
import { HTTP_STATUS } from "../utils/constants.js";
import { AppError } from "../utils/errors.js";
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
  CommentModelData,
  CommentUserId,
  CommentPostId,
} from "../interfaces/commentInterface.js";
import type { ServiceResult } from "../interfaces/commonInterface.js";
import { DatabaseModels } from "../models/index.js";

const { NOT_FOUND, FORBIDDEN } = HTTP_STATUS;

/**
 * Sequelize model types
 * Type definitions for dynamically loaded models
 */
type CommentModel = ModelStatic<Model<any, any>> & {
  create: (values: any) => Promise<Model<any, any>>;
  findByPk: (id: number) => Promise<Model<any, any> | null>;
  findAll: (options?: any) => Promise<Model<any, any>[]>;
};

type PostModel = ModelStatic<Model<any, any>> & {
  findByPk: (id: number) => Promise<Model<any, any> | null>;
};

type UserModel = ModelStatic<Model<any, any>> & {
  // User model methods
};

/**
 * Comment Service
 * Handles comment-related business logic including CRUD operations
 * Supports nested comments (replies) with self-referential relationships
 */
export class CommentService {
  /**
   * Comment model instance
   * Used for database operations on Comment table
   */
  private Comment: CommentModel;

  /**
   * Post model instance
   * Used for validating post existence
   */
  private Post: PostModel;

  /**
   * User model instance
   * Used for fetching author information
   */
  private User: UserModel;

  /**
   * Include configuration for author
   * Reusable include configuration for fetching comment author
   */
  private includeAuthor: {
    model: UserModel;
    as: "author";
    attributes: string[];
  };

  /**
   * Include configuration for post
   * Reusable include configuration for fetching comment post
   */
  private includePost: {
    model: PostModel;
    as: "post";
    attributes: string[];
  };

  /**
   * Constructor initializes the service with database models
   * 
   * @param models - Database models object containing all Sequelize models
   */
  constructor(models: DatabaseModels) {
    // Type assertions: We know these models exist in models object
    this.Comment = models.Comment as CommentModel;
    this.Post = models.Post as PostModel;
    this.User = models.User as UserModel;

    this.includeAuthor = {
      model: this.User,
      as: "author",
      attributes: ["id", "name", "email"],
    };

    this.includePost = {
      model: this.Post,
      as: "post",
      attributes: ["id", "title"],
    };
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
      const parentComment = await this.Comment.findByPk(parentId);
      if (!parentComment) {
        throw new AppError("PARENT_COMMENT_NOT_FOUND", NOT_FOUND);
      }
      // Reuses CommentPostId type to avoid redundant type definitions
      const { postId: finalPostIdFromParent } = parentComment.get() as CommentPostId;
      finalPostId = finalPostIdFromParent;
    } else {
      // This is a top-level comment
      if (!postId) {
        throw new AppError("POST_ID_REQUIRED", HTTP_STATUS.BAD_REQUEST);
      }
      const post = await this.Post.findByPk(postId);
      if (!post) {
        throw new AppError("POST_NOT_FOUND", NOT_FOUND);
      }
      finalPostId = postId;
    }

    const comment = await this.Comment.create({
      body,
      postId: finalPostId,
      userId: authUserId,
      parentId: parentId || null,
    });

    const createdComment = await this.Comment.findByPk(
      comment.get("id") as number,
      {
        include: [this.includeAuthor, this.includePost],
      }
    );

    if (!createdComment) {
      throw new AppError("COMMENT_CREATION_FAILED", HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }

    // Map to CommentWithRelations interface
    // Reuses CommentModelData type to avoid redundant type definitions
    // Note: Renamed variables to avoid conflicts with data destructuring above
    const commentData = createdComment.toJSON ? createdComment.toJSON() : createdComment;
    const {
      id: commentId,
      body: commentBody,
      postId: commentPostId,
      userId: commentUserId,
      parentId: commentParentId,
      createdAt,
      updatedAt,
    } = createdComment.get() as CommentModelData;
    
    const commentResult: CommentWithRelations = {
      id: commentId,
      body: commentBody,
      postId: commentPostId,
      userId: commentUserId,
      parentId: commentParentId ?? null,
      createdAt,
      updatedAt,
      author: {
        id: (commentData as any).author?.id || 0,
        name: (commentData as any).author?.name || "",
        email: (commentData as any).author?.email || "",
        image: (commentData as any).author?.image || null,
      },
      post: {
        id: (commentData as any).post?.id || 0,
        title: (commentData as any).post?.title || "",
      },
    };

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
    const where: Record<string, any> = { parentId: null };
    
    if (postId) {
      where.postId = postId;
    }

    const comments = await this.Comment.findAll({
      where,
      include: [this.includeAuthor, this.includePost],
      order: [["createdAt", "DESC"]],
    });

    // Map Sequelize models to CommentWithAuthor interface
    // Reuses CommentModelData type to avoid redundant type definitions
    const commentRows: CommentWithAuthor[] = comments.map((comment) => {
      const commentData = comment.toJSON ? comment.toJSON() : comment;
      const {
        id,
        body,
        postId,
        userId,
        parentId,
        createdAt,
        updatedAt,
      } = comment.get() as CommentModelData;
      return {
        id,
        body,
        postId,
        userId,
        parentId: parentId ?? null,
        createdAt,
        updatedAt,
        author: {
          id: (commentData as any).author?.id || 0,
          name: (commentData as any).author?.name || "",
          email: (commentData as any).author?.email || "",
          image: (commentData as any).author?.image || null,
        },
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
    // Load the main comment with its author and post
    const comment = await this.Comment.findByPk(id, {
      include: [this.includeAuthor, this.includePost],
    });

    if (!comment) {
      return null;
    }

    // Load replies for this comment (if any), including their authors
    const replies = await this.Comment.findAll({
      where: { parentId: id },
      include: [this.includeAuthor],
      order: [["createdAt", "ASC"]],
    });

    // Map replies to CommentWithAuthor interface
    // Reuses CommentModelData type to avoid redundant type definitions
    const replyRows: CommentWithAuthor[] = replies.map((reply) => {
      const replyData = reply.toJSON ? reply.toJSON() : reply;
      const {
        id: replyId,
        body: replyBody,
        postId: replyPostId,
        userId: replyUserId,
        parentId: replyParentId,
        createdAt,
        updatedAt,
      } = reply.get() as CommentModelData;
      return {
        id: replyId,
        body: replyBody,
        postId: replyPostId,
        userId: replyUserId,
        parentId: replyParentId ?? null,
        createdAt,
        updatedAt,
        author: {
          id: (replyData as any).author?.id || 0,
          name: (replyData as any).author?.name || "",
          email: (replyData as any).author?.email || "",
          image: (replyData as any).author?.image || null,
        },
      };
    });

    // Map main comment to CommentWithRelations interface
    // Reuses CommentModelData type to avoid redundant type definitions
    // Note: Renamed id to commentId to avoid conflict with function parameter
    const commentData = comment.toJSON ? comment.toJSON() : comment;
    const {
      id: commentId,
      body: commentBody,
      postId: commentPostId,
      userId: commentUserId,
      parentId: commentParentId,
      createdAt,
      updatedAt,
    } = comment.get() as CommentModelData;
    
    const commentResult: CommentWithRelations = {
      id: commentId,
      body: commentBody,
      postId: commentPostId,
      userId: commentUserId,
      parentId: commentParentId ?? null,
      createdAt,
      updatedAt,
      author: {
        id: (commentData as any).author?.id || 0,
        name: (commentData as any).author?.name || "",
        email: (commentData as any).author?.email || "",
        image: (commentData as any).author?.image || null,
      },
      post: {
        id: (commentData as any).post?.id || 0,
        title: (commentData as any).post?.title || "",
      },
      replies: replyRows,
    };

    return commentResult;
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

    const comment = await this.Comment.findByPk(commentId);
    if (!comment) {
      throw new AppError("COMMENT_NOT_FOUND", NOT_FOUND);
    }

    // Reuses CommentUserId type to avoid redundant type definitions
    const { userId: commentUserId } = comment.get() as CommentUserId;
    if (commentUserId !== authUserId) {
      throw new AppError("CANNOT_UPDATE_OTHER_COMMENT", FORBIDDEN);
    }

    await comment.update({ body });
    const updated = await this.findCommentWithRelations(commentId);
    
    if (!updated) {
      throw new AppError("COMMENT_UPDATE_FAILED", HTTP_STATUS.INTERNAL_SERVER_ERROR);
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

    const comment = await this.Comment.findByPk(commentId);
    if (!comment) {
      throw new AppError("COMMENT_NOT_FOUND", NOT_FOUND);
    }

    // Reuses CommentUserId type to avoid redundant type definitions
    const { userId: commentUserId } = comment.get() as CommentUserId;
    if (commentUserId !== authUserId) {
      throw new AppError("CANNOT_DELETE_OTHER_COMMENT", FORBIDDEN);
    }

    await comment.destroy();
    return { ok: true };
  }
}

// Export singleton instance
export const commentService = new CommentService(models);

