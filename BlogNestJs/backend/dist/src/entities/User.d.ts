import type { Post } from "./Post";
import type { Comment } from "./Comment";
import { BaseEntity } from "./BaseEntity";
export declare class User extends BaseEntity {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    password: string;
    status: string | null;
    image: string | null;
    imagePublicId: string | null;
    lastLoginAt: Date | null;
    tokenVersion: number;
    posts: Post[];
    comments: Comment[];
    toJSON(): Omit<User, "password" | "toJSON">;
}
//# sourceMappingURL=User.d.ts.map