import { Repository } from 'typeorm';
import { Post, PostStatus } from '../entities/Post';
import { Comment } from '../entities/Comment';
import { CloudinaryService } from '../shared/services/cloudinary.service';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { ListPostsQueryDto } from './dto/listPostsQuery.dto';
import { PaginationQueryDto } from './dto/paginationQuery.dto';
export declare class PostsService {
    private postRepository;
    private commentRepository;
    private cloudinaryService;
    constructor(postRepository: Repository<Post>, commentRepository: Repository<Comment>, cloudinaryService: CloudinaryService);
    createPost(createPostDto: CreatePostDto, userId: number, file?: Express.Multer.File): Promise<{
        data: {
            id: number;
            title: string;
            body: string;
            userId: number;
            status: PostStatus;
            image: string | null;
            imagePublicId: string | null;
            author: import("../interfaces").BaseUserProfile;
        };
        message: string;
    }>;
    listPosts(query: ListPostsQueryDto): Promise<{
        data: {
            items: {
                id: number;
                title: string;
                body: string;
                userId: number;
                status: PostStatus;
                image: string | null;
                imagePublicId: string | null;
                author: import("../interfaces").BaseUserProfile;
            }[];
            meta: import("../interfaces").PaginationMeta;
        };
    }>;
    findPostWithAuthor(id: number): Promise<{
        id: number;
        title: string;
        body: string;
        userId: number;
        status: PostStatus;
        image: string | null;
        imagePublicId: string | null;
        author: import("../interfaces").BaseUserProfile;
    } | null>;
    getPostWithComments(postId: number, query: PaginationQueryDto): Promise<{
        data: {
            post: {
                id: number;
                title: string;
                body: string;
                userId: number;
                status: PostStatus;
                image: string | null;
                imagePublicId: string | null;
            };
            comments: Comment[];
            meta: import("../interfaces").PaginationMeta;
        };
    }>;
    updatePost(postId: number, userId: number, updatePostDto: UpdatePostDto, file?: Express.Multer.File): Promise<{
        data: {
            id: number;
            title: string;
            body: string;
            userId: number;
            status: PostStatus;
            image: string | null;
            imagePublicId: string | null;
            author: import("../interfaces").BaseUserProfile;
        };
        message: string;
    }>;
    deletePost(postId: number, userId: number): Promise<void>;
}
//# sourceMappingURL=posts.service.d.ts.map