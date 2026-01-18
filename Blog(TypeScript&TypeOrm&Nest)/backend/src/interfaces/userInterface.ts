import type {
  BaseQuery,
  SearchableQuery,
  PaginatedResult,
  ServiceResult,
  BaseUpdateWithFileInput,
  BaseEntityOwnershipInput,
  PaginationMeta,
} from "./commonInterface.js";

/**
 * Base user profile interface
 * Common user fields used across the application
 */
export interface BaseUserProfile {
  id: number;
  name: string;
  email: string;
  image: string | null;
}

/**
 * Public user profile interface
 * User information visible to other users
 * Used in user lists and public profiles
 */
export interface PublicUserProfile extends BaseUserProfile {
  phone: string | null;
  status: string | null;
}

/**
 * Auth user data interface
 * User data with tokenVersion for authentication operations
 * Extends PublicUserProfile to include tokenVersion for token management
 * Used when destructuring user data from TypeORM entities in auth services
 */
export interface AuthUserData extends PublicUserProfile {
  tokenVersion?: number;
}

/**
 * User token version type
 * Minimal type for operations that only need tokenVersion
 * Used for logout and token invalidation operations
 */
export type UserTokenVersion = {
  tokenVersion?: number;
};

/**
 * User ID and email with token version type
 * Used for token refresh operations that need id, email, and tokenVersion
 */
export type UserIdEmailToken = Pick<PublicUserProfile, "id" | "email"> & {
  tokenVersion?: number;
};

/**
 * User ID and name type
 * Used for operations that only need user identification and name
 */
export type UserIdAndName = Pick<BaseUserProfile, "id" | "name">;

/**
 * User image public ID type
 * Used for operations that only need imagePublicId for Cloudinary deletion
 */
export type UserImagePublicId = {
  imagePublicId?: string | null;
};

/**
 * Update user input interface
 * Data that can be updated by user
 * All fields are optional (partial update)
 */
export interface UpdateUserInput 
  extends Partial<Omit<PublicUserProfile, "id" | "status">> {
  password?: string; // Password is not part of PublicUserProfile
}

/**
 * List users query parameters
 * Pagination parameters for listing users
 * Uses BaseQuery DTO for consistency
 */
export type ListUsersQuery = BaseQuery;

/**
 * Get user posts query parameters
 * Pagination and search parameters for user posts
 * Uses SearchableQuery DTO for consistency
 */
export type GetUserPostsQuery = SearchableQuery;

/**
 * List users result
 * Result from listUsers service method
 * Uses PaginatedResult<T> DTO for consistency
 */
export type ListUsersResult = PaginatedResult<PublicUserProfile>;

/**
 * Update user service input
 * Input parameters for updateUserForSelf service method
 * Uses DRY principle: Extends base interfaces for authorization and file upload
 * 
 * Note: Uses intersection type to override entityId with requestedUserId for clarity
 * All other fields (authUserId, data, fileBuffer, fileName) come from BaseUpdateWithFileInput
 */
export interface UpdateUserServiceInput 
  extends Omit<BaseUpdateWithFileInput<UpdateUserInput>, "entityId"> {
  requestedUserId: number; // Override entityId with user-specific name
}

/**
 * Update user service result
 * Result from updateUserForSelf service method
 * Uses ServiceResult<T> DTO for consistency
 */
export type UpdateUserServiceResult = ServiceResult<PublicUserProfile>;

/**
 * Delete user service input
 * Input parameters for deleteUserForSelf service method
 * Uses DRY principle: Extends BaseEntityOwnershipInput for authorization
 * 
 * Note: Uses Omit to override entityId with requestedUserId for clarity
 * authUserId comes from BaseEntityOwnershipInput
 */
export interface DeleteUserServiceInput 
  extends Omit<BaseEntityOwnershipInput, "entityId"> {
  requestedUserId: number; // Override entityId with user-specific name
}


/**
 * Get user posts service input
 * Input parameters for getUserPostsWithComments service method
 * 
 * Note: Kept explicit (not extending SearchableQuery) because:
 * - page and limit are required here (not optional like in SearchableQuery)
 * - offset is calculated, not part of input
 * - Explicit structure is clearer for service layer
 */
export interface GetUserPostsServiceInput {
  userId: number;
  page: number; // Required (not optional like BaseQuery)
  limit: number; // Required (not optional like BaseQuery)
  search?: string; // Optional search parameter
}

/**
 * Get user posts service result
 * Result from getUserPostsWithComments service method
 * Note: posts and meta types are complex (include nested comments)
 * Using any for now - can be typed more specifically later
 */
export interface GetUserPostsServiceResult {
  user: BaseUserProfile | null;
  posts: any[]; // TODO: Type this properly with Post interface
  meta: PaginationMeta | null;
}

