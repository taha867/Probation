import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment-input.dto';
import { UpdateCommentDto } from './dto/update-comment-input.dto';
import { ListCommentsQueryDto } from './dto/list-comments-query-payload.dto';
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
            author: {
                id: number;
                name: string;
                email: string;
                image: string | null;
            };
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
                author: {
                    id: number;
                    name: string;
                    email: string;
                    image: string | null;
                };
            }[];
        };
        message: "Comment created successfully";
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
            author: {
                id: number;
                name: string;
                email: string;
                image: string | null;
            };
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
            author: {
                id: number;
                name: string;
                email: string;
                image: string | null;
            };
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
                author: {
                    id: number;
                    name: string;
                    email: string;
                    image: string | null;
                };
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
            author: {
                id: number;
                name: string;
                email: string;
                image: string | null;
            };
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
                author: {
                    id: number;
                    name: string;
                    email: string;
                    image: string | null;
                };
            }[];
        };
        message: "Comment updated successfully";
    }>;
    delete(id: number, userId: number): Promise<{
        data: {
            message: "Comment deleted successfully";
        };
    }>;
}
//# sourceMappingURL=comments.controller.d.ts.map