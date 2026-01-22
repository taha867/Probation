import { Repository } from "typeorm";
import { Comment } from "./comment-entity/comment.entity";
import { Post } from "../posts/post-entity/post.entity";
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
            postId: number;
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
    updateComment(commentId: number, userId: number, updateCommentDto: UpdateCommentDto): Promise<{
        data: {
            id: number;
            postId: number;
        };
        message: "Comment updated successfully";
    }>;
    deleteComment(commentId: number, userId: number): Promise<void>;
}
//# sourceMappingURL=comments.service.d.ts.map