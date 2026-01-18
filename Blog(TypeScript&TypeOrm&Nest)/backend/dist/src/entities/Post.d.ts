import type { User } from "./User.js";
import type { Comment } from "./Comment.js";
import { BaseEntity } from "./BaseEntity.js";
/**
 * Post status enum, best for roles, status, updates, etc.
 */
export declare enum PostStatus {
    DRAFT = "draft",
    PUBLISHED = "published"
}
/**
 * Post entity
 * Represents a blog post in the database
 * Extends BaseEntity for automatic timestamp management
 */
export declare class Post extends BaseEntity {
    id: number;
    title: string;
    body: string;
    userId: number;
    status: PostStatus;
    image: string | null;
    imagePublicId: string | null;
    author: User;
    comments: Comment[];
}
//# sourceMappingURL=Post.d.ts.map