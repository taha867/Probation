import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/createComment.dto';
import { UpdateCommentDto } from './dto/updateComment.dto';
import { ListCommentsQueryDto } from './dto/listCommentsQuery.dto';
export declare class CommentsController {
    private commentsService;
    constructor(commentsService: CommentsService);
    create(createCommentDto: CreateCommentDto, userId: number): Promise<{
        data: {
            id: number;
            body: string;
            postId: number;
            userId: number;
            parentId: number | null;
            createdAt: Date;
            updatedAt: Date;
            author: import("../interfaces").BaseUserProfile;
            post: {
                id: number;
                title: string;
            };
            replies: {
                id: number;
                body: string;
                postId: number;
                userId: number;
                parentId: number | null;
                createdAt: Date;
                updatedAt: Date;
                author: import("../interfaces").BaseUserProfile;
            }[];
        };
        message: string;
    }>;
    list(query: ListCommentsQueryDto): Promise<{
        data: {
            id: number;
            body: string;
            postId: number;
            userId: number;
            parentId: number | null;
            createdAt: Date;
            updatedAt: Date;
            author: import("../interfaces").BaseUserProfile;
        }[];
    }>;
    getOne(id: number): Promise<{
        data: {
            id: number;
            body: string;
            postId: number;
            userId: number;
            parentId: number | null;
            createdAt: Date;
            updatedAt: Date;
            author: import("../interfaces").BaseUserProfile;
            post: {
                id: number;
                title: string;
            };
            replies: {
                id: number;
                body: string;
                postId: number;
                userId: number;
                parentId: number | null;
                createdAt: Date;
                updatedAt: Date;
                author: import("../interfaces").BaseUserProfile;
            }[];
        };
    }>;
    update(id: number, updateCommentDto: UpdateCommentDto, userId: number): Promise<{
        data: {
            id: number;
            body: string;
            postId: number;
            userId: number;
            parentId: number | null;
            createdAt: Date;
            updatedAt: Date;
            author: import("../interfaces").BaseUserProfile;
            post: {
                id: number;
                title: string;
            };
            replies: {
                id: number;
                body: string;
                postId: number;
                userId: number;
                parentId: number | null;
                createdAt: Date;
                updatedAt: Date;
                author: import("../interfaces").BaseUserProfile;
            }[];
        };
        message: string;
    }>;
    delete(id: number, userId: number): Promise<{
        data: {
            message: "Comment deleted successfully";
        };
    }>;
}
//# sourceMappingURL=comments.controller.d.ts.map