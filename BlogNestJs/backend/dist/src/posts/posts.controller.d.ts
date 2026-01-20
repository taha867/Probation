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
            status: import("./post.entity").PostStatus;
            image: string | null;
            imagePublicId: string | null;
            author: import("../interfaces/userInterface").BaseUserProfile;
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
                author: import("../interfaces/userInterface").BaseUserProfile;
            }[];
            meta: import("../interfaces/commonInterface").PaginationMeta;
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
            author: import("../interfaces/userInterface").BaseUserProfile;
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
            meta: import("../interfaces/commonInterface").PaginationMeta;
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
            author: import("../interfaces/userInterface").BaseUserProfile;
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