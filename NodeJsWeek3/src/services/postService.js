import { Op } from "sequelize";
import model from "../models/index.js";

const { Comment, Post, User } = model;

export async function createPost({ title, body, status, userId }) {
  return Post.create({ title, body, userId, status });
}

export async function listPosts({ page, limit, search, userId }) {
  const offset = (page - 1) * limit;

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

  const { rows, count } = await Post.findAndCountAll({
    where,
    include: [{ model: User, as: "author", attributes: ["id", "name", "email"] }],
    order: [["createdAt", "DESC"]],
    limit,
    offset,
  });

  return { rows, count, page, limit };
}

export async function findPostWithAuthor(id) {
  return Post.findByPk(id, {
    include: [{ model: User, as: "author", attributes: ["id", "name", "email"] }],
  });
}

export async function getPostWithComments({ postId, page, limit }) {
  const offset = (page - 1) * limit;

  const postExists = await Post.findByPk(postId);
  if (!postExists) {
    return { post: null, comments: [], meta: null };
  }

  const { rows, count } = await Comment.findAndCountAll({
    where: { postId, parentId: null },
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
    order: [["createdAt", "DESC"]],
    limit,
    offset,
  });

  return {
    post: postExists,
    comments: rows,
    meta: {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    },
  };
}

export async function updatePostForUser({ postId, userId, data }) {
  const post = await findPostWithAuthor(postId);
  if (!post) {
    return { ok: false, reason: "notFound" };
  }
  if (post.userId !== userId) {
    return { ok: false, reason: "forbidden" };
  }

  await post.update(data);
  return { ok: true, post };
}

export async function deletePostForUser({ postId, userId }) {
  const post = await findPostWithAuthor(postId);
  if (!post) {
    return { ok: false, reason: "notFound" };
  }
  if (post.userId !== userId) {
    return { ok: false, reason: "forbidden" };
  }

  await post.destroy();
  return { ok: true };
}


