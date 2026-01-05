import { Op } from "sequelize";
import models from "../models/index.js";
import { HTTP_STATUS } from "../utils/constants.js";
import { AppError } from "../utils/errors.js";
import { getPaginationParams, buildPaginationMeta } from "../utils/pagination.js";
import { deleteImageFromCloudinary, uploadImageToCloudinary } from "./cloudinaryService.js";

export class PostService {
  constructor(models) {
    this.Post = models.Post;
    this.Comment = models.Comment;
    this.User = models.User;
  }

  async createPost({ title, body, status, image, imagePublicId, userId }) {
    return this.Post.create({ 
      title, 
      body, 
      status, 
      image, 
      imagePublicId,
      userId 
    });
  }

  async listPosts({ page, limit, search, userId, status }) {
    const { offset } = getPaginationParams({ page, limit });

    const where = {};
    if (userId) {
      where.userId = userId;
    }
    if (status) {
      where.status = status;
    }
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { body: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { rows, count } = await this.Post.findAndCountAll({
      where,
      include: [
        {
          model: this.User,
          as: "author",
          attributes: ["id", "name", "email", "image"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    return { rows, count, page, limit };
  }

  async findPostWithAuthor(id) {
    return this.Post.findByPk(id, {
      include: [
        {
          model: this.User,
          as: "author",
          attributes: ["id", "name", "email", "image"],
        },
      ],
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
          attributes: ["id", "name", "email", "image"],
        },
        {
          model: this.Comment,
          as: "replies",
          include: [
            {
              model: this.User,
              as: "author",
              attributes: ["id", "name", "email", "image"],
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

  async updatePostForUser({ postId, userId, data, fileBuffer, fileName }) {
    const post = await this.findPostWithAuthor(postId);
    if (!post) {
      throw new AppError("POST_NOT_FOUND", HTTP_STATUS.NOT_FOUND);
    }
    if (post.userId !== userId) {
      throw new AppError("CANNOT_UPDATE_OTHER_POST", HTTP_STATUS.FORBIDDEN);
    }

    // Handle image-related business logic (all Cloudinary operations)
    if (fileBuffer) {
      // New image uploaded: delete old image from Cloudinary, upload new one
      if (post.imagePublicId) {
        await deleteImageFromCloudinary(post.imagePublicId);
      }
      
      const uploadResult = await uploadImageToCloudinary(
        fileBuffer,
        "blog/posts",
        fileName || "updated-image"
      );
      data.image = uploadResult.secure_url;
      data.imagePublicId = uploadResult.public_id;
    } else if (data.image === null || data.image === "") {
      // Image explicitly removed: delete from Cloudinary and set to null in database
      if (post.imagePublicId) {
        await deleteImageFromCloudinary(post.imagePublicId);
      }
      data.image = null;
      data.imagePublicId = null;
    }
    // If image field not provided, keep existing image (don't touch it)

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

    // Delete associated image from Cloudinary before deleting post
    if (post.imagePublicId) {
      await deleteImageFromCloudinary(post.imagePublicId);
    }

    await post.destroy();
    return { ok: true };
  }
}

export const postService = new PostService(models);

