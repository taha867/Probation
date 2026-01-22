import type { User } from "../users/user.entity";
import type { Comment } from "../comments/comment.entity";
import { BaseEntity } from "../common/entities/BaseEntity";
export declare enum PostStatus {
    DRAFT = "draft",
    PUBLISHED = "published"
}
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
//# sourceMappingURL=post.entity.d.ts.map