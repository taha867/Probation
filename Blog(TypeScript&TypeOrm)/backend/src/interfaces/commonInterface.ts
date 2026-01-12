

/**
 * Generic service result DTO
 * Standard structure for all service method responses
 * 
 * @template T - Type of data payload (defaults to void for simple success responses)
 * 
 * @example
 * // Simple success response
 * type LogoutResult = ServiceResult<void>;
 * 
 * @example
 * // Response with data
 * type UserResult = ServiceResult<PublicUserProfile>;
 * 
 * @example
 * // Response with complex data
 * type AuthResult = ServiceResult<{
 *   user: PublicUserProfile;
 *   accessToken: string;
 *   refreshToken: string;
 * }>;
 */
export interface ServiceResult<T = void> {
  ok: boolean;
  data?: T;
}

/**
 * Pagination parameters
 * Calculated pagination values used across all list endpoints
 * Generic utility type for pagination calculations
 */
export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

/**
 * Pagination metadata
 * Standard pagination response metadata used across all paginated endpoints
 * Generic utility type for pagination metadata
 */
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  pagination: number; // Total number of pages
}

/**
 * Generic paginated result DTO
 * Standard structure for all paginated service responses
 * Reuses PaginationMeta to avoid duplication
 * 
 * @template T - Type of items in the paginated list
 * 
 * @example
 * type ListUsersResult = PaginatedResult<PublicUserProfile>;
 * 
 * @example
 * type ListPostsResult = PaginatedResult<Post>;
 */
export interface PaginatedResult<T> {
  rows: T[];
  meta: PaginationMeta;
}

/**
 * Base query parameters DTO
 * Common pagination parameters used across all list endpoints
 * All query parameters extend this for consistency
 */
export interface BaseQuery {
  page?: number;
  limit?: number;
}

/**
 * ID parameter interface
 * Common interface for validated route ID parameters
 * Used across all controllers for type-safe parameter extraction
 * 
 * @example
 * // In controller:
 * const validatedParams = validateRequest<IdParam>(
 *   idParamSchema("User ID"),
 *   req.params,
 *   res
 * );
 * const { id } = validatedParams; // TypeScript knows id is number
 */
export interface IdParam {
  id: number;
}

/**
 * Post ID parameter interface for comments endpoint
 * Used when route parameter is named "postId" instead of "id"
 * 
 * @example
 * // Route: /posts/:postId/comments
 * const validatedParams = validateRequest<PostIdParam>(
 *   postIdParamForCommentsSchema,
 *   req.params,
 *   res
 * );
 * const { postId } = validatedParams; // TypeScript knows postId is number
 */
export interface PostIdParam {
  postId: number;
}

/**
 * Searchable query parameters DTO
 * Extends BaseQuery with search capability
 * Used for endpoints that support text search functionality
 */
export interface SearchableQuery extends BaseQuery {
  search?: string;
}

/**
 * File upload input DTO
 * Common structure for operations that accept file uploads
 * Used in update operations for user profiles, posts, etc.
 */
export interface FileUploadInput {
  fileBuffer: Buffer | null;
  fileName: string | null;
}

/**
 * Base authorization input DTO
 * Common structure for operations requiring authentication
 * All authenticated service inputs should extend this
 * 
 * @example
 * // User operations
 * interface UpdateUserServiceInput extends BaseAuthorizationInput {
 *   requestedUserId: number;
 *   data: UpdateUserInput;
 * }
 * 
 * @example
 * // Post/Comment operations (future)
 * interface UpdatePostServiceInput extends BaseAuthorizationInput {
 *   postId: number;
 *   data: UpdatePostInput;
 * }
 */
export interface BaseAuthorizationInput {
  authUserId: number;
}

/**
 * Base entity ownership input DTO
 * Common structure for operations that check entity ownership
 * Extends BaseAuthorizationInput with entity ID
 * Used for delete operations and ownership checks
 * 
 * @example
 * interface DeleteUserServiceInput extends BaseEntityOwnershipInput {
 *   requestedUserId: number; // Override entityId with specific name
 * }
 */
export interface BaseEntityOwnershipInput extends BaseAuthorizationInput {
  entityId: number;
}

/**
 * Base update with file upload input DTO
 * Common structure for update operations that accept file uploads
 * Combines authorization, file upload, and update data
 * 
 * @template T - Type of update data
 * 
 * @example
 * interface UpdateUserServiceInput extends BaseUpdateWithFileInput<UpdateUserInput> {
 *   requestedUserId: number; // Override entityId
 * }
 */
export interface BaseUpdateWithFileInput<T> extends BaseAuthorizationInput, FileUploadInput {
  entityId: number;
  data: Partial<T>;
}

