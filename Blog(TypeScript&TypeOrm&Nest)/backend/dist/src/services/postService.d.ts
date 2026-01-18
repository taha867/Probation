import { PostRepository, CommentRepository } from "../repositories/index.js";
import { CreatePostServiceInput, CreatePostServiceResult, ListPostsQuery, ListPostsResult, UpdatePostServiceInput, UpdatePostServiceResult, DeletePostServiceInput, GetPostCommentsServiceInput, GetPostCommentsServiceResult, PostWithAuthor } from "../interfaces/postInterface.js";
import type { ServiceResult } from "../interfaces/commonInterface.js";
/**
 * Post Service
 * Handles post-related business logic including CRUD operations,
 * pagination, and Cloudinary image management
 */
export declare class PostService {
    /**
     * Post repository instance
     * Used for database operations on Post table
     */
    private postRepo;
    /**
     * Comment repository instance
     * Used for fetching comments on posts
     */
    private commentRepo;
    /**
     * Constructor initializes the service with repositories
     * Supports dependency injection for testability
     */
    constructor(postRepo?: PostRepository, commentRepo?: CommentRepository);
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
    createPost(params: CreatePostServiceInput): Promise<CreatePostServiceResult>;
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
    listPosts(params: ListPostsQuery): Promise<ListPostsResult>;
    /**
     * Find post by ID with author information
     *
     * @param id - Post ID to find
     * @returns Promise resolving to post with author or null if not found
     */
    findPostWithAuthor(id: number): Promise<PostWithAuthor | null>;
    /**
     * Get post with paginated comments and nested replies
     *
     * @param params - Query parameters
     * @param params.postId - Post ID to get comments for
     * @param params.page - Page number
     * @param params.limit - Comments per page
     * @returns Promise resolving to post, comments, and pagination metadata
     */
    getPostWithComments(params: GetPostCommentsServiceInput): Promise<GetPostCommentsServiceResult>;
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
    updatePostForUser(params: UpdatePostServiceInput): Promise<UpdatePostServiceResult>;
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
    deletePostForUser(params: DeletePostServiceInput): Promise<ServiceResult<void>>;
}
export declare const postService: PostService;
//# sourceMappingURL=postService.d.ts.map