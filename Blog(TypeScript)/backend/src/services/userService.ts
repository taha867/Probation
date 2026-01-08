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
  ListUsersResult,
  GetUserPostsServiceInput,
  GetUserPostsServiceResult,
  UpdateUserServiceInput,
  UpdateUserServiceResult,
  DeleteUserServiceInput,
  PublicUserProfile,
  BaseUserProfile,
  UserModelData,
  UserImagePublicId,
} from "../interfaces/userInterface.js";
import type { ServiceResult } from "../interfaces/commonInterface.js";
import { DatabaseModels } from "../models/index.js";

const { NOT_FOUND, FORBIDDEN, UNPROCESSABLE_ENTITY } = HTTP_STATUS;

/**
 * Sequelize model types
 * Type definitions for dynamically loaded models
 */
type UserModel = ModelStatic<Model<any, any>> & {
  findOne: (options?: any) => Promise<Model<any, any> | null>;
  findByPk: (id: number) => Promise<Model<any, any> | null>;
  findAndCountAll: (options?: any) => Promise<{ rows: Model<any, any>[]; count: number }>;
  create: (values: any) => Promise<Model<any, any>>;
};

type PostModel = ModelStatic<Model<any, any>> & {
  findAndCountAll: (options?: any) => Promise<{ rows: Model<any, any>[]; count: number }>;
};

type CommentModel = ModelStatic<Model<any, any>>;

/**
 * User Service
 * Handles user-related business logic including CRUD operations,
 * pagination, and Cloudinary image management
 */
export class UserService {
  /**
   * User model instance
   * Used for database operations on User table
   */
  private User: UserModel;

  /**
   * Post model instance
   * Used for fetching user's posts
   */
  private Post: PostModel;

  /**
   * Comment model instance
   * Used for fetching comments on user's posts
   */
  private Comment: CommentModel;

  /**
   * Constructor initializes the service with database models
   * 
   * @param models - Database models object containing all Sequelize models
   */
  constructor(models: DatabaseModels) {
    // Type assertions: We know these models exist in models object
    this.User = models.User as UserModel;
    this.Post = models.Post as PostModel;
    this.Comment = models.Comment as CommentModel;
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
    const { offset } = getPaginationParams({ page, limit });

    const { rows, count } = await this.User.findAndCountAll({
      attributes: ["id", "name", "email", "phone", "status", "image"],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    // Map Sequelize models to PublicUserProfile interface
    // Reuses UserModelData type to avoid redundant type definitions
    const userRows: PublicUserProfile[] = rows.map((user) => {
      const {
        id,
        name,
        email,
        phone,
        status,
        image,
      } = user.get() as UserModelData;
      return {
        id,
        name,
        email,
        phone: phone ?? null,
        status,
        image: image ?? null,
      };
    });

    return {
      rows: userRows,
      meta: buildPaginationMeta({ total: count, page, limit }),
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
    const user = await this.User.findByPk(id, {
      attributes: ["id", "name", "email", "image"],
    });

    if (!user) {
      return null;
    }

    // Reuses UserModelData type to avoid redundant type definitions
    const {
      id: userId,
      name,
      email,
      image,
    } = user.get() as UserModelData;

    return {
      id: userId,
      name,
      email,
      image: image ?? null,
    };
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
    const { offset } = getPaginationParams({ page, limit });

    const user = await this.findUserById(userId);
    if (!user) {
      return { user: null, posts: [], meta: null };
    }

    // Build where clause for post filtering
    const where: any = { userId };
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { body: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { rows, count } = await this.Post.findAndCountAll({
      where,
      include: [
        {
          model: this.User,
          as: "author",
          attributes: ["id", "name", "email", "image"],
        },
        {
          model: this.Comment,
          as: "comments",
          include: [
            {
              model: this.User,
              as: "author",
              attributes: ["id", "name", "email", "image"],
            },
            {
              model: this.Comment,
              as: "replies",
              include: [
                {
                  model: this.User,
                  as: "author",
                  attributes: ["id", "name", "email", "image"],
                },
              ],
              separate: true,
              order: [["createdAt", "ASC"]],
            },
          ],
          separate: true,
          order: [["createdAt", "DESC"]],
          where: { parentId: null },
        },
      ],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    return {
      user,
      posts: rows, // TODO: Type this properly with Post interface
      meta: buildPaginationMeta({ total: count, page, limit }),
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

    const user = await this.User.findByPk(requestedUserId);
    if (!user) {
      throw new AppError("USER_NOT_FOUND", NOT_FOUND);
    }

    const { name, email, phone, password } = data;
    const updateData: Record<string, any> = {};

    // Build update object with only provided fields
    if (name !== undefined) updateData.name = name;

    if (email !== undefined) {
      // Check email uniqueness (excluding current user)
      const existingUser = await this.User.findOne({
        where: {
          email,
          id: { [Op.ne]: requestedUserId },
        },
      });
      if (existingUser) {
        throw new AppError("EMAIL_ALREADY_EXISTS", UNPROCESSABLE_ENTITY);
      }
      updateData.email = email;
    }

    if (phone !== undefined) {
      // Check phone uniqueness (excluding current user)
      const existingUser = await this.User.findOne({
        where: {
          phone,
          id: { [Op.ne]: requestedUserId },
        },
      });
      if (existingUser) {
        throw new AppError("PHONE_ALREADY_EXISTS", UNPROCESSABLE_ENTITY);
      }
      updateData.phone = phone;
    }

    if (password !== undefined) updateData.password = password;

    // Handle image-related business logic (all Cloudinary operations)
    if (fileBuffer) {
      // New image uploaded: delete old image from Cloudinary, upload new one
      // Reuses UserImagePublicId type to avoid redundant type definitions
      const { imagePublicId } = user.get() as UserImagePublicId;
      if (imagePublicId) {
        await deleteImageFromCloudinary(imagePublicId);
      }

      const uploadResult = await uploadImageToCloudinary(
        fileBuffer,
        "blog/users",
        fileName || "profile-image"
      );
      // Type assertion: Cloudinary returns secure_url and public_id
      const cloudinaryResult = uploadResult as {
        secure_url: string;
        public_id: string;
      };
      updateData.image = cloudinaryResult.secure_url;
      updateData.imagePublicId = cloudinaryResult.public_id;
    } else if (data.image === null || data.image === "") {
      // Image explicitly removed: delete from Cloudinary and set to null in database
      // Reuses UserImagePublicId type to avoid redundant type definitions
      const { imagePublicId } = user.get() as UserImagePublicId;
      if (imagePublicId) {
        await deleteImageFromCloudinary(imagePublicId);
      }
      updateData.image = null;
      updateData.imagePublicId = null;
    }
    // If image field not provided, keep existing image (don't touch it)

    await user.update(updateData);

    // Extract updated user data
    // Reuses UserModelData type to avoid redundant type definitions
    // Note: Renamed variables to avoid conflicts with data destructuring above
    const {
      id: userId,
      name: userName,
      email: userEmail,
      phone: userPhone,
      status: userStatus,
      image: userImage,
    } = user.get() as UserModelData;

    return {
      ok: true,
      data: {
        id: userId,
        name: userName,
        email: userEmail,
        phone: userPhone ?? null,
        image: userImage ?? null,
        status: userStatus,
      },
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

    const user = await this.User.findByPk(requestedUserId);
    if (!user) {
      throw new AppError("USER_NOT_FOUND", NOT_FOUND);
    }

    // Delete associated image from Cloudinary before deleting user
    // Reuses UserImagePublicId type to avoid redundant type definitions
    const { imagePublicId } = user.get() as UserImagePublicId;
    if (imagePublicId) {
      await deleteImageFromCloudinary(imagePublicId);
    }

    await user.destroy();
    return { ok: true };
  }
}

// Export singleton instance
export const userService = new UserService(models);

