import { Repository } from "typeorm";
import { Comment } from "./comment.entity";
import { Post } from "../posts/post.entity";
import { CreateCommentDto } from "./dto/create-comment-input.dto";
import { UpdateCommentDto } from "./dto/update-comment-input.dto";
import { ListCommentsQueryDto } from "./dto/list-comments-query-payload.dto";
export declare class CommentsService {
    private commentRepository;
    private postRepository;
    constructor(commentRepository: Repository<Comment>, postRepository: Repository<Post>);
    createCommentOrReply(createCommentDto: CreateCommentDto, userId: number): Promise<{
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
        };
        message: "Comment created successfully";
    }>;
    listTopLevelComments(query: ListCommentsQueryDto): Promise<{
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
    findCommentWithAuthor(id: number): Promise<{
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
    } | null>;
    updateComment(commentId: number, userId: number, updateCommentDto: UpdateCommentDto): Promise<{
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
        };
        message: "Comment updated successfully";
    }>;
    deleteComment(commentId: number, userId: number): Promise<void>;
}
//# sourceMappingURL=comments.service.d.ts.map