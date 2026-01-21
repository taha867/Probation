import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  HttpStatus,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Brackets } from "typeorm";
import { Post, PostStatus } from "./post.entity";
import { Comment } from "../comments/comment.entity";
import { User } from "../users/user.entity";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { PaginationService } from "../pagination/pagination.service";
import { AppException } from "../common/exceptions/app.exception";
import { SUCCESS_MESSAGES, DEFAULTS, ERROR_MESSAGES } from "../lib/constants";
import { CreatePostDto } from "./dto/create-post-input.dto";
import { UpdatePostDto } from "./dto/update-post-input.dto";
import { ListPostsQueryDto } from "./dto/list-posts-query-payload.dto";
import { PaginationQueryDto } from "./dto/pagination-query-input.dto";

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private cloudinaryService: CloudinaryService,
    private paginationService: PaginationService,
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
        "POST_CREATION_FAILED",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      data: postWithAuthor,
      message: SUCCESS_MESSAGES.POST_CREATED,
    };
  }

  async listPosts(query: ListPostsQueryDto) {
    const { page, limit, search, userId, status } = query;

    // Validate userId exists if provided
    if (userId) {
      const userExists = await this.userRepository.exists({
        where: { id: userId },
      });
      if (!userExists) {
        throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
      }
    }

    const qb = this.postRepository
      .createQueryBuilder("post")
      .leftJoinAndSelect("post.author", "author")
      .select([
        "post.id",
        "post.title",
        "post.body",
        "post.userId",
        "post.status",
        "post.image",
        "post.imagePublicId",
        "post.createdAt",
        "post.updatedAt",
        "author.id",
        "author.name",
        "author.email",
        "author.image",
      ]);

    if (userId) {
      qb.andWhere("post.userId = :userId", { userId });
    }

    if (status) {
      qb.andWhere("post.status = :status", { status });
    }

    if (search) {
      qb.andWhere(
        new Brackets((qb) => {
          qb.where("post.title ILIKE :search", {
            search: `%${search}%`,
          }).orWhere("post.body ILIKE :search", { search: `%${search}%` });
        }),
      );
    }

    qb.orderBy("post.createdAt", "DESC");

    const paginatedResult = await this.paginationService.paginateQueryBuilder(
      qb,
      page,
      limit,
    );

    const postRows = paginatedResult.data.items.map((post) => {
      const {
        id,
        title,
        body,
        userId,
        status,
        image,
        imagePublicId,
        author: { id: authorId, name, email, image: authorImage },
      } = post;
      return {
        id,
        title,
        body,
        userId,
        status: status as PostStatus,
        image: image ?? null,
        imagePublicId: imagePublicId ?? null,
        author: {
          id: authorId,
          name,
          email,
          image: authorImage ?? null,
        },
      };
    });

    return {
      data: {
        items: postRows,
        meta: paginatedResult.data.meta,
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
      author: {
        id: author.id,
        name: author.name,
        email: author.email,
        image: author.image ?? null,
      },
    };
  }

  async getPostWithComments(postId: number, query: PaginationQueryDto) {
    const { page, limit } = query;

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
      throw new NotFoundException(ERROR_MESSAGES.POST_NOT_FOUND);
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
    const qb = this.commentRepository
      .createQueryBuilder("comment")
      .leftJoinAndSelect("comment.author", "author")
      .leftJoinAndSelect("comment.replies", "reply")
      .leftJoinAndSelect("reply.author", "replyAuthor")
      .where("comment.postId = :postId", { postId })
      .andWhere("comment.parentId IS NULL")
      .orderBy("comment.createdAt", "DESC")
      .addOrderBy("reply.createdAt", "ASC");

    const paginatedResult = await this.paginationService.paginateQueryBuilder(
      qb,
      page,
      limit,
    );

    return {
      data: {
        post: basePost,
        comments: paginatedResult.data.items,
        meta: paginatedResult.data.meta,
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
      throw new NotFoundException(ERROR_MESSAGES.POST_NOT_FOUND);
    }

    if (post.userId !== userId) {
      throw new ForbiddenException(ERROR_MESSAGES.CANNOT_UPDATE_OTHER_POST);
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
    } else if (image === null || image === "") {
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
        "POST_UPDATE_FAILED",
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
      throw new NotFoundException(ERROR_MESSAGES.POST_NOT_FOUND);
    }

    if (post.userId !== userId) {
      throw new ForbiddenException(ERROR_MESSAGES.CANNOT_DELETE_OTHER_POST);
    }

    // Delete associated image from Cloudinary
    if (post.imagePublicId) {
      await this.cloudinaryService.deleteImage(post.imagePublicId);
    }

    // Delete post (cascade will delete comments)
    await this.postRepository.delete(postId);
  }
}
