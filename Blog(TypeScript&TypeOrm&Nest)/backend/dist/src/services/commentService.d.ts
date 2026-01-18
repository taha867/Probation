import { CommentRepository, PostRepository } from "../repositories/index.js";
import { CreateCommentServiceInput, CreateCommentServiceResult, UpdateCommentServiceInput, UpdateCommentServiceResult, DeleteCommentServiceInput, ListCommentsServiceInput, ListCommentsServiceResult, CommentWithRelations } from "../interfaces/commentInterface.js";
import type { ServiceResult } from "../interfaces/commonInterface.js";
export declare class CommentService {
    /**
     * Comment repository instance
     */
    private commentRepo;
    /**
     * Post repository instance
     */
    private postRepo;
    /**
     * Constructor initializes the service with repositories
     * Supports dependency injection for testability
     */
    constructor(commentRepo?: CommentRepository, postRepo?: PostRepository);
    /**
     * Create a new comment or reply to an existing comment
     * Handles both top-level comments and nested replies
     *
     * @param params - Create parameters
     * @param params.authUserId - ID of user creating the comment
     * @param params.data - Comment data (body, postId or parentId)
     * @returns Promise resolving to created comment with relations
     * @throws AppError if post/parent comment not found
     */
    createCommentOrReply(params: CreateCommentServiceInput): Promise<CreateCommentServiceResult>;
    /**
     * List top-level comments, optionally filtered by post
     *
     * @param params - Query parameters
     * @param params.postId - Optional post ID to filter comments
     * @returns Promise resolving to array of comments with author and post
     */
    listTopLevelComments(params: ListCommentsServiceInput): Promise<ListCommentsServiceResult>;
    /**
     * Find comment by ID with all related entities (author, post, replies)
     *
     * @param id - Comment ID to find
     * @returns Promise resolving to comment with relations or null if not found
     */
    findCommentWithRelations(id: number): Promise<CommentWithRelations | null>;
    /**
     * Update comment (owner-only)
     * Users can only update their own comments
     *
     * @param params - Update parameters
     * @param params.commentId - ID of comment to update
     * @param params.authUserId - ID of authenticated user (must match comment owner)
     * @param params.body - New comment body
     * @returns Promise resolving to updated comment with relations
     * @throws AppError if comment not found or unauthorized
     */
    updateCommentForUser(params: UpdateCommentServiceInput): Promise<UpdateCommentServiceResult>;
    /**
     * Delete comment (owner-only)
     * Users can only delete their own comments
     * Cascades to replies automatically via database constraints
     *
     * @param params - Delete parameters
     * @param params.commentId - ID of comment to delete
     * @param params.authUserId - ID of authenticated user (must match comment owner)
     * @returns Promise resolving to success response
     * @throws AppError if comment not found or unauthorized
     */
    deleteCommentForUser(params: DeleteCommentServiceInput): Promise<ServiceResult<void>>;
}
export declare const commentService: CommentService;
//# sourceMappingURL=commentService.d.ts.map