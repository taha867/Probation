import type { User } from "./User.js";
import type { Post } from "./Post.js";
import { BaseEntity } from "./BaseEntity.js";
/**
 * Comment entity
 * Represents a comment on a post, with support for nested replies
 * Extends BaseEntity for automatic timestamp management
 */
export declare class Comment extends BaseEntity {
    id: number;
    body: string;
    postId: number;
    userId: number;
    parentId: number | null;
    post: Post;
    author: User;
    parent: Comment | null;
    replies: Comment[];
}
//# sourceMappingURL=Comment.d.ts.map