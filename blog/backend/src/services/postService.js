import { Op } from "sequelize";
import models from "../models/index.js";
import { HTTP_STATUS } from "../utils/constants.js";
import { AppError } from "../utils/errors.js";
import { getPaginationParams, buildPaginationMeta } from "../utils/pagination.js";

export class PostService {
  constructor(models) {
    this.Post = models.Post;
    this.Comment = models.Comment;
    this.User = models.User;
  }

  async createPost({ title, body, status, image, userId }) {
    return this.Post.create({ title, body, status, image, userId });
  }

  async listPosts({ page, limit, search, userId }) {
    const { offset } = getPaginationParams({ page, limit });

    const where = {};
    if (userId) {
      where.userId = userId;
    }
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { body: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { rows, count } = await this.Post.findAndCountAll({
      where,
      include: [{ model: this.User, as: "author", attributes: ["id", "name", "email"] }],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    return { rows, count, page, limit };
  }

  async findPostWithAuthor(id) {
    return this.Post.findByPk(id, {
      include: [{ model: this.User, as: "author", attributes: ["id", "name", "email"] }],
    });
  }

  async getPostWithComments({ postId, page, limit }) {
    const { offset } = getPaginationParams({ page, limit });

    const postExists = await this.Post.findByPk(postId);
    if (!postExists) {
      return { post: null, comments: [], meta: null };
    }

    const { rows, count } = await this.Comment.findAndCountAll({
      where: { postId, parentId: null },
      include: [
        {
          model: this.User,
          as: "author",
          attributes: ["id", "name", "email"],
        },
        {
          model: this.Comment,
          as: "replies",
          include: [
            {
              model: this.User,
              as: "author",
              attributes: ["id", "name", "email"],
            },
          ],
          separate: true,
          order: [["createdAt", "ASC"]],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    return {
      post: postExists,
      comments: rows,
      meta: buildPaginationMeta({ total: count, page, limit }),
    };
  }

  async updatePostForUser({ postId, userId, data }) {
    const post = await this.findPostWithAuthor(postId);
    if (!post) {
      throw new AppError("POST_NOT_FOUND", HTTP_STATUS.NOT_FOUND);
    }
    if (post.userId !== userId) {
      throw new AppError("CANNOT_UPDATE_OTHER_POST", HTTP_STATUS.FORBIDDEN);
    }

    await post.update(data);
    return { ok: true, post };
  }

  async deletePostForUser({ postId, userId }) {
    const post = await this.findPostWithAuthor(postId);
    if (!post) {
      throw new AppError("POST_NOT_FOUND", HTTP_STATUS.NOT_FOUND);
    }
    if (post.userId !== userId) {
      throw new AppError("CANNOT_DELETE_OTHER_POST", HTTP_STATUS.FORBIDDEN);
    }

    await post.destroy();
    return { ok: true };
  }
}

export const postService = new PostService(models);

