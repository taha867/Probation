import { AppDataSource } from "../config/data-source.js";
import { HTTP_STATUS } from "../utils/constants.js";
import { AppError } from "../utils/errors.js";
import { CommentRepository, PostRepository, } from "../repositories/index.js";
import { mapAuthorData } from "../utils/mappers.js";
const { NOT_FOUND, FORBIDDEN, INTERNAL_SERVER_ERROR, BAD_REQUEST } = HTTP_STATUS;
export class CommentService {
    /**
     * Constructor initializes the service with repositories
     * Supports dependency injection for testability
     */
    constructor(commentRepo, postRepo) {
        this.commentRepo = commentRepo || new CommentRepository(AppDataSource);
        this.postRepo = postRepo || new PostRepository(AppDataSource);
    }
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
    async createCommentOrReply(params) {
        const { authUserId, data } = params;
        const { body, postId, parentId } = data;
        let finalPostId;
        if (parentId) {
            // This is a reply to another comment
            const parentComment = await this.commentRepo.findByIdWithFields(parentId, [
                "id",
                "postId",
            ]);
            if (!parentComment) {
                throw new AppError("PARENT_COMMENT_NOT_FOUND", NOT_FOUND);
            }
            finalPostId = parentComment.postId;
        }
        else {
            // This is a top-level comment
            if (!postId) {
                throw new AppError("POST_ID_REQUIRED", BAD_REQUEST);
            }
            const post = await this.postRepo.findById(postId);
            if (!post) {
                throw new AppError("POST_NOT_FOUND", NOT_FOUND);
            }
            finalPostId = postId;
        }
        // Use repository create method which explicitly sets timestamps
        const comment = await this.commentRepo.create({
            body,
            postId: finalPostId,
            userId: authUserId,
            parentId: parentId || null,
        });
        // Use repository method to fetch created comment with relations
        const createdComment = await this.commentRepo.findWithRelations(comment.id);
        if (!createdComment) {
            throw new AppError("COMMENT_CREATION_FAILED", INTERNAL_SERVER_ERROR);
        }
        return {
            ok: true,
            data: createdComment,
        };
    }
    /**
     * List top-level comments, optionally filtered by post
     *
     * @param params - Query parameters
     * @param params.postId - Optional post ID to filter comments
     * @returns Promise resolving to array of comments with author and post
     */
    async listTopLevelComments(params) {
        const { postId } = params;
        // Use repository method to load comments
        const comments = await this.commentRepo.findAllTopLevel(postId);
        // Map TypeORM entities to CommentWithAuthor interface
        const commentRows = comments.map((comment) => {
            const { id, body, postId, userId, parentId, createdAt, updatedAt, author } = comment;
            return {
                id,
                body,
                postId,
                userId,
                parentId: parentId ?? null,
                createdAt,
                updatedAt,
                author: mapAuthorData(author),
            };
        });
        return commentRows;
    }
    /**
     * Find comment by ID with all related entities (author, post, replies)
     *
     * @param id - Comment ID to find
     * @returns Promise resolving to comment with relations or null if not found
     */
    async findCommentWithRelations(id) {
        // Use repository method to get comment with relations
        const comment = await this.commentRepo.findWithRelations(id);
        if (!comment) {
            return null;
        }
        // Load replies for this comment (if any)
        const replies = await this.commentRepo.findByParentId(id);
        // Map replies to CommentWithAuthor interface
        const replyRows = replies.map((reply) => {
            const { id, body, postId, userId, parentId, createdAt, updatedAt, author } = reply;
            return {
                id,
                body,
                postId,
                userId,
                parentId: parentId ?? null,
                createdAt,
                updatedAt,
                author: mapAuthorData(author),
            };
        });
        return {
            ...comment,
            replies: replyRows,
        };
    }
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
    async updateCommentForUser(params) {
        const { commentId, authUserId, body } = params;
        // Load full entity for authorization and update
        // Industry best practice: Load once, update, save (triggers hooks automatically)
        const comment = await this.commentRepo.findById(commentId);
        if (!comment) {
            throw new AppError("COMMENT_NOT_FOUND", NOT_FOUND);
        }
        if (comment.userId !== authUserId) {
            throw new AppError("CANNOT_UPDATE_OTHER_COMMENT", FORBIDDEN);
        }
        // Use save() method: triggers @BeforeUpdate hook and updates @UpdateDateColumn automatically
        // Industry best practice: Load → Modify → Save (fewer queries, hooks work)
        await this.commentRepo.updateEntity(comment, { body });
        const updated = await this.findCommentWithRelations(commentId);
        if (!updated) {
            throw new AppError("COMMENT_UPDATE_FAILED", INTERNAL_SERVER_ERROR);
        }
        return {
            ok: true,
            data: updated,
        };
    }
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
    async deleteCommentForUser(params) {
        const { commentId, authUserId } = params;
        const comment = await this.commentRepo.findByIdWithFields(commentId, [
            "id",
            "userId",
        ]);
        if (!comment) {
            throw new AppError("COMMENT_NOT_FOUND", NOT_FOUND);
        }
        if (comment.userId !== authUserId) {
            throw new AppError("CANNOT_DELETE_OTHER_COMMENT", FORBIDDEN);
        }
        // Use repository method for deletion
        await this.commentRepo.delete(commentId);
        return { ok: true };
    }
}
// Export singleton instance
export const commentService = new CommentService();
//# sourceMappingURL=commentService.js.map