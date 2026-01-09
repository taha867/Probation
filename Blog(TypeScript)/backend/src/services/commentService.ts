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
  CommentUserId,
  CommentPostId,
} from "../interfaces/commentInterface.js";
import type { ServiceResult } from "../interfaces/commonInterface.js";
import type { BaseUserProfile } from "../interfaces/userInterface.js";
import { DatabaseModels } from "../models/index.js";

const { NOT_FOUND, FORBIDDEN, INTERNAL_SERVER_ERROR, BAD_REQUEST } = HTTP_STATUS;

/**
 * Author attributes for Sequelize includes
 * Reusable constant to avoid duplication across all comment queries
 */
const AUTHOR_ATTRIBUTES = ["id", "name", "email", "image"];

/**
 * Post attributes for Sequelize includes
 * Reusable constant for post information in comments
 */
const POST_ATTRIBUTES = ["id", "title"];

/**
 * Comment attributes for Sequelize queries
 * Fields needed for CommentWithAuthor and CommentWithRelations interfaces
 */
const COMMENT_ATTRIBUTES = [
  "id",
  "body",
  "postId",
  "userId",
  "parentId",
  "createdAt",
  "updatedAt",
];

/**
 * Maps Sequelize author data to BaseUserProfile
 * Helper function to avoid duplication and ensure consistency
 *
 * @param authorData - Author data from Sequelize include (can be null/undefined)
 * @returns BaseUserProfile object
 */
const mapAuthorData = (authorData: any): BaseUserProfile => {
  // Sequelize includes guarantee author exists when configured correctly
  // This fallback should rarely be needed, but provides safety
  if (!authorData) {
    throw new Error(
      "Author data missing - Sequelize include may be misconfigured"
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
 * Maps Sequelize post data to post object
 * Helper function to avoid duplication and ensure consistency
 *
 * @param postData - Post data from Sequelize include (can be null/undefined)
 * @returns Post object with id and title
 */
const mapPostData = (postData: any): { id: number; title: string } => {
  if (!postData) {
    throw new Error(
      "Post data missing - Sequelize include may be misconfigured"
    );
  }
  const { id, title } = postData;
  return {
    id,
    title,
  };
};

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
   * Constructor initializes the service with database models
   *
   * @param models - Database models object containing all Sequelize models
   */
  constructor(models: DatabaseModels) {
    // Type assertions: We know these models exist in models object
    this.Comment = models.Comment as CommentModel;
    this.Post = models.Post as PostModel;
    this.User = models.User as UserModel;
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
        throw new AppError("POST_ID_REQUIRED", BAD_REQUEST);
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
        attributes: COMMENT_ATTRIBUTES,
        include: [
          {
            model: this.User,
            as: "author",
            attributes: AUTHOR_ATTRIBUTES,
          },
          {
            model: this.Post,
            as: "post",
            attributes: POST_ATTRIBUTES,
          },
        ],
      }
    );

    if (!createdComment) {
      throw new AppError("COMMENT_CREATION_FAILED", INTERNAL_SERVER_ERROR);
    }

    // Map to CommentWithRelations interface
    // Since we fetch only needed fields via attributes, we can map directly
    const commentData = createdComment.toJSON ? createdComment.toJSON() : createdComment.get();
    const {
      id: commentId,
      body: commentBody,
      postId: commentPostId,
      userId: commentUserId,
      parentId: commentParentId,
      createdAt,
      updatedAt,
    } = commentData;
    const authorData = (commentData as any).author;
    const postData = (commentData as any).post;

    const commentResult: CommentWithRelations = {
      id: commentId,
      body: commentBody,
      postId: commentPostId,
      userId: commentUserId,
      parentId: commentParentId ?? null,
      createdAt,
      updatedAt,
      author: mapAuthorData(authorData),
      post: mapPostData(postData),
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
      attributes: COMMENT_ATTRIBUTES,
      include: [
        {
          model: this.User,
          as: "author",
          attributes: AUTHOR_ATTRIBUTES,
        },
        {
          model: this.Post,
          as: "post",
          attributes: POST_ATTRIBUTES,
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // Map Sequelize models to CommentWithAuthor interface
    // Since we fetch only needed fields via attributes, we can map directly
    const commentRows: CommentWithAuthor[] = comments.map((comment) => {
      const commentData = comment.toJSON ? comment.toJSON() : comment.get();
      const {
        id,
        body: commentBody,
        postId: commentPostId,
        userId,
        parentId,
        createdAt,
        updatedAt,
      } = commentData;
      const authorData = (commentData as any).author;

      return {
        id,
        body: commentBody,
        postId: commentPostId,
        userId,
        parentId: parentId ?? null,
        createdAt,
        updatedAt,
        author: mapAuthorData(authorData),
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
      attributes: COMMENT_ATTRIBUTES,
      include: [
        {
          model: this.User,
          as: "author",
          attributes: AUTHOR_ATTRIBUTES,
        },
        {
          model: this.Post,
          as: "post",
          attributes: POST_ATTRIBUTES,
        },
      ],
    });

    if (!comment) {
      return null;
    }

    // Load replies for this comment (if any), including their authors
    const replies = await this.Comment.findAll({
      where: { parentId: id },
      attributes: COMMENT_ATTRIBUTES,
      include: [
        {
          model: this.User,
          as: "author",
          attributes: AUTHOR_ATTRIBUTES,
        },
      ],
      order: [["createdAt", "ASC"]],
    });

    // Map replies to CommentWithAuthor interface
    // Since we fetch only needed fields via attributes, we can map directly
    const replyRows: CommentWithAuthor[] = replies.map((reply) => {
      const replyData = reply.toJSON ? reply.toJSON() : reply.get();
      const { id: replyId, body, postId, userId, parentId, createdAt, updatedAt } = replyData;
      const authorData = (replyData as any).author;

      return {
        id: replyId,
        body,
        postId,
        userId,
        parentId: parentId ?? null,
        createdAt,
        updatedAt,
        author: mapAuthorData(authorData),
      };
    });

    // Map main comment to CommentWithRelations interface
    // Since we fetch only needed fields via attributes, we can map directly
    const commentData = comment.toJSON ? comment.toJSON() : comment.get();
    const { id: commentId, body, postId, userId, parentId, createdAt, updatedAt } = commentData;
    const authorData = (commentData as any).author;
    const postData = (commentData as any).post;

    const commentResult: CommentWithRelations = {
      id: commentId,
      body,
      postId,
      userId,
      parentId: parentId ?? null,
      createdAt,
      updatedAt,
      author: mapAuthorData(authorData),
      post: mapPostData(postData),
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

