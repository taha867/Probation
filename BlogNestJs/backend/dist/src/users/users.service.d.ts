import { Repository } from "typeorm";
import { User } from "./user-entity/user.entity";
import { Post } from "../posts/post-entity/post.entity";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { PaginationService } from "../pagination/pagination.service";
import { ListUsersQueryDto } from "./dto/list-users-query-payload.dto";
import { GetUserPostsQueryDto } from "./dto/user-posts-query-input.dto";
import { UpdateUserDto } from "./dto/update-user-input.dto";
export declare class UsersService {
    private userRepository;
    private postRepository;
    private cloudinaryService;
    private paginationService;
    constructor(userRepository: Repository<User>, postRepository: Repository<Post>, cloudinaryService: CloudinaryService, paginationService: PaginationService);
    listUsers(query: ListUsersQueryDto): Promise<{
        data: {
            users: User[];
            paginationOptions: import("../pagination/dto/pagination-meta.dto").PaginationMetaDto;
        };
    }>;
    findUserById(id: number): Promise<{
        data: {
            user: {
                id: number;
                name: string;
                email: string;
                image: string | null;
            };
        };
    }>;
    getUserPostsWithComments(userId: number, query: GetUserPostsQueryDto): Promise<{
        data: {
            id: number;
            name: string;
            email: string;
            image: string | null;
            posts: Post[];
            paginationOptions: import("../pagination/dto/pagination-meta.dto").PaginationMetaDto;
        };
    }>;
    updateUser(requestedUserId: number, authUserId: number, updateUserDto: UpdateUserDto, file?: Express.Multer.File): Promise<{
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
    deleteUser(requestedUserId: number, authUserId: number): Promise<void>;
}
//# sourceMappingURL=users.service.d.ts.map