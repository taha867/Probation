import { Repository } from 'typeorm';
import { Post, PostStatus } from './post.entity';
import { Comment } from '../comments/comment.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
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
            author: import("../interfaces/userInterface").BaseUserProfile;
        };
        message: "Post created successfully";
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
                author: import("../interfaces/userInterface").BaseUserProfile;
            }[];
            meta: import("../interfaces/commonInterface").PaginationMeta;
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
        author: import("../interfaces/userInterface").BaseUserProfile;
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
            meta: import("../interfaces/commonInterface").PaginationMeta;
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
            author: import("../interfaces/userInterface").BaseUserProfile;
        };
        message: "Post updated successfully";
    }>;
    deletePost(postId: number, userId: number): Promise<void>;
}
//# sourceMappingURL=posts.service.d.ts.map