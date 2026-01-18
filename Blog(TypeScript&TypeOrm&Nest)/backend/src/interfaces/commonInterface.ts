

/**
 * @template T - Type of data payload (defaults to void for simple success responses)
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
 */
export interface IdParam {
  id: number;
}

/**
 * Post ID parameter interface for comments endpoint
 * Used when route parameter is named "postId" instead of "id"
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
 */
export interface BaseEntityOwnershipInput extends BaseAuthorizationInput {
  entityId: number;
}

/**
 * Base update with file upload input DTO
 * Common structure for update operations that accept file uploads
 * Combines authorization, file upload, and update data
 */
export interface BaseUpdateWithFileInput<T> extends BaseAuthorizationInput, FileUploadInput {
  entityId: number;
  data: Partial<T>;
}

