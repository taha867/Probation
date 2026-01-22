import { Repository } from "typeorm";
import { Post, PostStatus } from "./post-entity/post.entity";
import { Comment } from "../comments/comment-entity/comment.entity";
import { User } from "../users/user-entity/user.entity";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { PaginationService } from "../pagination/pagination.service";
import { CreatePostDto } from "./dto/create-post-input.dto";
import { UpdatePostDto } from "./dto/update-post-input.dto";
import { ListPostsQueryDto } from "./dto/list-posts-query-payload.dto";
import { PaginationQueryDto } from "./dto/pagination-query-input.dto";
export declare class PostsService {
    private postRepository;
    private commentRepository;
    private userRepository;
    private cloudinaryService;
    private paginationService;
    constructor(postRepository: Repository<Post>, commentRepository: Repository<Comment>, userRepository: Repository<User>, cloudinaryService: CloudinaryService, paginationService: PaginationService);
    createPost(createPostDto: CreatePostDto, userId: number, file?: Express.Multer.File): Promise<{
        data: {
            id: number;
            title: string;
            body: string;
            userId: number;
            status: PostStatus;
            image: string | null;
            imagePublicId: string | null;
            author: {
                id: number;
                name: string;
                email: string;
                image: string | null;
            };
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
                author: {
                    id: number;
                    name: string;
                    email: string;
                    image: string | null;
                };
            }[];
            paginationOptions: import("../pagination/dto/pagination-meta.dto").PaginationMetaDto;
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
        author: {
            id: number;
            name: string;
            email: string;
            image: string | null;
        };
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
            paginationOptions: import("../pagination/dto/pagination-meta.dto").PaginationMetaDto;
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
            author: {
                id: number;
                name: string;
                email: string;
                image: string | null;
            };
        };
        message: "Post updated successfully";
    }>;
    deletePost(postId: number, userId: number): Promise<void>;
}
//# sourceMappingURL=posts.service.d.ts.map