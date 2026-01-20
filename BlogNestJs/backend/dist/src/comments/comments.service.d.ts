import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { Post } from '../posts/post.entity';
import { CreateCommentDto } from './dto/createComment.dto';
import { UpdateCommentDto } from './dto/updateComment.dto';
import { ListCommentsQueryDto } from './dto/listCommentsQuery.dto';
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
            author: import("../interfaces/userInterface").BaseUserProfile;
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
                author: import("../interfaces/userInterface").BaseUserProfile;
            }[];
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
            author: import("../interfaces/userInterface").BaseUserProfile;
        }[];
    }>;
    findCommentWithRelations(id: number): Promise<{
        id: number;
        body: string;
        postId: number;
        userId: number;
        parentId: number | null;
        createdAt: Date;
        updatedAt: Date;
        author: import("../interfaces/userInterface").BaseUserProfile;
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
            author: import("../interfaces/userInterface").BaseUserProfile;
        }[];
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
            author: import("../interfaces/userInterface").BaseUserProfile;
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
                author: import("../interfaces/userInterface").BaseUserProfile;
            }[];
        };
        message: "Comment updated successfully";
    }>;
    deleteComment(commentId: number, userId: number): Promise<void>;
}
//# sourceMappingURL=comments.service.d.ts.map