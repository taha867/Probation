import type { SearchableQuery, PaginatedResult, ServiceResult, BaseUpdateWithFileInput, BaseEntityOwnershipInput, BaseAuthorizationInput, PaginationMeta } from './commonInterface';
import type { BaseUserProfile } from './userInterface';
import type { CommentWithAuthor } from './commentInterface';
/**
 * Post status type
 * Valid post status values
 */
export type PostStatus = 'draft' | 'published';
/**
 * Post summary interface
 * Minimal post information (id and title only)
 * Used when displaying post references in comments or other contexts
 */
export interface PostSummary {
    id: number;
    title: string;
}
/**
 * Base post interface
 * Common post fields used across the application
 */
export interface BasePost {
    id: number;
    title: string;
    body: string;
    userId: number;
    status: PostStatus;
    image: string | null;
    imagePublicId: string | null;
}
/**
 * Post with author interface
 * Post information with author details
 * Used when fetching posts with author information
 */
export interface PostWithAuthor extends BasePost {
    author: BaseUserProfile;
}
/**
 * Create post input interface
 * Data required to create a new post
 */
export interface CreatePostInput {
    title: string;
    body: string;
    status?: PostStatus;
    image?: string | null;
    imagePublicId?: string | null;
}
/**
 * Update post input interface
 * Data that can be updated by post owner
 * All fields are optional (partial update)
 */
export interface UpdatePostInput {
    title?: string;
    body?: string;
    status?: PostStatus;
    image?: string | null;
}
/**
 * List posts query parameters
 * Pagination, search, and filter parameters for listing posts
 * Extends SearchableQuery with additional filters
 */
export interface ListPostsQuery extends SearchableQuery {
    userId?: number;
    status?: PostStatus;
}
/**
 * List posts result
 * Result from listPosts service method
 * Uses PaginatedResult<T> DTO for consistency
 */
export type ListPostsResult = PaginatedResult<PostWithAuthor>;
/**
 * Create post service input
 * Input parameters for createPost service method
 * Includes authorization (userId) and post data
 */
export interface CreatePostServiceInput extends BaseAuthorizationInput {
    data: CreatePostInput;
    image?: string | null;
    imagePublicId?: string | null;
}
/**
 * Create post service result
 * Result from createPost service method
 * Uses ServiceResult<T> DTO for consistency
 */
export type CreatePostServiceResult = ServiceResult<PostWithAuthor>;
/**
 * Update post service input
 * Input parameters for updatePostForUser service method
 * Uses DRY principle: Extends base interfaces for authorization and file upload
 *
 * Note: Uses Omit to override entityId with postId for clarity
 * All other fields (authUserId, data, fileBuffer, fileName) come from BaseUpdateWithFileInput
 */
export interface UpdatePostServiceInput extends Omit<BaseUpdateWithFileInput<UpdatePostInput>, 'entityId'> {
    postId: number;
}
/**
 * Update post service result
 * Result from updatePostForUser service method
 * Uses ServiceResult<T> DTO for consistency
 */
export type UpdatePostServiceResult = ServiceResult<PostWithAuthor>;
/**
 * Delete post service input
 * Input parameters for deletePostForUser service method
 * Uses DRY principle: Extends BaseEntityOwnershipInput for authorization
 *
 * Note: Uses Omit to override entityId with postId for clarity
 * authUserId comes from BaseEntityOwnershipInput
 */
export interface DeletePostServiceInput extends Omit<BaseEntityOwnershipInput, 'entityId'> {
    postId: number;
}
/**
 * Get post comments service input
 * Input parameters for getPostWithComments service method
 *
 * Note: Kept explicit (not extending BaseQuery) because:
 * - page and limit are required here (not optional like in BaseQuery)
 * - offset is calculated, not part of input
 * - Explicit structure is clearer for service layer
 */
export interface GetPostCommentsServiceInput {
    postId: number;
    page: number;
    limit: number;
}
/**
 * Get post comments service result
 * Result from getPostWithComments service method
 * Includes post, paginated comments, and metadata
 * Note: CommentWithAuthor is imported from commentInterface.ts
 */
export interface GetPostCommentsServiceResult {
    post: BasePost | null;
    comments: CommentWithAuthor[];
    meta: PaginationMeta | null;
}
/**
 * Post user ID type
 * Used for operations that only need userId for authorization checks
 */
export type PostUserId = {
    userId: number;
};
/**
 * Post image public ID type
 * Used for operations that only need imagePublicId for Cloudinary deletion
 */
export type PostImagePublicId = {
    imagePublicId?: string | null;
};
/**
 * Post data from TypeORM entity
 * Complete post data structure returned from TypeORM entity
 * Used when destructuring post data from TypeORM entities
 */
export type PostModelData = BasePost & {
    createdAt?: Date;
    updatedAt?: Date;
};
//# sourceMappingURL=postInterface.d.ts.map