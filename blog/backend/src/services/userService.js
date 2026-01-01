import { Op } from "sequelize";
import models from "../models/index.js";
import { HTTP_STATUS } from "../utils/constants.js";
import { AppError } from "../utils/errors.js";
import {
  buildPaginationMeta,
  getPaginationParams,
} from "../utils/pagination.js";
import { deleteImageFromCloudinary, uploadImageToCloudinary } from "./cloudinaryService.js";

const { NOT_FOUND, FORBIDDEN, UNPROCESSABLE_ENTITY } = HTTP_STATUS;

export class UserService {
  constructor(models) {
    this.User = models.User;
    this.Post = models.Post;
    this.Comment = models.Comment;
  }

  async listUsers({ page, limit }) {
    const { offset } = getPaginationParams({ page, limit });

    const { rows, count } = await this.User.findAndCountAll({
      attributes: ["id", "name", "email", "phone", "status", "image"],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    return { rows, count, page, limit };
  }

  async findUserById(id) {
    return this.User.findByPk(id, {
      attributes: ["id", "name", "email", "image"],
    });
  }

  async getUserPostsWithComments({ userId, page, limit, search }) {
    const { offset } = getPaginationParams({ page, limit });

    const user = await this.findUserById(userId);
    if (!user) {
      return { user: null, posts: [], meta: null };
    }

    const where = { userId };
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
        {
          model: this.Comment,
          as: "comments",
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

  async updateUserForSelf({ requestedUserId, authUserId, data, fileBuffer, fileName }) {
    if (requestedUserId !== authUserId) {
      throw new AppError("CANNOT_UPDATE_OTHER_USER", FORBIDDEN);
    }

    const user = await this.User.findByPk(requestedUserId);
    if (!user) {
      throw new AppError("USER_NOT_FOUND", NOT_FOUND);
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
        throw new AppError("EMAIL_ALREADY_EXISTS", UNPROCESSABLE_ENTITY);
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
        throw new AppError("PHONE_ALREADY_EXISTS", UNPROCESSABLE_ENTITY);
      }
      updateData.phone = phone;
    }
    if (password !== undefined) updateData.password = password;
    
    // Handle image-related business logic (all Cloudinary operations)
    if (fileBuffer) {
      // New image uploaded: delete old image from Cloudinary, upload new one
      if (user.imagePublicId) {
        await deleteImageFromCloudinary(user.imagePublicId);
      }
      
      const uploadResult = await uploadImageToCloudinary(
        fileBuffer,
        "blog/users",
        fileName || "profile-image"
      );
      updateData.image = uploadResult.secure_url;
      updateData.imagePublicId = uploadResult.public_id;
    } else if (data.image === null || data.image === "") {
      // Image explicitly removed: delete from Cloudinary and set to null in database
      if (user.imagePublicId) {
        await deleteImageFromCloudinary(user.imagePublicId);
      }
      updateData.image = null;
      updateData.imagePublicId = null;
    }
    // If image field not provided, keep existing image (don't touch it)

    await user.update(updateData);

    const {
      id,
      name: userName,
      email: userEmail,
      phone: userPhone,
      status,
      image: userImage,
    } = user;
    return {
      ok: true,
      user: {
        id,
        name: userName,
        email: userEmail,
        phone: userPhone,
        image: userImage,
        status,
      },
    };
  }

  async deleteUserForSelf({ requestedUserId, authUserId }) {
    if (requestedUserId !== authUserId) {
      throw new AppError("CANNOT_DELETE_OTHER_USER", FORBIDDEN);
    }

    const user = await this.User.findByPk(requestedUserId);
    if (!user) {
      throw new AppError("USER_NOT_FOUND", NOT_FOUND);
    }

    // Delete associated image from Cloudinary before deleting user
    if (user.imagePublicId) {
      await deleteImageFromCloudinary(user.imagePublicId);
    }

    await user.destroy();
    return { ok: true };
  }
}

export const userService = new UserService(models);
