import { DataSource } from "typeorm";
import { Post, PostStatus } from "../entities/Post.js";
import type { PostWithAuthor } from "../interfaces/postInterface.js";
import { BaseRepository } from "./BaseRepository.js";
/**
 * Post Repository
 * Handles all data access operations for Post entity
 * Extends BaseRepository for common CRUD operations
 */
export declare class PostRepository extends BaseRepository<Post> {
    constructor(dataSource: DataSource);
    /**
     * Find post with author information
     */
    findWithAuthor(id: number): Promise<PostWithAuthor | null>;
    /**
     * Find posts with pagination and filters
     */
    findPaginatedWithAuthor(params: {
        page: number;
        limit: number;
        userId?: number;
        status?: PostStatus | string;
        search?: string;
    }): Promise<[Post[], number]>;
    /**
     * Find posts by user ID with nested comments
     */
    findUserPostsWithComments(userId: number, page: number, limit: number, search?: string): Promise<[Post[], number]>;
    /**
     * Find post with comments (for getPostWithComments)
     * Note: Comments are fetched separately in CommentRepository
     *
     * @param postId - Post ID to find
     * @returns Post entity and empty comments array (comments fetched separately)
     */
    findWithComments(postId: number): Promise<{
        post: Post | null;
        comments: never[];
    }>;
}
//# sourceMappingURL=PostRepository.d.ts.map