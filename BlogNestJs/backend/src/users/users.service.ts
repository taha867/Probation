import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets, Not } from 'typeorm';
import { User } from './user.entity';
import { Post } from '../posts/post.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { buildPaginationMeta } from '../lib/utils/pagination';
// Password hashing is handled automatically by UserSubscriber
import { AppException } from '../common/exceptions/app.exception';
import { SUCCESS_MESSAGES, DEFAULTS } from '../lib/constants';
import { ListUsersQueryDto } from './dto/listUsersQuery.dto';
import { GetUserPostsQueryDto } from './dto/getUserPostsQuery.dto';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async listUsers(query: ListUsersQueryDto) {
    const { page = 1, limit = 20 } = query;
    const offset = (page - 1) * limit;

    const [users, total] = await this.userRepository.findAndCount({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        status: true,
        image: true,
      },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset,
    });

    return {
      data: {
        users,
        meta: buildPaginationMeta({ total, page, limit }),
      },
    };
  }

  async findUserById(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });

    if (!user) {
      throw new NotFoundException('USER_NOT_FOUND');
    }

    return {
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        },
      },
    };
  }

  async getUserPostsWithComments(userId: number, query: GetUserPostsQueryDto) {
    const { page = 1, limit = 20, search } = query;
    const offset = (page - 1) * limit;

    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });

    if (!user) {
      throw new NotFoundException('USER_NOT_FOUND');
    }

    const qb = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.comments', 'comment', 'comment.parentId IS NULL')
      .leftJoinAndSelect('comment.author', 'commentAuthor')
      .leftJoinAndSelect('comment.replies', 'reply')
      .leftJoinAndSelect('reply.author', 'replyAuthor')
      .where('post.userId = :userId', { userId });

    if (search) {
      qb.andWhere(
        new Brackets((qb) => {
          qb.where('post.title ILIKE :search', {
            search: `%${search}%`,
          }).orWhere('post.body ILIKE :search', { search: `%${search}%` });
        }),
      );
    }

    const [posts, total] = await qb
      .orderBy('post.createdAt', 'DESC')
      .addOrderBy('comment.createdAt', 'DESC')
      .addOrderBy('reply.createdAt', 'ASC')
      .take(limit)
      .skip(offset)
      .getManyAndCount();

    return {
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        },
        posts,
        meta: buildPaginationMeta({ total, page, limit }),
      },
    };
  }

  async updateUser(
    requestedUserId: number,
    authUserId: number,
    updateUserDto: UpdateUserDto,
    file?: Express.Multer.File,
  ) {
    // Authorization check
    if (requestedUserId !== authUserId) {
      throw new ForbiddenException('CANNOT_UPDATE_OTHER_USER');
    }

    const user = await this.userRepository.findOne({
      where: { id: requestedUserId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        password: true,
        image: true,
        imagePublicId: true,
      },
    });

    if (!user) {
      throw new NotFoundException('USER_NOT_FOUND');
    }

    const { name, email, phone, password, image } = updateUserDto;
    const updateData: Partial<User> = {};

    if (name !== undefined) updateData.name = name;

    if (email !== undefined) {
      const emailExists = await this.userRepository.exists({
        where: { email, id: Not(requestedUserId) },
      });
      if (emailExists) {
        throw new AppException(
          'EMAIL_ALREADY_EXISTS',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
      updateData.email = email;
    }

    if (phone !== undefined) {
      if (phone !== null) {
        const phoneExists = await this.userRepository.exists({
          where: { phone, id: Not(requestedUserId) },
        });
        if (phoneExists) {
          throw new AppException(
            'PHONE_ALREADY_EXISTS',
            HttpStatus.UNPROCESSABLE_ENTITY,
          );
        }
      }
      updateData.phone = phone;
    }

    if (password !== undefined) {
      // Password will be automatically hashed by UserSubscriber before update
      updateData.password = password;
    }

    // Handle image upload/removal
    if (file) {
      // New image uploaded: delete old image, upload new one
      if (user.imagePublicId) {
        await this.cloudinaryService.deleteImage(user.imagePublicId);
      }

      const uploadResult = await this.cloudinaryService.uploadImage(
        file.buffer,
        DEFAULTS.CLOUDINARY_USERS_FOLDER,
        file.originalname || DEFAULTS.CLOUDINARY_PROFILE_IMAGE_NAME,
      );
      updateData.image = uploadResult.secure_url;
      updateData.imagePublicId = uploadResult.public_id;
    } else if (image === null || image === '') {
      // Image explicitly removed
      if (user.imagePublicId) {
        await this.cloudinaryService.deleteImage(user.imagePublicId);
      }
      updateData.image = null;
      updateData.imagePublicId = null;
    }

    // Update user
    Object.assign(user, updateData);
    await this.userRepository.save(user);

    // Fetch updated user
    const updatedUser = await this.userRepository.findOne({
      where: { id: requestedUserId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        status: true,
        image: true,
      },
    });

    if (!updatedUser) {
      throw new AppException(
        'USER_UPDATE_FAILED',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      data: {
        message: SUCCESS_MESSAGES.USER_UPDATED,
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
          status: updatedUser.status,
          image: updatedUser.image,
        },
      },
    };
  }

  async deleteUser(requestedUserId: number, authUserId: number) {
    // Authorization check
    if (requestedUserId !== authUserId) {
      throw new ForbiddenException('CANNOT_DELETE_OTHER_USER');
    }

    const user = await this.userRepository.findOne({
      where: { id: requestedUserId },
      select: {
        id: true,
        imagePublicId: true,
      },
    });

    if (!user) {
      throw new NotFoundException('USER_NOT_FOUND');
    }

    // Delete associated image from Cloudinary
    if (user.imagePublicId) {
      await this.cloudinaryService.deleteImage(user.imagePublicId);
    }

    // Delete user (cascade will delete posts and comments)
    await this.userRepository.delete(requestedUserId);
  }
}
