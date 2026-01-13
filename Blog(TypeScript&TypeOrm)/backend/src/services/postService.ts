import { AppDataSource } from "../config/data-source.js";
import { Post } from "../entities/Post.js";
import { HTTP_STATUS } from "../utils/constants.js";
import { AppError } from "../utils/errors.js";
import {
  buildPaginationMeta,
} from "../utils/pagination.js";
import {
  deleteImageFromCloudinary,
  uploadImageToCloudinary,
} from "./cloudinaryService.js";
import {
  PostRepository,
  CommentRepository,
} from "../repositories/index.js";
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
} from "../interfaces/postInterface.js";
import type { ServiceResult } from "../interfaces/commonInterface.js";
import type { BaseUserProfile } from "../interfaces/userInterface.js";
import { PostStatus } from "../entities/Post.js";

const { NOT_FOUND, FORBIDDEN, INTERNAL_SERVER_ERROR } = HTTP_STATUS;

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
 * Post Service
 * Handles post-related business logic including CRUD operations,
 * pagination, and Cloudinary image management
 */
export class PostService {
  /**
   * Post repository instance
   * Used for database operations on Post table
   */
  private postRepo: PostRepository;

  /**
   * Comment repository instance
   * Used for fetching comments on posts
   */
  private commentRepo: CommentRepository;

  /**
   * Constructor initializes the service with repositories
   * Supports dependency injection for testability
   */
  constructor(
    postRepo?: PostRepository,
    commentRepo?: CommentRepository
  ) {
    this.postRepo = postRepo || new PostRepository(AppDataSource);
    this.commentRepo = commentRepo || new CommentRepository(AppDataSource);
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

    const post = new Post();
    post.title = title;
    post.body = body;
    post.status = (status as PostStatus) || PostStatus.DRAFT;
    post.userId = authUserId;
    post.image = image || null;
    post.imagePublicId = imagePublicId || null;

    await this.postRepo.save(post);

    // Fetch post with author for response
    const postWithAuthor = await this.findPostWithAuthor(post.id);

    if (!postWithAuthor) {
      throw new AppError("POST_CREATION_FAILED", INTERNAL_SERVER_ERROR);
    }

    return {
      ok: true,
      data: postWithAuthor,
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
    const { page, limit, search, userId, status } = params;
    const pageNum = page!;
    const limitNum = limit!;

    // Use repository method for paginated query
    const [posts, total] = await this.postRepo.findPaginatedWithAuthor({
      page: pageNum,
      limit: limitNum,
      userId,
      status,
      search,
    });

    // Map TypeORM entities to PostWithAuthor interface
    const postRows: PostWithAuthor[] = posts.map((post: any) => {
      return {
        id: post.id,
        title: post.title,
        body: post.body,
        userId: post.userId,
        status: post.status as PostStatus,
        image: post.image ?? null,
        imagePublicId: post.imagePublicId ?? null,
        author: mapAuthorData(post.author),
      };
    });

    return {
      rows: postRows,
      meta: buildPaginationMeta({
        total,
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
    // Use repository method
    return this.postRepo.findWithAuthor(id);
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

    const post = await this.postRepo.findByIdWithFields(postId, [
      "id",
      "title",
      "body",
      "userId",
      "status",
      "image",
      "imagePublicId",
    ]);

    if (!post) {
      return { post: null, comments: [], meta: null };
    }

    const basePost: BasePost = {
      id: post.id,
      title: post.title,
      body: post.body,
      userId: post.userId,
      status: post.status as PostStatus,
      image: post.image ?? null,
      imagePublicId: post.imagePublicId ?? null,
    };

    // Use repository method for comments
    const [comments, total] = await this.commentRepo.findTopLevelWithReplies(
      postId,
      page,
      limit
    );

    return {
      post: basePost,
      comments: comments as any[], // TODO: Type this properly with CommentWithAuthor
      meta: buildPaginationMeta({ total, page, limit }),
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

    // Load full entity for authorization and update
    // Industry best practice: Load once, update, save (triggers hooks automatically)
    const post = await this.postRepo.findById(postId);

    if (!post) {
      throw new AppError("POST_NOT_FOUND", NOT_FOUND);
    }

    if (post.userId !== authUserId) {
      throw new AppError("CANNOT_UPDATE_OTHER_POST", FORBIDDEN);
    }

    // Build update object with only provided fields
    const updateData: Partial<Post> = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.body !== undefined) updateData.body = data.body;
    if (data.status !== undefined) updateData.status = data.status as PostStatus;

    // Handle image-related business logic (all Cloudinary operations)
    if (fileBuffer) {
      // New image uploaded: delete old image from Cloudinary, upload new one
      if (post.imagePublicId) {
        await deleteImageFromCloudinary(post.imagePublicId);
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
      if (post.imagePublicId) {
        await deleteImageFromCloudinary(post.imagePublicId);
      }
      updateData.image = null;
      updateData.imagePublicId = null;
    }
    // If image field not provided, keep existing image (don't touch it)

    // Use save() method: triggers @BeforeUpdate hook and updates @UpdateDateColumn automatically
    // Industry best practice: Load → Modify → Save (fewer queries, hooks work)
    const updatedPost = await this.postRepo.updateEntity(post, updateData);

    // Fetch updated post with author for response
    const postWithAuthor = await this.findPostWithAuthor(updatedPost.id);
    if (!postWithAuthor) {
      throw new AppError(
        "POST_UPDATE_FAILED",
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }

    return {
      ok: true,
      data: postWithAuthor,
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

    // Load minimal fields for authorization and Cloudinary
    const post = await this.postRepo.findByIdWithFields(postId, [
      "id",
      "userId",
      "imagePublicId",
    ]);

    if (!post) {
      throw new AppError("POST_NOT_FOUND", NOT_FOUND);
    }

    if (post.userId !== authUserId) {
      throw new AppError("CANNOT_DELETE_OTHER_POST", FORBIDDEN);
    }

    // Delete associated image from Cloudinary before deleting post
    if (post.imagePublicId) {
      await deleteImageFromCloudinary(post.imagePublicId);
    }

    // Use repository method for deletion
    await this.postRepo.deleteWithQueryBuilder(postId);

    return { ok: true };
  }
}

// Export singleton instance
export const postService = new PostService();
