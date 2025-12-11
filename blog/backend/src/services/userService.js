import { Op } from "sequelize";
import models from "../models/index.js";
import { HTTP_STATUS } from "../utils/constants.js";
import { AppError } from "../utils/errors.js";
import { buildPaginationMeta, getPaginationParams } from "../utils/pagination.js";

export class UserService {
  constructor(models) {
    this.User = models.User;
    this.Post = models.Post;
    this.Comment = models.Comment;
  }

  async listUsers({ page, limit }) {
    const { offset } = getPaginationParams({ page, limit });

    const { rows, count } = await this.User.findAndCountAll({
      attributes: ["id", "name", "email", "phone", "status"],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    return { rows, count, page, limit };
  }

  async findUserById(id) {
    return this.User.findByPk(id, {
      attributes: ["id", "name", "email"],
    });
  }

  async getUserPostsWithComments({ userId, page, limit }) {
    const { offset } = getPaginationParams({ page, limit });

    const user = await this.findUserById(userId);
    if (!user) {
      return { user: null, posts: [], meta: null };
    }

    const { rows, count } = await this.Post.findAndCountAll({
      where: { userId },
      include: [
        {
          model: this.User,
          as: "author",
          attributes: ["id", "name", "email"],
        },
        {
          model: this.Comment,
          as: "comments",
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
          separate: true,
          order: [["createdAt", "DESC"]],
          where: { parentId: null },
        },
      ],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    return {
      user,
      posts: rows,
      meta: buildPaginationMeta({ total: count, page, limit }),
    };
  }

  async updateUserForSelf({ requestedUserId, authUserId, data }) {
    if (requestedUserId !== authUserId) {
      throw new AppError("CANNOT_UPDATE_OTHER_USER", HTTP_STATUS.FORBIDDEN);
    }

    const user = await this.User.findByPk(requestedUserId);
    if (!user) {
      throw new AppError("USER_NOT_FOUND", HTTP_STATUS.NOT_FOUND);
    }

    const { name, email, phone, password } = data;
    const updateData = {};

    if (name !== undefined) updateData.name = name;
    if (email !== undefined) {
      const existingUser = await this.User.findOne({
        where: {
          email,
          id: { [Op.ne]: requestedUserId },
        },
      });
      if (existingUser) {
        throw new AppError("EMAIL_ALREADY_EXISTS", HTTP_STATUS.UNPROCESSABLE_ENTITY);
      }
      updateData.email = email;
    }
    if (phone !== undefined) {
      const existingUser = await this.User.findOne({
        where: {
          phone,
          id: { [Op.ne]: requestedUserId },
        },
      });
      if (existingUser) {
        throw new AppError("PHONE_ALREADY_EXISTS", HTTP_STATUS.UNPROCESSABLE_ENTITY);
      }
      updateData.phone = phone;
    }
    if (password !== undefined) updateData.password = password;

    await user.update(updateData);

    const { id, name: userName, email: userEmail, phone: userPhone, status } = user;
    return {
      ok: true,
      user: {
        id,
        name: userName,
        email: userEmail,
        phone: userPhone,
        status,
      },
    };
  }

  async deleteUserForSelf({ requestedUserId, authUserId }) {
    if (requestedUserId !== authUserId) {
      throw new AppError("CANNOT_DELETE_OTHER_USER", HTTP_STATUS.FORBIDDEN);
    }

    const user = await this.User.findByPk(requestedUserId);
    if (!user) {
      throw new AppError("USER_NOT_FOUND", HTTP_STATUS.NOT_FOUND);
    }

    await user.destroy();
    return { ok: true };
  }
}

export const userService = new UserService(models);

