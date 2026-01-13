import { Repository, DataSource } from "typeorm";
import { Comment } from "../entities/Comment.js";
import type {
  CommentWithRelations,
} from "../interfaces/commentInterface.js";
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
 * Maps post data to post object
 * Helper function to avoid duplication and ensure consistency
 */
const mapPostData = (postData: any): { id: number; title: string } => {
  if (!postData) {
    throw new Error("Post data missing - TypeORM relation may be misconfigured");
  }
  const { id, title } = postData;
  return {
    id,
    title,
  };
};

/**
 * Comment Repository
 * Handles all data access operations for Comment entity
 */
export class CommentRepository {
  private repo: Repository<Comment>;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(Comment);
  }

  // ============ Basic CRUD Operations ============

  /**
   * Find comment by ID
   */
  async findById(id: number): Promise<Comment | null> {
    return this.repo.findOne({ where: { id } });
  }

  /**
   * Find comment by ID with specific fields
   */
  async findByIdWithFields(
    id: number,
    fields: (keyof Comment)[]
  ): Promise<Comment | null> {
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
   * Save comment (create or update)
   */
  async save(comment: Comment): Promise<Comment> {
    return this.repo.save(comment);
  }

  /**
   * Create new comment
   * Timestamps are automatically handled by BaseEntity listeners (@BeforeInsert/@BeforeUpdate)
   */
  async create(commentData: Partial<Comment>): Promise<Comment> {
    const comment = this.repo.create(commentData);
    return this.repo.save(comment);
  }

  /**
   * Update comment using direct SQL UPDATE
   * ⚠️ Does NOT trigger lifecycle hooks (@BeforeUpdate, @AfterUpdate)
   * ⚠️ Does NOT automatically update @UpdateDateColumn
   * 
   * Use for: Bulk updates, performance-critical operations
   * For single entity updates with hooks, use updateEntity() instead
   */
  async update(id: number, updateData: Partial<Comment>): Promise<void> {
    // Manually set updatedAt since repository.update() bypasses entity hooks
    const dataWithTimestamp = {
      ...updateData,
      updatedAt: new Date(),
    };
    await this.repo.update(id, dataWithTimestamp);
  }

  /**
   * Update comment entity using save() method
   * ✅ Triggers lifecycle hooks (@BeforeUpdate, @AfterUpdate)
   * ✅ Automatically updates @UpdateDateColumn
   * 
   * Industry best practice: Use this for single entity updates
   * when you need hooks and automatic timestamp management
   */
  async updateEntity(comment: Comment, updateData: Partial<Comment>): Promise<Comment> {
    Object.assign(comment, updateData);
    return this.repo.save(comment);
  }

  /**
   * Delete comment
   */
  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }

  /**
   * Delete comment using QueryBuilder
   */
  async deleteWithQueryBuilder(id: number): Promise<void> {
    await this.repo
      .createQueryBuilder()
      .delete()
      .from(Comment)
      .where("id = :id", { id })
      .execute();
  }

  // ============ Query Operations ============

  /**
   * Find comment with all relations (author, post, replies)
   */
  async findWithRelations(id: number): Promise<CommentWithRelations | null> {
    const comment = await this.repo.findOne({
      where: { id },
      relations: { author: true, post: true },
      select: {
        id: true,
        body: true,
        postId: true,
        userId: true,
        parentId: true,
        createdAt: true,
        updatedAt: true,
        author: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
        post: {
          id: true,
          title: true,
        },
      },
    });

    if (!comment) return null;

    return {
      id: comment.id,
      body: comment.body,
      postId: comment.postId,
      userId: comment.userId,
      parentId: comment.parentId ?? null,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      author: mapAuthorData(comment.author),
      post: mapPostData(comment.post),
    };
  }

  /**
   * Find top-level comments for a post with pagination
   */
  async findTopLevelWithReplies(
    postId: number,
    page: number,
    limit: number
  ): Promise<[Comment[], number]> {
    const offset = (page - 1) * limit;

    return this.repo
      .createQueryBuilder("comment")
      .leftJoinAndSelect("comment.author", "author")
      .leftJoinAndSelect("comment.replies", "reply")
      .leftJoinAndSelect("reply.author", "replyAuthor")
      .where("comment.postId = :postId", { postId })
      .andWhere("comment.parentId IS NULL")
      .orderBy("comment.createdAt", "DESC")
      .addOrderBy("reply.createdAt", "ASC")
      .take(limit)
      .skip(offset)
      .getManyAndCount();
  }

  /**
   * Find comment by post ID
   */
  async findByPostId(postId: number): Promise<Comment[]> {
    return this.repo.find({
      where: { postId },
      relations: { author: true, post: true },
      order: { createdAt: "DESC" },
    });
  }

  /**
   * Find comment by parent ID (replies)
   */
  async findByParentId(parentId: number): Promise<Comment[]> {
    return this.repo.find({
      where: { parentId },
      relations: { author: true },
      select: {
        id: true,
        body: true,
        postId: true,
        userId: true,
        parentId: true,
        createdAt: true,
        updatedAt: true,
        author: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      order: { createdAt: "ASC" },
    });
  }

  /**
   * Find all top-level comments (optionally filtered by post)
   */
  async findAllTopLevel(postId?: number): Promise<Comment[]> {
    const where: any = { parentId: null };
    if (postId) {
      where.postId = postId;
    }

    return this.repo.find({
      where,
      relations: { author: true, post: true },
      select: {
        id: true,
        body: true,
        postId: true,
        userId: true,
        parentId: true,
        createdAt: true,
        updatedAt: true,
        author: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
        post: {
          id: true,
          title: true,
        },
      },
      order: { createdAt: "DESC" },
    });
  }
}

