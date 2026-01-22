import type { User } from "../../users/user-entity/user.entity";
import type { Post } from "../../posts/post-entity/post.entity";
import { BaseEntity } from "../../common/entities/BaseEntity";
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