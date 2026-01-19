import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { ListPostsQueryDto } from './dto/listPostsQuery.dto';
import { PaginationQueryDto } from './dto/paginationQuery.dto';
export declare class PostsController {
    private postsService;
    constructor(postsService: PostsService);
    create(createPostDto: CreatePostDto, userId: number, file?: Express.Multer.File): Promise<{
        data: {
            id: number;
            title: string;
            body: string;
            userId: number;
            status: import("../entities/Post").PostStatus;
            image: string | null;
            imagePublicId: string | null;
            author: import("../interfaces").BaseUserProfile;
        };
        message: string;
    }>;
    list(query: ListPostsQueryDto): Promise<{
        data: {
            items: {
                id: number;
                title: string;
                body: string;
                userId: number;
                status: import("../entities/Post").PostStatus;
                image: string | null;
                imagePublicId: string | null;
                author: import("../interfaces").BaseUserProfile;
            }[];
            meta: import("../interfaces").PaginationMeta;
        };
    }>;
    getOne(id: number): Promise<{
        data: {
            id: number;
            title: string;
            body: string;
            userId: number;
            status: import("../entities/Post").PostStatus;
            image: string | null;
            imagePublicId: string | null;
            author: import("../interfaces").BaseUserProfile;
        };
    }>;
    getPostComments(postId: number, query: PaginationQueryDto): Promise<{
        data: {
            post: {
                id: number;
                title: string;
                body: string;
                userId: number;
                status: import("../entities/Post").PostStatus;
                image: string | null;
                imagePublicId: string | null;
            };
            comments: import("../entities/Comment").Comment[];
            meta: import("../interfaces").PaginationMeta;
        };
    }>;
    update(id: number, updatePostDto: UpdatePostDto, userId: number, file?: Express.Multer.File): Promise<{
        data: {
            id: number;
            title: string;
            body: string;
            userId: number;
            status: import("../entities/Post").PostStatus;
            image: string | null;
            imagePublicId: string | null;
            author: import("../interfaces").BaseUserProfile;
        };
        message: string;
    }>;
    delete(id: number, userId: number): Promise<{
        data: {
            message: "Post deleted successfully";
        };
    }>;
}
//# sourceMappingURL=posts.controller.d.ts.map