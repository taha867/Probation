import { Op } from "sequelize";
import { Model, ModelStatic } from "sequelize";
import models from "../models/index.js";
import { HTTP_STATUS } from "../utils/constants.js";
import { AppError } from "../utils/errors.js";
import {
  buildPaginationMeta,
  getPaginationParams,
} from "../utils/pagination.js";
import {
  deleteImageFromCloudinary,
  uploadImageToCloudinary,
} from "./cloudinaryService.js";
import {
  CreatePostServiceInput,
  CreatePostServiceResult,
  ListPostsQuery,
  ListPostsResult,
  UpdatePostServiceInput,
  UpdatePostServiceResult,
  DeletePostServiceInput,
  GetPostCommentsServiceInput,
  GetPostCommentsServiceResult,
  PostWithAuthor,
  BasePost,
  PostUserId,
  PostImagePublicId,
} from "../interfaces/postInterface.js";
import type { ServiceResult } from "../interfaces/commonInterface.js";
import type { BaseUserProfile } from "../interfaces/userInterface.js";
import { DatabaseModels } from "../models/index.js";
import type { PostStatus } from "../models/post.js";

const { NOT_FOUND, FORBIDDEN, INTERNAL_SERVER_ERROR } = HTTP_STATUS;

/**
 * Author attributes for Sequelize includes
 * Reusable constant to avoid duplication across all post queries
 */
const AUTHOR_ATTRIBUTES = ["id", "name", "email", "image"];

/**
 * Post attributes for Sequelize queries
 * Fields needed for PostWithAuthor interface
 */
const POST_ATTRIBUTES = [
  "id",
  "title",
  "body",
  "userId",
  "status",
  "image",
  "imagePublicId",
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
const{id, name, email, image}=authorData;
  return {
    id,
    name,
    email,
    image: image || null,
  };
};

/**
 * Sequelize model types
 * Type definitions for dynamically loaded models
 */
type PostModel = ModelStatic<Model<any, any>> & {
  create: (values: any) => Promise<Model<any, any>>;
  findByPk: (id: number) => Promise<Model<any, any> | null>;
  findAndCountAll: (
    options?: any
  ) => Promise<{ rows: Model<any, any>[]; count: number }>;
};

type CommentModel = ModelStatic<Model<any, any>> & {
  findAndCountAll: (
    options?: any
  ) => Promise<{ rows: Model<any, any>[]; count: number }>;
};

type UserModel = ModelStatic<Model<any, any>> & {
  // User model methods
};

/**
 * Post Service
 * Handles post-related business logic including CRUD operations,
 * pagination, and Cloudinary image management
 */
export class PostService {
  /**
   * Post model instance
   * Used for database operations on Post table
   */
  private Post: PostModel;

  /**
   * Comment model instance
   * Used for fetching comments on posts
   */
  private Comment: CommentModel;

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
    this.Post = models.Post as PostModel;
    this.Comment = models.Comment as CommentModel;
    this.User = models.User as UserModel;
  }

  /**
   * Create a new post
   *
   * @param params - Create parameters
   * @param params.userId - ID of user creating the post
   * @param params.data - Post data (title, body, status)
   * @param params.image - Optional image URL from Cloudinary
   * @param params.imagePublicId - Optional Cloudinary public ID
   * @returns Promise resolving to created post with author
   */
  async createPost(
    params: CreatePostServiceInput
  ): Promise<CreatePostServiceResult> {
    const { authUserId, data, image, imagePublicId } = params;
    const { title, body, status } = data;
    const createdPost = await this.Post.create({
      title,
      body,
      status: status || "draft",
      userId: authUserId,
      image: image || null,
      imagePublicId: imagePublicId || null,
    });

    // Fetch post with author for response
    const post = await this.findPostWithAuthor(createdPost.get("id") as number);

    if (!post) {
      throw new AppError("POST_CREATION_FAILED", INTERNAL_SERVER_ERROR);
    }

    return {
      ok: true,
      data: post,
    };
  }

  /**
   * Get paginated list of posts with optional filtering
   *
   * @param params - Query parameters
   * @param params.page - Page number (1-indexed)
   * @param params.limit - Number of posts per page
   * @param params.search - Optional search query for title/body
   * @param params.userId - Optional filter by user ID
   * @param params.status - Optional filter by status
   * @returns Promise resolving to paginated post list
   */
  async listPosts(params: ListPostsQuery): Promise<ListPostsResult> {
    // Controllers guarantee page and limit exist (Joi validation applies defaults)
    const { page, limit, search, userId, status } = params;
    // Non-null assertions: Joi validation ensures these are always present
    const pageNum = page!;
    const limitNum = limit!;
    const { offset } = getPaginationParams({ page: pageNum, limit: limitNum });

    // where is an object Sequelize uses to filter records
    const where: Record<string, any> = {};
    if (userId) {
      where.userId = userId;
    }
    if (status) {
      where.status = status;
    }
    if (search) {
      (where as any)[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { body: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { rows, count } = await this.Post.findAndCountAll({
      where,
      attributes: POST_ATTRIBUTES,
      include: [
        {
          model: this.User,
          as: "author",
          attributes: AUTHOR_ATTRIBUTES,
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: limitNum,
      offset,
    });

    // Map Sequelize models to PostWithAuthor interface
    // Since we fetch only needed fields via attributes, we can map directly
    const postRows: PostWithAuthor[] = rows.map((post) => {
      const postData = post.toJSON ? post.toJSON() : post.get();
      const { id, title, body, userId, status, image, imagePublicId } = postData;
      const authorData = (postData as any).author;

      return {
        id,
        title,
        body,
        userId,
        status: status as PostStatus,
        image: image ?? null,
        imagePublicId: imagePublicId ?? null,
        author: mapAuthorData(authorData),
      };
    });

    return {
      rows: postRows,
      meta: buildPaginationMeta({
        total: count,
        page: pageNum,
        limit: limitNum,
      }),
    };
  }

  /**
   * Find post by ID with author information
   *
   * @param id - Post ID to find
   * @returns Promise resolving to post with author or null if not found
   */
  async findPostWithAuthor(id: number): Promise<PostWithAuthor | null> {
    const post = await this.Post.findByPk(id, {
      attributes: POST_ATTRIBUTES,
      include: [
        {
          model: this.User,
          as: "author",
          attributes: AUTHOR_ATTRIBUTES,
        },
      ],
    });

    if (!post) {
      return null;
    }

    const postData = post.toJSON ? post.toJSON() : post.get();
    const { id: postId, title, body, userId, status, image, imagePublicId } = postData;
    const authorData = (postData as any).author;

    return {
      id: postId,
      title,
      body,
      userId,
      status: status as PostStatus,
      image: image ?? null,
      imagePublicId: imagePublicId ?? null,
      author: mapAuthorData(authorData),
    };
  }

  /**
   * Get post with paginated comments and nested replies
   *
   * @param params - Query parameters
   * @param params.postId - Post ID to get comments for
   * @param params.page - Page number
   * @param params.limit - Comments per page
   * @returns Promise resolving to post, comments, and pagination metadata
   */
  async getPostWithComments(
    params: GetPostCommentsServiceInput
  ): Promise<GetPostCommentsServiceResult> {
    const { postId, page, limit } = params;
    const { offset } = getPaginationParams({ page, limit });

    const postExists = await this.Post.findByPk(postId, {
      attributes: POST_ATTRIBUTES,
    });
    if (!postExists) {
      return { post: null, comments: [], meta: null };
    }

    // Since we fetch only BasePost fields via attributes, we can use BasePost directly
    const postData = postExists.toJSON ? postExists.toJSON() : postExists.get();
    const { id, title, body, userId, status, image, imagePublicId } = postData;
    
    const post: BasePost = {
      id,
      title,
      body,
      userId,
      status: status as PostStatus,
      image: image ?? null,
      imagePublicId: imagePublicId ?? null,
    };

    const { rows, count } = await this.Comment.findAndCountAll({
      where: { postId, parentId: null },
      include: [
        {
          model: this.User,
          as: "author",
          attributes: AUTHOR_ATTRIBUTES,
        },
        {
          model: this.Comment,
          as: "replies",
          include: [
            {
              model: this.User,
              as: "author",
              attributes: AUTHOR_ATTRIBUTES,
            },
          ],
          separate: true,
          order: [["createdAt", "ASC"]],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    return {
      post,
      comments: rows as any[], // TODO: Type this properly with CommentWithAuthor
      meta: buildPaginationMeta({ total: count, page, limit }),
    };
  }

  /**
   * Update post (owner-only)
   * Users can only update their own posts
   * Handles Cloudinary image management
   *
   * @param params - Update parameters
   * @param params.postId - ID of post to update
   * @param params.authUserId - ID of authenticated user (must match post owner)
   * @param params.data - Post data to update (partial)
   * @param params.fileBuffer - Optional image file buffer
   * @param params.fileName - Optional image file name
   * @returns Promise resolving to updated post with author
   * @throws AppError if post not found, unauthorized, or validation fails
   */
  async updatePostForUser(
    params: UpdatePostServiceInput
  ): Promise<UpdatePostServiceResult> {
    const { postId, authUserId, data, fileBuffer, fileName } = params;

    const post = await this.Post.findByPk(postId);
    if (!post) {
      throw new AppError("POST_NOT_FOUND", NOT_FOUND);
    }

    // Reuses PostUserId type to avoid redundant type definitions
    const { userId: postUserId } = post.get() as PostUserId;
    if (postUserId !== authUserId) {
      throw new AppError("CANNOT_UPDATE_OTHER_POST", FORBIDDEN);
    }

    const updateData: Record<string, any> = {};

    // Build update object with only provided fields
    if (data.title !== undefined) updateData.title = data.title;
    if (data.body !== undefined) updateData.body = data.body;
    if (data.status !== undefined) updateData.status = data.status;

    // Handle image-related business logic (all Cloudinary operations)
    if (fileBuffer) {
      // New image uploaded: delete old image from Cloudinary, upload new one
      // Reuses PostImagePublicId type to avoid redundant type definitions
      const { imagePublicId } = post.get() as PostImagePublicId;
      if (imagePublicId) {
        await deleteImageFromCloudinary(imagePublicId);
      }

      const uploadResult = await uploadImageToCloudinary(
        fileBuffer,
        "blog/posts",
        fileName || "updated-image"
      );
      updateData.image = uploadResult.secure_url;
      updateData.imagePublicId = uploadResult.public_id;
    } else if (data.image === null || data.image === "") {
      // Image explicitly removed: delete from Cloudinary and set to null in database
      // Reuses PostImagePublicId type to avoid redundant type definitions
      const { imagePublicId } = post.get() as PostImagePublicId;
      if (imagePublicId) {
        await deleteImageFromCloudinary(imagePublicId);
      }
      updateData.image = null;
      updateData.imagePublicId = null;
    }
    // If image field not provided, keep existing image (don't touch it)

    await post.update(updateData);

    // Fetch updated post with author
    const updatedPost = await this.findPostWithAuthor(postId);
    if (!updatedPost) {
      throw new AppError(
        "POST_UPDATE_FAILED",
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }

    return {
      ok: true,
      data: updatedPost,
    };
  }

  /**
   * Delete post (owner-only)
   * Users can only delete their own posts
   * Deletes associated Cloudinary images before deleting post
   *
   * @param params - Delete parameters
   * @param params.postId - ID of post to delete
   * @param params.authUserId - ID of authenticated user (must match post owner)
   * @returns Promise resolving to success response
   * @throws AppError if post not found or unauthorized
   */
  async deletePostForUser(
    params: DeletePostServiceInput
  ): Promise<ServiceResult<void>> {
    const { postId, authUserId } = params;

    const post = await this.Post.findByPk(postId);
    if (!post) {
      throw new AppError("POST_NOT_FOUND", NOT_FOUND);
    }

    // Reuses PostUserId type to avoid redundant type definitions
    const { userId: postUserId } = post.get() as PostUserId;
    if (postUserId !== authUserId) {
      throw new AppError("CANNOT_DELETE_OTHER_POST", FORBIDDEN);
    }

    // Delete associated image from Cloudinary before deleting post
    // Reuses PostImagePublicId type to avoid redundant type definitions
    const { imagePublicId } = post.get() as PostImagePublicId;
    if (imagePublicId) {
      await deleteImageFromCloudinary(imagePublicId);
    }

    await post.destroy();
    return { ok: true };
  }
}

// Export singleton instance
export const postService = new PostService(models);
