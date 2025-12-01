import { Op } from "sequelize";
import model from "../models/index.js";

const { User, Post, Comment } = model;

export async function listUsers({ page, limit }) {
  const offset = (page - 1) * limit;

  const { rows, count } = await User.findAndCountAll({
    attributes: ["id", "name", "email", "phone", "status"],
    order: [["createdAt", "DESC"]],
    limit,
    offset,
  });

  return { rows, count, page, limit };
}

export async function findUserById(id) {
  return User.findByPk(id, {
    attributes: ["id", "name", "email"],
  });
}

export async function getUserPostsWithComments({ userId, page, limit }) {
  const offset = (page - 1) * limit;

  const user = await findUserById(userId);
  if (!user) {
    return { user: null, posts: [], meta: null };
  }

  const { rows, count } = await Post.findAndCountAll({
    where: { userId },
    include: [
      {
        model: User,
        as: "author",
        attributes: ["id", "name", "email"],
      },
      {
        model: Comment,
        as: "comments",
        include: [
          {
            model: User,
            as: "author",
            attributes: ["id", "name", "email"],
          },
          {
            model: Comment,
            as: "replies",
            include: [
              {
                model: User,
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
    meta: {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    },
  };
}

export async function updateUserForSelf({ requestedUserId, authUserId, data }) {
  if (requestedUserId !== authUserId) {
    return { ok: false, reason: "FORBIDDEN" };
  }

  const user = await User.findByPk(requestedUserId);
  if (!user) {
    return { ok: false, reason: "NOT_FOUND" };
  }

  const { name, email, phone, password } = data;
  const updateData = {};

  if (name !== undefined) updateData.name = name;
  if (email !== undefined) {
    const existingUser = await User.findOne({
      where: {
        email,
        id: { [Op.ne]: requestedUserId },
      },
    });
    if (existingUser) {
      return { ok: false, reason: "EMAIL_EXISTS" };
    }
    updateData.email = email;
  }
  if (phone !== undefined) {
    const existingUser = await User.findOne({
      where: {
        phone,
        id: { [Op.ne]: requestedUserId },
      },
    });
    if (existingUser) {
      return { ok: false, reason: "PHONE_EXISTS" };
    }
    updateData.phone = phone;
  }
  if (password !== undefined) updateData.password = password;

  await user.update(updateData);
  await user.reload();

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

export async function deleteUserForSelf({ requestedUserId, authUserId }) {
  if (requestedUserId !== authUserId) {
    return { ok: false, reason: "FORBIDDEN" };
  }

  const user = await User.findByPk(requestedUserId);
  if (!user) {
    return { ok: false, reason: "NOT_FOUND" };
  }

  await user.destroy();
  return { ok: true };
}


