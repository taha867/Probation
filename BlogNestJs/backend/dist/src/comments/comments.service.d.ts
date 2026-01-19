import { Repository } from 'typeorm';
import { Comment } from '../entities/Comment';
import { Post } from '../entities/Post';
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
    listTopLevelComments(query: ListCommentsQueryDto): Promise<{
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
    findCommentWithRelations(id: number): Promise<{
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
    deleteComment(commentId: number, userId: number): Promise<void>;
}
//# sourceMappingURL=comments.service.d.ts.map