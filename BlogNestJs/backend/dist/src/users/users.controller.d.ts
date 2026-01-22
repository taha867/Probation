import { UsersService } from './users.service';
import { ListUsersQueryDto } from './dto/list-users-query-payload.dto';
import { GetUserPostsQueryDto } from './dto/user-posts-query-input.dto';
import { UpdateUserDto } from './dto/update-user-input.dto';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    list(query: ListUsersQueryDto): Promise<{
        data: {
            users: import("./user-entity/user.entity").User[];
            paginationOptions: import("../pagination/dto/pagination-meta.dto").PaginationMetaDto;
        };
    }>;
    getCurrentUser(userId: number): Promise<{
        data: {
            user: {
                id: number;
                name: string;
                email: string;
                image: string | null;
            };
        };
    }>;
    getUserPosts(id: number, query: GetUserPostsQueryDto): Promise<{
        data: {
            id: number;
            name: string;
            email: string;
            image: string | null;
            posts: import("../posts/post-entity/post.entity").Post[];
            paginationOptions: import("../pagination/dto/pagination-meta.dto").PaginationMetaDto;
        };
    }>;
    update(id: number, updateUserDto: UpdateUserDto, userId: number, file?: Express.Multer.File): Promise<{
        data: {
            message: "User updated successfully";
            user: {
                id: number;
                name: string;
                email: string;
                phone: string | null;
                status: string | null;
                image: string | null;
            };
        };
    }>;
    delete(id: number, userId: number): Promise<{
        data: {
            message: "User account deleted successfully";
        };
    }>;
}
//# sourceMappingURL=users.controller.d.ts.map