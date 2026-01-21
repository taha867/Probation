import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post-input.dto';
import { UpdatePostDto } from './dto/update-post-input.dto';
import { ListPostsQueryDto } from './dto/list-posts-query-payload.dto';
import { PaginationQueryDto } from './dto/pagination-query-input.dto';
export declare class PostsController {
    private postsService;
    constructor(postsService: PostsService);
    create(createPostDto: CreatePostDto, userId: number, file?: Express.Multer.File): Promise<{
        data: {
            id: number;
            title: string;
            body: string;
            userId: number;
            status: import("./post.entity").PostStatus;
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
    list(query: ListPostsQueryDto): Promise<{
        data: {
            items: {
                id: number;
                title: string;
                body: string;
                userId: number;
                status: import("./post.entity").PostStatus;
                image: string | null;
                imagePublicId: string | null;
                author: {
                    id: number;
                    name: string;
                    email: string;
                    image: string | null;
                };
            }[];
            meta: import("../pagination/dto/pagination-meta.dto").PaginationMetaDto;
        };
    }>;
    getOne(id: number): Promise<{
        data: {
            id: number;
            title: string;
            body: string;
            userId: number;
            status: import("./post.entity").PostStatus;
            image: string | null;
            imagePublicId: string | null;
            author: {
                id: number;
                name: string;
                email: string;
                image: string | null;
            };
        };
    }>;
    getPostComments(postId: number, query: PaginationQueryDto): Promise<{
        data: {
            post: {
                id: number;
                title: string;
                body: string;
                userId: number;
                status: import("./post.entity").PostStatus;
                image: string | null;
                imagePublicId: string | null;
            };
            comments: import("../comments/comment.entity").Comment[];
            meta: import("../pagination/dto/pagination-meta.dto").PaginationMetaDto;
        };
    }>;
    update(id: number, updatePostDto: UpdatePostDto, userId: number, file?: Express.Multer.File): Promise<{
        data: {
            id: number;
            title: string;
            body: string;
            userId: number;
            status: import("./post.entity").PostStatus;
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
    delete(id: number, userId: number): Promise<{
        data: {
            message: "Post deleted successfully";
        };
    }>;
}
//# sourceMappingURL=posts.controller.d.ts.map