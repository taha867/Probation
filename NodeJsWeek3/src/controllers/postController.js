import { Op } from "sequelize";
import model from "../models/index.js";
import { httpStatus, errorMessages } from "../utils/constants.js";

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
    res.status(httpStatus.notFound).send({ message: errorMessages.postNotFound });
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
  const { title, body, status } = req.body; // Already validated by Joi
  const { id: userId } = req.user; // Get userId from authenticated user

  try {
    const post = await Post.create({ title, body, userId, status });
    return res.status(httpStatus.created).send(post);
  } catch (error) {
    console.error(error);
    return res
      .status(httpStatus.internalServerError)
      .send({ message: errorMessages.unableToCreatePost });
  }
}

/**
 * Gets paginated list of posts with optional search and filtering.
 * @param {Object} req.query - The query parameters for pagination and filtering.
 * @param {number} [req.query.page=1] - The page number to retrieve.
 * @param {number} [req.query.limit=10] - The number of posts per page (max 100).
 * @param {string} [req.query.search] - Search query to filter posts by title or body.
 * @param {number} [req.query.userId] - Filter posts by specific user ID.
 * @returns {Object} Paginated list of posts with metadata.
 * @throws {500} If there's an error during the retrieval process.
 */
export async function list(req, res) {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;

  const offset = (page - 1) * limit;
  const { search, userId } = req.query; // Already validated by Joi

  const where = {};
  if (userId) {
    where.userId = userId;
  }
  if (search) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${search}%` } }, //contains the search text anywhere
      { body: { [Op.iLike]: `%${search}%` } },
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

    return res.status(httpStatus.ok).send({
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
      .status(httpStatus.internalServerError)
      .send({ message: errorMessages.unableToFetchPosts });
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
    const {id} = req.params;
    const post = await findPostOr404(id, res);
    if (!post) return;

    return res.status(httpStatus.ok).send(post);
  } catch (error) {
    console.error(error);
    return res
      .status(httpStatus.internalServerError)
      .send({ message: errorMessages.unableToFetchPost });
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
  const {postId} = req.params;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const offset = (page - 1) * limit;

  try {
    const postExists = await Post.findByPk(postId);
    if (!postExists) {
      return res.status(httpStatus.notFound).send({ message: errorMessages.postNotFound });
    }

    const { rows, count } = await Comment.findAndCountAll({
      where: { postId, parentId: null }, // Only top-level comments
      include: [includeAuthor, includeReplies],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    return res.status(httpStatus.ok).send({
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
      .status(httpStatus.internalServerError)
      .send({ message: errorMessages.unableToFetchPostComments });
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
    const {id: postId} = req.params;
    const {id: userId} = req.user;
    const post = await findPostOr404(postId, res);
    if (!post) return;

    // Check if the authenticated user owns this post
    if (post.userId !== userId) {
      return res
        .status(httpStatus.forbidden)
        .send({ message: errorMessages.cannotUpdateOtherPost });
    }

    const { title, body, status } = req.body;
    await post.update({ title, body, status });

    return res.status(httpStatus.ok).send(post);
  } catch (error) {
    console.error(error);
    return res
      .status(httpStatus.internalServerError)
      .send({ message: errorMessages.unableToUpdatePost });
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
    const {id: userId} = req.user;
    const post = await findPostOr404(req.params.id, res);
    if (!post) return;

    // Check if the authenticated user owns this post
    if (post.userId !== userId) {
      return res
        .status(httpStatus.forbidden)
        .send({ message: errorMessages.cannotDeleteOtherPost });
    }

    await post.destroy();
    return res.status(httpStatus.noContent).send();
  } catch (error) {
    console.error(error);
    return res
      .status(httpStatus.internalServerError)
      .send({ message: errorMessages.unableToDeletePost });
  }
}
