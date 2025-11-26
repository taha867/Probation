import { Op } from "sequelize";
import model from "../models/index.js";

const { Comment, Post, User } = model;

const includeAuthor = {
  model: User,
  as: "author",
  attributes: ["id", "name", "email"],
};

const includeReplies = {
  model: Comment,
  as: "replies",
  include: [
    {
      model: User,
      as: "author",
      attributes: ["id", "name", "email"],
    },
  ],
  separate: true, //tells Sequelize to fetch replies in a separate query per parent —
  // this ensures replies arrays are ordered reliably and avoids giant JOIN result processing.
  order: [["createdAt", "ASC"]],
};

const findPostOr404 = async (id, res) => {
  const post = await Post.findByPk(id, {
    include: [
      { model: User, as: "author", attributes: ["id", "name", "email"] },
    ],
  });

  if (!post) {
    res.status(404).send({ message: "Post not found" });
    return null;
  }

  return post;
};

/**
 * Creates a new post.
 * @param {Object} req.body - The request body containing post data.
 * @param {string} req.body.title - The title of the post.
 * @param {string} req.body.body - The content of the post.
 * @param {string} [req.body.status] - The status of the post (draft or published).
 * @param {Object} req.user - The authenticated user from JWT token.
 * @returns {Object} The created post with 201 status code.
 * @throws {400} If title or body are missing.
 * @throws {500} If there's an error during the creation process.
 */
export async function create(req, res) {
  const { title, body, status } = req.body;
  const { id: userId } = req.user; // Get userId from authenticated user

  if (!title || !body) {
    return res
      .status(400)
      .send({ message: "title and body are required fields" });
  }

  try {
    const post = await Post.create({ title, body, userId, status });
    return res.status(201).send(post);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ message: "Unable to create post at this time" });
  }
}

/**
 * Gets paginated list of posts with optional search and filtering.
 * @param {Object} req.query - The query parameters for pagination and filtering.
 * @param {number} [req.query.page=1] - The page number to retrieve.
 * @param {number} [req.query.limit=10] - The number of posts per page (max 100).
 * @param {string} [req.query.q] - Search query to filter posts by title or body.
 * @param {number} [req.query.userId] - Filter posts by specific user ID.
 * @returns {Object} Paginated list of posts with metadata.
 * @throws {500} If there's an error during the retrieval process.
 */
export async function list(req, res) {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit, 10) || 10, 100);
  const offset = (page - 1) * limit;
  const { q, userId } = req.query;

  const where = {};
  if (userId) {
    where.userId = userId;
  }
  if (q) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${q}%` } }, //contains the search text anywhere
      { body: { [Op.iLike]: `%${q}%` } },
    ];
  }

  try {
    const { rows, count } = await Post.findAndCountAll({
      where, //applies the filters that we built above
      include: [
        { model: User, as: "author", attributes: ["id", "name", "email"] },
      ],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    return res.status(200).send({
      data: rows,
      meta: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ message: "Unable to fetch posts at this time" });
  }
}

/**
 * Gets a specific post by ID.
 * @param {string} req.params.id - The ID of the post to retrieve.
 * @returns {Object} The post with author information.
 * @throws {404} If the post is not found.
 * @throws {500} If there's an error during the retrieval process.
 */
export async function get(req, res) {
  try {
    const post = await findPostOr404(req.params.id, res);
    if (!post) return;

    return res.status(200).send(post);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ message: "Unable to fetch the requested post" });
  }
}

/**
 * Gets all comments for a specific post with nested replies.
 * @param {string} req.params.postId - The ID of the post to get comments for.
 * @param {Object} req.query - The query parameters for pagination.
 * @param {number} [req.query.page=1] - The page number to retrieve.
 * @param {number} [req.query.limit=10] - The number of comments per page (max 100).
 * @returns {Object} Post information and paginated comments with nested replies.
 * @throws {400} If the post ID is invalid.
 * @throws {404} If the post is not found.
 * @throws {500} If there's an error during the retrieval process.
 */
export async function listForPost(req, res) {
  const postId = Number(req.params.postId);
  if (Number.isNaN(postId)) {
    return res.status(400).send({ message: "Invalid post id" });
  }

  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit, 10) || 10, 100);
  const offset = (page - 1) * limit;

  try {
    const postExists = await Post.findByPk(postId);
    if (!postExists) {
      return res.status(404).send({ message: "Post not found" });
    }

    const { rows, count } = await Comment.findAndCountAll({
      where: { postId, parentId: null }, // Only top-level comments
      include: [includeAuthor, includeReplies],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    return res.status(200).send({
      post: postExists,
      comments: rows,
      meta: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ message: "Unable to fetch comments for this post" });
  }
}

/**
 * Updates a post's content and status.
 * @param {string} req.params.id - The ID of the post to update.
 * @param {Object} req.body - The request body containing updated post data.
 * @param {string} [req.body.title] - The new title of the post.
 * @param {string} [req.body.body] - The new content of the post.
 * @param {string} [req.body.status] - The new status of the post.
 * @param {Object} req.user - The authenticated user from JWT token.
 * @returns {Object} The updated post with 200 status code.
 * @throws {403} If the user is not the owner of the post.
 * @throws {404} If the post is not found.
 * @throws {500} If there's an error during the update process.
 */
export async function update(req, res) {
  try {
    const post = await findPostOr404(req.params.id, res);
    if (!post) return;

    // Check if the authenticated user owns this post
    if (post.userId !== req.user.id) {
      return res
        .status(403)
        .send({ message: "You can only update your own posts" });
    }

    const { title, body, status } = req.body;
    await post.update({ title, body, status });

    return res.status(200).send(post);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ message: "Unable to update the requested post" });
  }
}

/**
 * Deletes a post by ID.
 * @param {string} req.params.id - The ID of the post to delete.
 * @param {Object} req.user - The authenticated user from JWT token.
 * @returns {void} 204 No Content status code on success.
 * @throws {403} If the user is not the owner of the post.
 * @throws {404} If the post is not found.
 * @throws {500} If there's an error during the deletion process.
 */
export async function remove(req, res) {
  try {
    const post = await findPostOr404(req.params.id, res);
    if (!post) return;

    // Check if the authenticated user owns this post
    if (post.userId !== req.user.id) {
      return res
        .status(403)
        .send({ message: "You can only delete your own posts" });
    }

    await post.destroy();
    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ message: "Unable to delete the requested post" });
  }
}
