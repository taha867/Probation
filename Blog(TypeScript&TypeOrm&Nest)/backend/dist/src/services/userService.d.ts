import { UserRepository, PostRepository } from "../repositories/index.js";
import { ListUsersResult, GetUserPostsServiceInput, GetUserPostsServiceResult, UpdateUserServiceInput, UpdateUserServiceResult, DeleteUserServiceInput, BaseUserProfile } from "../interfaces/userInterface.js";
import type { ServiceResult } from "../interfaces/commonInterface.js";
/**
 * User Service
 * Handles user-related business logic including CRUD operations,
 * pagination, and Cloudinary image management
 */
export declare class UserService {
    /**
     * User repository instance
     * Used for database operations on User table
     */
    private userRepo;
    /**
     * Post repository instance
     * Used for fetching user's posts
     */
    private postRepo;
    /**
     * Constructor initializes the service with repositories
     * Supports dependency injection for testability
     */
    constructor(userRepo?: UserRepository, postRepo?: PostRepository);
    /**
     * Get paginated list of all users
     *
     * @param params - Pagination parameters
     * @param params.page - Page number (1-indexed)
     * @param params.limit - Number of users per page
     * @returns Promise resolving to paginated user list
     */
    listUsers({ page, limit, }: {
        page: number;
        limit: number;
    }): Promise<ListUsersResult>;
    /**
     * Find user by ID
     * Returns minimal user profile (id, name, email, image)
     *
     * @param id - User ID to find
     * @returns Promise resolving to user profile or null if not found
     */
    findUserById(id: number): Promise<BaseUserProfile | null>;
    /**
     * Get user's posts with nested comments and replies
     * Includes search functionality for filtering posts
     *
     * @param params - Query parameters
     * @param params.userId - User ID whose posts to fetch
     * @param params.page - Page number
     * @param params.limit - Posts per page
     * @param params.search - Optional search query for post title/body
     * @returns Promise resolving to user profile, posts, and pagination metadata
     */
    getUserPostsWithComments(params: GetUserPostsServiceInput): Promise<GetUserPostsServiceResult>;
    /**
     * Update user profile (self-service)
     * Users can only update their own profile
     * Handles email/phone uniqueness validation and Cloudinary image management
     *
     * @param params - Update parameters
     * @param params.requestedUserId - ID of user to update
     * @param params.authUserId - ID of authenticated user (must match requestedUserId)
     * @param params.data - User data to update (partial)
     * @param params.fileBuffer - Optional image file buffer
     * @param params.fileName - Optional image file name
     * @returns Promise resolving to updated user profile
     * @throws AppError if user not found, unauthorized, or validation fails
     */
    updateUserForSelf(params: UpdateUserServiceInput): Promise<UpdateUserServiceResult>;
    /**
     * Delete user account (self-service)
     * Users can only delete their own account
     * Deletes associated Cloudinary images before deleting user
     *
     * @param params - Delete parameters
     * @param params.requestedUserId - ID of user to delete
     * @param params.authUserId - ID of authenticated user (must match requestedUserId)
     * @returns Promise resolving to success response
     * @throws AppError if user not found or unauthorized
     */
    deleteUserForSelf(params: DeleteUserServiceInput): Promise<ServiceResult<void>>;
}
export declare const userService: UserService;
//# sourceMappingURL=userService.d.ts.map