import type { ServiceResult, BaseEntityOwnershipInput, BaseAuthorizationInput } from "./commonInterface";
import type { BaseUserProfile } from "./userInterface";
import type { PostSummary } from "./postInterface";
/**
 * Base comment interface
 * Common comment fields used across the application
 */
export interface BaseComment {
    id: number;
    body: string;
    postId: number;
    userId: number;
    parentId: number | null;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Comment with author interface
 * Comment information with author details
 * Used when fetching comments with author information
 */
export interface CommentWithAuthor extends BaseComment {
    author: BaseUserProfile;
}
/**
 * Comment with relations interface
 * Comment with author, post, and nested replies
 * Used when fetching a single comment with all related data
 */
export interface CommentWithRelations extends CommentWithAuthor {
    post: PostSummary;
    replies?: CommentWithAuthor[];
}
/**
 * Create comment input interface
 * Data required to create a new comment or reply
 * Either postId or parentId must be provided
 */
export interface CreateCommentInput {
    body: string;
    postId?: number;
    parentId?: number;
}
/**
 * Update comment input interface
 * Data that can be updated by comment owner
 */
export interface UpdateCommentInput {
    body: string;
}
/**
 * List comments query parameters
 * Query parameters for listing top-level comments
 */
export interface ListCommentsQuery {
    postId?: number;
}
/**
 * Create comment service input
 * Input parameters for createCommentOrReply service method
 * Includes authorization (userId) and comment data
 */
export interface CreateCommentServiceInput extends BaseAuthorizationInput {
    data: CreateCommentInput;
}
/**
 * Create comment service result
 * Result from createCommentOrReply service method
 * Uses ServiceResult<T> DTO for consistency
 */
export type CreateCommentServiceResult = ServiceResult<CommentWithRelations>;
/**
 * Update comment service input
 * Input parameters for updateCommentForUser service method
 * Uses DRY principle: Extends base interfaces for authorization
 *
 * Note: Uses Omit to override entityId with commentId for clarity
 * authUserId comes from BaseEntityOwnershipInput
 */
export interface UpdateCommentServiceInput extends Omit<BaseEntityOwnershipInput, "entityId"> {
    commentId: number;
    body: string;
}
/**
 * Update comment service result
 * Result from updateCommentForUser service method
 * Uses ServiceResult<T> DTO for consistency
 */
export type UpdateCommentServiceResult = ServiceResult<CommentWithRelations>;
/**
 * Delete comment service input
 * Input parameters for deleteCommentForUser service method
 * Uses DRY principle: Extends BaseEntityOwnershipInput for authorization
 *
 * Note: Uses Omit to override entityId with commentId for clarity
 * authUserId comes from BaseEntityOwnershipInput
 */
export interface DeleteCommentServiceInput extends Omit<BaseEntityOwnershipInput, "entityId"> {
    commentId: number;
}
/**
 * List comments service input
 * Input parameters for listTopLevelComments service method
 */
export interface ListCommentsServiceInput {
    postId?: number;
}
/**
 * List comments service result
 * Result from listTopLevelComments service method
 * Returns array of comments with author and post information
 */
export type ListCommentsServiceResult = CommentWithAuthor[];
/**
 * Comment user ID type
 * Used for operations that only need userId for authorization checks
 */
export type CommentUserId = {
    userId: number;
};
/**
 * Comment post ID type
 * Used for operations that only need postId
 */
export type CommentPostId = {
    postId: number;
};
/**
 * Comment data from TypeORM entity
 * Complete comment data structure returned from TypeORM entity
 * Used when destructuring comment data from TypeORM entities
 */
export type CommentModelData = BaseComment;
//# sourceMappingURL=commentInterface.d.ts.map