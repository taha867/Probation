import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { Post, PostStatus } from './post.entity';
import { Comment } from '../comments/comment.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { buildPaginationMeta } from '../lib/utils/pagination';
import { mapAuthorData } from '../lib/utils/mappers';
import { AppException } from '../common/exceptions/app.exception';
import { SUCCESS_MESSAGES, DEFAULTS } from '../lib/constants';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { ListPostsQueryDto } from './dto/listPostsQuery.dto';
import { PaginationQueryDto } from './dto/paginationQuery.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async createPost(
    createPostDto: CreatePostDto,
    userId: number,
    file?: Express.Multer.File,
  ) {
    const { title, body, status = PostStatus.DRAFT } = createPostDto;

    let imageUrl: string | null = null;
    let imagePublicId: string | null = null;

    // Upload image if provided
    if (file) {
      const uploadResult = await this.cloudinaryService.uploadImage(
        file.buffer,
        DEFAULTS.CLOUDINARY_POSTS_FOLDER,
        file.originalname || DEFAULTS.CLOUDINARY_POST_IMAGE_NAME,
      );
      imageUrl = uploadResult.secure_url;
      imagePublicId = uploadResult.public_id;
    }

    const post = this.postRepository.create({
      title,
      body,
      status,
      userId,
      image: imageUrl,
      imagePublicId,
    });

    await this.postRepository.save(post);

    // Fetch post with author
    const postWithAuthor = await this.findPostWithAuthor(post.id);
    if (!postWithAuthor) {
      throw new AppException(
        'POST_CREATION_FAILED',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      data: postWithAuthor,
      message: SUCCESS_MESSAGES.POST_CREATED,
    };
  }

  async listPosts(query: ListPostsQueryDto) {
    const { page = 1, limit = 10, search, userId, status } = query;
    const offset = (page - 1) * limit;

    const qb = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .select([
        'post.id',
        'post.title',
        'post.body',
        'post.userId',
        'post.status',
        'post.image',
        'post.imagePublicId',
        'post.createdAt',
        'post.updatedAt',
        'author.id',
        'author.name',
        'author.email',
        'author.image',
      ]);

    if (userId) {
      qb.andWhere('post.userId = :userId', { userId });
    }

    if (status) {
      qb.andWhere('post.status = :status', { status });
    }

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
      .take(limit)
      .skip(offset)
      .getManyAndCount();

    const postRows = posts.map((post) => {
      const { id, title, body, userId, status, image, imagePublicId, author } =
        post;
      return {
        id,
        title,
        body,
        userId,
        status: status as PostStatus,
        image: image ?? null,
        imagePublicId: imagePublicId ?? null,
        author: mapAuthorData(author),
      };
    });

    return {
      data: {
        items: postRows,
        meta: buildPaginationMeta({ total, page, limit }),
      },
    };
  }

  async findPostWithAuthor(id: number) {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: { author: true },
      select: {
        id: true,
        title: true,
        body: true,
        userId: true,
        status: true,
        image: true,
        imagePublicId: true,
        author: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    });

    if (!post) {
      return null;
    }

    const {
      id: postId,
      title,
      body,
      userId,
      status,
      image,
      imagePublicId,
      author,
    } = post;
    return {
      id: postId,
      title,
      body,
      userId,
      status: status as PostStatus,
      image: image ?? null,
      imagePublicId: imagePublicId ?? null,
      author: mapAuthorData(author),
    };
  }

  async getPostWithComments(postId: number, query: PaginationQueryDto) {
    const { page = 1, limit = 10 } = query;
    const offset = (page - 1) * limit;

    const post = await this.postRepository.findOne({
      where: { id: postId },
      select: {
        id: true,
        title: true,
        body: true,
        userId: true,
        status: true,
        image: true,
        imagePublicId: true,
      },
    });

    if (!post) {
      throw new NotFoundException('POST_NOT_FOUND');
    }

    const { id, title, body, userId, status, image, imagePublicId } = post;
    const basePost = {
      id,
      title,
      body,
      userId,
      status: status as PostStatus,
      image: image ?? null,
      imagePublicId: imagePublicId ?? null,
    };

    // Get top-level comments with replies
    const [comments, total] = await this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.author', 'author')
      .leftJoinAndSelect('comment.replies', 'reply')
      .leftJoinAndSelect('reply.author', 'replyAuthor')
      .where('comment.postId = :postId', { postId })
      .andWhere('comment.parentId IS NULL')
      .orderBy('comment.createdAt', 'DESC')
      .addOrderBy('reply.createdAt', 'ASC')
      .take(limit)
      .skip(offset)
      .getManyAndCount();

    return {
      data: {
        post: basePost,
        comments,
        meta: buildPaginationMeta({ total, page, limit }),
      },
    };
  }

  async updatePost(
    postId: number,
    userId: number,
    updatePostDto: UpdatePostDto,
    file?: Express.Multer.File,
  ) {
    const post = await this.postRepository.findOne({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('POST_NOT_FOUND');
    }

    if (post.userId !== userId) {
      throw new ForbiddenException('CANNOT_UPDATE_OTHER_POST');
    }

    const { title, body, status, image } = updatePostDto;
    const updateData: Partial<Post> = {};

    if (title !== undefined) updateData.title = title;
    if (body !== undefined) updateData.body = body;
    if (status !== undefined) updateData.status = status;

    // Handle image upload/removal
    if (file) {
      // New image uploaded: delete old image, upload new one
      if (post.imagePublicId) {
        await this.cloudinaryService.deleteImage(post.imagePublicId);
      }

      const uploadResult = await this.cloudinaryService.uploadImage(
        file.buffer,
        DEFAULTS.CLOUDINARY_POSTS_FOLDER,
        file.originalname || DEFAULTS.CLOUDINARY_POST_IMAGE_NAME,
      );
      updateData.image = uploadResult.secure_url;
      updateData.imagePublicId = uploadResult.public_id;
    } else if (image === null || image === '') {
      // Image explicitly removed
      if (post.imagePublicId) {
        await this.cloudinaryService.deleteImage(post.imagePublicId);
      }
      updateData.image = null;
      updateData.imagePublicId = null;
    }

    // Update post
    Object.assign(post, updateData);
    await this.postRepository.save(post);

    // Fetch updated post with author
    const postWithAuthor = await this.findPostWithAuthor(post.id);
    if (!postWithAuthor) {
      throw new AppException(
        'POST_UPDATE_FAILED',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      data: postWithAuthor,
      message: SUCCESS_MESSAGES.POST_UPDATED,
    };
  }

  async deletePost(postId: number, userId: number) {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      select: {
        id: true,
        userId: true,
        imagePublicId: true,
      },
    });

    if (!post) {
      throw new NotFoundException('POST_NOT_FOUND');
    }

    if (post.userId !== userId) {
      throw new ForbiddenException('CANNOT_DELETE_OTHER_POST');
    }

    // Delete associated image from Cloudinary
    if (post.imagePublicId) {
      await this.cloudinaryService.deleteImage(post.imagePublicId);
    }

    // Delete post (cascade will delete comments)
    await this.postRepository.delete(postId);
  }
}
