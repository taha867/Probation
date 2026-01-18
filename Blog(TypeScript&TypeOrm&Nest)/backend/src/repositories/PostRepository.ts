import { DataSource, Brackets } from "typeorm";
import { Post, PostStatus } from "../entities/Post.js";
import type { PostWithAuthor } from "../interfaces/postInterface.js";
import { BaseRepository } from "./BaseRepository.js";
import { mapAuthorData } from "../utils/mappers.js";

/**
 * Post Repository
 * Handles all data access operations for Post entity
 * Extends BaseRepository for common CRUD operations
 */
export class PostRepository extends BaseRepository<Post> {
  constructor(dataSource: DataSource) {
    super(dataSource, Post);
  }


  /**
   * Find post with author information
   */
  async findWithAuthor(id: number): Promise<PostWithAuthor | null> {
    const post = await this.repo.findOne({
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

    if (!post) return null;
    const{title,body,userId,status,image,imagePublicId,author}=post;
    return {
      id:post.id,
      title,
      body,
      userId,
      status: status as PostStatus,
      image: image ?? null,
      imagePublicId: imagePublicId ?? null,
      author: mapAuthorData(author),
    };
  }

  /**
   * Find posts with pagination and filters
   */
  async findPaginatedWithAuthor(params: {
    page: number;
    limit: number;
    userId?: number;
    status?: PostStatus | string;
    search?: string;
  }): Promise<[Post[], number]> {
    const { page, limit, userId, status, search } = params;
    const offset = (page - 1) * limit;

    const qb = this.repo
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
          qb.where("post.title ILIKE :search", { search: `%${search}%` })
            .orWhere("post.body ILIKE :search", { search: `%${search}%` });
        })
      );
    }

    return qb
      .orderBy("post.createdAt", "DESC")
      .take(limit)
      .skip(offset)
      .getManyAndCount();
  }

  /**
   * Find posts by user ID with nested comments
   */
  async findUserPostsWithComments(
    userId: number,
    page: number,
    limit: number,
    search?: string
  ): Promise<[Post[], number]> {
    const offset = (page - 1) * limit;

    const qb = this.repo
      .createQueryBuilder("post")
      .leftJoinAndSelect("post.author", "author")
      .leftJoinAndSelect(
        "post.comments",
        "comment",
        "comment.parentId IS NULL"
      )
      .leftJoinAndSelect("comment.author", "commentAuthor")
      .leftJoinAndSelect("comment.replies", "reply")
      .leftJoinAndSelect("reply.author", "replyAuthor")
      .where("post.userId = :userId", { userId });

    if (search) {
      qb.andWhere(
        new Brackets((qb) => {
          qb.where("post.title ILIKE :search", { search: `%${search}%` })
            .orWhere("post.body ILIKE :search", { search: `%${search}%` });
        })
      );
    }

    return qb
      .orderBy("post.createdAt", "DESC")
      .addOrderBy("comment.createdAt", "DESC")
      .addOrderBy("reply.createdAt", "ASC")
      .take(limit)
      .skip(offset)
      .getManyAndCount();
  }

  /**
   * Find post with comments (for getPostWithComments)
   * Note: Comments are fetched separately in CommentRepository
   * 
   * @param postId - Post ID to find
   * @returns Post entity and empty comments array (comments fetched separately)
   */
  async findWithComments(
    postId: number
  ): Promise<{ post: Post | null; comments: never[] }> {
    const post = await this.repo.findOne({
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
      return { post: null, comments: [] };
    }

    // Comments are fetched separately in CommentRepository
    return { post, comments: [] };
  }
}

