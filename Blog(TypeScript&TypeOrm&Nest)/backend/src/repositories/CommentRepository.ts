import { DataSource, IsNull } from "typeorm";
import { Comment } from "../entities/Comment.js";
import type {
  CommentWithRelations,
} from "../interfaces/commentInterface.js";
import { BaseRepository } from "./BaseRepository.js";
import { mapAuthorData, mapPostData } from "../utils/mappers.js";


export class CommentRepository extends BaseRepository<Comment> {
  constructor(dataSource: DataSource) {
    super(dataSource, Comment);
  }

  /**
   * Find comment with all relations (author, post, replies)
   */
  async findWithRelations(id: number): Promise<CommentWithRelations | null> {
    const comment = await this.repo.findOne({
      where: { id },
      relations: { author: true, post: true }, // explicit eager loading
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
    const { body, userId, parentId, createdAt, updatedAt, author, post, postId}=comment;

    return {
      id: comment.id,
      body,
      postId,
      userId,
      parentId: parentId ?? null,
      createdAt,
      updatedAt,
      author: mapAuthorData(author),
      post: mapPostData(post),
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
      .where("comment.postId = :postId", { postId })// prevents sql injection
      .andWhere("comment.parentId IS NULL")
      .orderBy("comment.createdAt", "DESC")
      .addOrderBy("reply.createdAt", "ASC")
      .take(limit)
      .skip(offset)
      .getManyAndCount();
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
   * 
   * @param postId - Optional post ID to filter comments
   * @returns Array of top-level comments with author and post information
   */
  async findAllTopLevel(postId?: number): Promise<Comment[]> {
    // Type-safe where clause using conditional logic
    // Use IsNull() operator for TypeORM compatibility
    const where = postId
      ? { parentId: IsNull(), postId }
      : { parentId: IsNull() };

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

