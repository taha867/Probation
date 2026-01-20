import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Post } from '../posts/post.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ListUsersQueryDto } from './dto/listUsersQuery.dto';
import { GetUserPostsQueryDto } from './dto/getUserPostsQuery.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
export declare class UsersService {
    private userRepository;
    private postRepository;
    private cloudinaryService;
    constructor(userRepository: Repository<User>, postRepository: Repository<Post>, cloudinaryService: CloudinaryService);
    listUsers(query: ListUsersQueryDto): Promise<{
        data: {
            users: User[];
            meta: import("../lib/utils/pagination").PaginationMeta;
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
            user: {
                id: number;
                name: string;
                email: string;
                image: string | null;
            };
            posts: Post[];
            meta: import("../lib/utils/pagination").PaginationMeta;
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