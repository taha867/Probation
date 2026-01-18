import { DataSource } from "typeorm";
import { Comment } from "../entities/Comment.js";
import type { CommentWithRelations } from "../interfaces/commentInterface.js";
import { BaseRepository } from "./BaseRepository.js";
export declare class CommentRepository extends BaseRepository<Comment> {
    constructor(dataSource: DataSource);
    /**
     * Find comment with all relations (author, post, replies)
     */
    findWithRelations(id: number): Promise<CommentWithRelations | null>;
    /**
     * Find top-level comments for a post with pagination
     */
    findTopLevelWithReplies(postId: number, page: number, limit: number): Promise<[Comment[], number]>;
    /**
     * Find comment by parent ID (replies)
     */
    findByParentId(parentId: number): Promise<Comment[]>;
    /**
     * Find all top-level comments (optionally filtered by post)
     *
     * @param postId - Optional post ID to filter comments
     * @returns Array of top-level comments with author and post information
     */
    findAllTopLevel(postId?: number): Promise<Comment[]>;
}
//# sourceMappingURL=CommentRepository.d.ts.map