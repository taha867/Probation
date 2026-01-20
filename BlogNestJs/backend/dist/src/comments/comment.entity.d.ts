import type { User } from '../users/user.entity';
import type { Post } from '../posts/post.entity';
import { BaseEntity } from '../common/entities/BaseEntity';
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
//# sourceMappingURL=comment.entity.d.ts.map