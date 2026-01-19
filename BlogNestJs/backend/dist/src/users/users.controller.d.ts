import { UsersService } from './users.service';
import { ListUsersQueryDto } from './dto/listUsersQuery.dto';
import { GetUserPostsQueryDto } from './dto/getUserPostsQuery.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    list(query: ListUsersQueryDto): Promise<{
        data: {
            users: import("../entities/User").User[];
            meta: import("../interfaces").PaginationMeta;
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
            user: {
                id: number;
                name: string;
                email: string;
                image: string | null;
            };
            posts: import("../entities/Post").Post[];
            meta: import("../interfaces").PaginationMeta;
        };
    }>;
    update(id: number, updateUserDto: UpdateUserDto, userId: number, file?: Express.Multer.File): Promise<{
        data: {
            message: string;
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