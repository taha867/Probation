import { Repository, DataSource, Brackets } from "typeorm";
import { Post, PostStatus } from "../entities/Post.js";
import type { PostWithAuthor } from "../interfaces/postInterface.js";
import type { BaseUserProfile } from "../interfaces/userInterface.js";

/**
 * Maps author data to BaseUserProfile
 * Helper function to avoid duplication and ensure consistency
 */
const mapAuthorData = (authorData: any): BaseUserProfile => {
  if (!authorData) {
    throw new Error(
      "Author data missing - TypeORM relation may be misconfigured"
    );
  }
  const { id, name, email, image } = authorData;
  return {
    id,
    name,
    email,
    image: image || null,
  };
};

/**
 * Post Repository
 * Handles all data access operations for Post entity
 */
export class PostRepository {
  private repo: Repository<Post>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(Post);
  }

  // ============ Basic CRUD Operations ============

  /**
   * Find post by ID
   */
  async findById(id: number): Promise<Post | null> {
    return this.repo.findOne({ where: { id } });
  }

  /**
   * Find post by ID with specific fields
   */
  async findByIdWithFields(
    id: number,
    fields: (keyof Post)[]
  ): Promise<Post | null> {
    const selectObj: any = {};
    fields.forEach((field) => {
      selectObj[field] = true;
    });
    return this.repo.findOne({
      where: { id },
      select: selectObj,
    });
  }

  /**
   * Save post (create or update)
   */
  async save(post: Post): Promise<Post> {
    return this.repo.save(post);
  }

  /**
   * Create new post
   */
  async create(postData: Partial<Post>): Promise<Post> {
    const post = this.repo.create(postData);
    return this.repo.save(post);
  }

  /**
   * Update post
   */
  async update(id: number, updateData: Partial<Post>): Promise<void> {
    await this.repo.update(id, updateData);
  }

  /**
   * Delete post
   */
  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }

  /**
   * Delete post using QueryBuilder
   */
  async deleteWithQueryBuilder(id: number): Promise<void> {
    await this.repo
      .createQueryBuilder()
      .delete()
      .from(Post)
      .where("id = :id", { id })
      .execute();
  }

  // ============ Query Operations ============

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

    return {
      id: post.id,
      title: post.title,
      body: post.body,
      userId: post.userId,
      status: post.status as PostStatus,
      image: post.image ?? null,
      imagePublicId: post.imagePublicId ?? null,
      author: mapAuthorData(post.author),
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
   */
  async findWithComments(
    postId: number
  ): Promise<{ post: Post | null; comments: any[] }> {
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

