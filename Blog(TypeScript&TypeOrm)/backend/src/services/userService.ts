import { AppDataSource } from "../config/data-source.js";
import { User } from "../entities/User.js";
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
  UserRepository,
  PostRepository,
} from "../repositories/index.js";
import {
  ListUsersResult,
  GetUserPostsServiceInput,
  GetUserPostsServiceResult,
  UpdateUserServiceInput,
  UpdateUserServiceResult,
  DeleteUserServiceInput,
  PublicUserProfile,
  BaseUserProfile,
} from "../interfaces/userInterface.js";
import type { ServiceResult } from "../interfaces/commonInterface.js";

const { NOT_FOUND, FORBIDDEN, UNPROCESSABLE_ENTITY } = HTTP_STATUS;

/**
 * User Service
 * Handles user-related business logic including CRUD operations,
 * pagination, and Cloudinary image management
 */
export class UserService {
  /**
   * User repository instance
   * Used for database operations on User table
   */
  private userRepo: UserRepository;

  /**
   * Post repository instance
   * Used for fetching user's posts
   */
  private postRepo: PostRepository;

  /**
   * Constructor initializes the service with repositories
   * Supports dependency injection for testability
   */
  constructor(
    userRepo?: UserRepository,
    postRepo?: PostRepository
  ) {
    this.userRepo = userRepo || new UserRepository(AppDataSource);
    this.postRepo = postRepo || new PostRepository(AppDataSource);
  }

  /**
   * Get paginated list of all users
   * 
   * @param params - Pagination parameters
   * @param params.page - Page number (1-indexed)
   * @param params.limit - Number of users per page
   * @returns Promise resolving to paginated user list
   */
  async listUsers({
    page,
    limit,
  }: {
    page: number;
    limit: number;
  }): Promise<ListUsersResult> {
    // Use repository method for pagination
    const [users, total] = await this.userRepo.findPaginated(page, limit);

    // Map TypeORM entities to PublicUserProfile interface
    const userRows: PublicUserProfile[] = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      status: user.status,
      image: user.image,
    }));

    return {
      rows: userRows,
      meta: buildPaginationMeta({ total, page, limit }),
    };
  }

  /**
   * Find user by ID
   * Returns minimal user profile (id, name, email, image)
   * 
   * @param id - User ID to find
   * @returns Promise resolving to user profile or null if not found
   */
  async findUserById(id: number): Promise<BaseUserProfile | null> {
    // Use repository method
    return this.userRepo.findPublicProfile(id);
  }

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
  async getUserPostsWithComments(
    params: GetUserPostsServiceInput
  ): Promise<GetUserPostsServiceResult> {
    const { userId, page, limit, search } = params;

    const user = await this.findUserById(userId);
    if (!user) {
      return { user: null, posts: [], meta: null };
    }

    // Use repository method for complex query
    const [posts, total] = await this.postRepo.findUserPostsWithComments(
      userId,
      page,
      limit,
      search
    );

    return {
      user,
      posts: posts as any[], // TODO: Type this properly with Post interface
      meta: buildPaginationMeta({ total, page, limit }),
    };
  }

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
  async updateUserForSelf(
    params: UpdateUserServiceInput
  ): Promise<UpdateUserServiceResult> {
    const { requestedUserId, authUserId, data, fileBuffer, fileName } = params;

    // Authorization check: users can only update themselves
    if (requestedUserId !== authUserId) {
      throw new AppError("CANNOT_UPDATE_OTHER_USER", FORBIDDEN);
    }

    const user = await this.userRepo.findByIdWithFields(requestedUserId, [
      "id",
      "name",
      "email",
      "phone",
      "password",
      "image",
      "imagePublicId",
    ]);

    if (!user) {
      throw new AppError("USER_NOT_FOUND", NOT_FOUND);
    }

    const { name, email, phone, password } = data;
    const updateData: Partial<User> = {};

    // Build update object with only provided fields
    if (name !== undefined) updateData.name = name;

    if (email !== undefined) {
      // Check email uniqueness using repository method
      const emailExists = await this.userRepo.emailExists(email, requestedUserId);
      if (emailExists) {
        throw new AppError("EMAIL_ALREADY_EXISTS", UNPROCESSABLE_ENTITY);
      }
      updateData.email = email;
    }

    if (phone !== undefined) {
      // Check phone uniqueness using repository method
      // Only check if phone is not null (multiple users can have null phone)
      if (phone !== null) {
        const phoneExists = await this.userRepo.phoneExists(phone, requestedUserId);
        if (phoneExists) {
          throw new AppError("PHONE_ALREADY_EXISTS", UNPROCESSABLE_ENTITY);
        }
      }
      updateData.phone = phone;
    }

    if (password !== undefined) updateData.password = password;

    // Handle image-related business logic (all Cloudinary operations)
    if (fileBuffer) {
      // New image uploaded: delete old image from Cloudinary, upload new one
      if (user.imagePublicId) {
        await deleteImageFromCloudinary(user.imagePublicId);
      }

      const uploadResult = await uploadImageToCloudinary(
        fileBuffer,
        "blog/users",
        fileName || "profile-image"
      );
      updateData.image = uploadResult.secure_url;
      updateData.imagePublicId = uploadResult.public_id;
    } else if (data.image === null || data.image === "") {
      // Image explicitly removed: delete from Cloudinary and set to null in database
      if (user.imagePublicId) {
        await deleteImageFromCloudinary(user.imagePublicId);
      }
      updateData.image = null;
      updateData.imagePublicId = null;
    }
    // If image field not provided, keep existing image (don't touch it)

    // Update user
    Object.assign(user, updateData);
    await this.userRepo.save(user);

    // Fetch updated user with only public fields for response
    const updatedUser = await this.userRepo.findByIdWithFields(requestedUserId, [
      "id",
      "name",
      "email",
      "phone",
      "status",
      "image",
    ]);

    if (!updatedUser) {
      throw new AppError("USER_UPDATE_FAILED", HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }

    return {
      ok: true,
      data: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        status: updatedUser.status,
        image: updatedUser.image,
      } as PublicUserProfile,
    };
  }

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
  async deleteUserForSelf(
    params: DeleteUserServiceInput
  ): Promise<ServiceResult<void>> {
    const { requestedUserId, authUserId } = params;

    // Authorization check: users can only delete themselves
    if (requestedUserId !== authUserId) {
      throw new AppError("CANNOT_DELETE_OTHER_USER", FORBIDDEN);
    }

    const user = await this.userRepo.findByIdWithFields(requestedUserId, [
      "id",
      "imagePublicId",
    ]);

    if (!user) {
      throw new AppError("USER_NOT_FOUND", NOT_FOUND);
    }

    // Delete associated image from Cloudinary before deleting user
    if (user.imagePublicId) {
      await deleteImageFromCloudinary(user.imagePublicId);
    }

    // Use repository method for deletion
    await this.userRepo.deleteWithQueryBuilder(requestedUserId);

    return { ok: true };
  }
}

// Export singleton instance
export const userService = new UserService();
