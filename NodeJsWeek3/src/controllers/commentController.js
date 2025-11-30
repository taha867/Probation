import model from "../models/index.js";
import { httpStatus, errorMessages } from "../utils/constants.js";

const { Comment, Post, User } = model;

const includeAuthor = {
  model: User,
  as: "author",
  attributes: ["id", "name", "email"],
};

const includePost = {
  model: Post,
  as: "post",
  attributes: ["id", "title"],
};

// Recursive function to load nested replies
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
  separate: true, // Load replies in separate query for better performance
  order: [["createdAt", "ASC"]],
};

const findCommentOr404 = async (id, res) => {
  const comment = await Comment.findByPk(id, {
    include: [includeAuthor, includePost, includeReplies],
  });

  if (!comment) {
    res.status(httpStatus.notFound).send({ message: errorMessages.commentNotFound });
    return null;
  }

  return comment;
};

/**
 * Creates a new comment or reply to an existing comment.
 * @param {Object} req.body - The request body containing comment data.
 * @param {string} req.body.body - The content of the comment.
 * @param {number} [req.body.postId] - The ID of the post (required if parentId is not provided).
 * @param {number} [req.body.parentId] - The ID of the parent comment for replies (required if postId is not provided).
 * @param {Object} req.user - The authenticated user from JWT token.
 * @returns {Object} The created comment with 201 status code.
 * @throws {400} If body or both postId and parentId are missing.
 * @throws {404} If the post or parent comment is not found.
 * @throws {500} If there's an error during the creation process.
 */
export async function create(req, res) {
  const { body, postId, parentId } = req.body; // Already validated by Joi
  const userId = req.user.id;

  try {
    // If parentId is provided, validate it and get postId from parent
    let finalPostId = postId;
    if (parentId) {
      const parentComment = await Comment.findByPk(parentId);
      if (!parentComment) {
        return res.status(httpStatus.notFound).send({ message: errorMessages.parentCommentNotFound });
      }
      finalPostId = parentComment.postId;
    } else {
      // Validate post exists
      const post = await Post.findByPk(postId);
      if (!post) {
        return res.status(httpStatus.notFound).send({ message: errorMessages.postNotFound });
      }
    }

    const comment = await Comment.create({
      body,
      postId: finalPostId,
      userId,
      parentId,
    });
    const createdComment = await Comment.findByPk(comment.id, {
      include: [includeAuthor, includePost],
    });
    return res.status(httpStatus.created).send(createdComment);
  } catch (error) {
    console.error(error);
    return res
      .status(httpStatus.internalServerError)
      .send({ message: errorMessages.unableToCreateComment });
  }
}

/**
 * Gets all top-level comments, optionally filtered by post.
 * @param {Object} req.query - The query parameters for filtering.
 * @param {number} [req.query.postId] - The ID of the post to filter comments by.
 * @returns {Array} Array of comments with authors, posts, and nested replies.
 * @throws {500} If there's an error during the retrieval process.
 */
export async function list(req, res) {
  const { postId } = req.query;
  const where = postId ? { postId } : undefined;

  try {
    const comments = await Comment.findAll({
      where: { ...where, parentId: null }, // Only top-level comments
      include: [includeAuthor, includePost, includeReplies],
      order: [["createdAt", "DESC"]],
    });
    return res.status(httpStatus.ok).send(comments);
  } catch (error) {
    console.error(error);
    return res
      .status(httpStatus.internalServerError)
      .send({ message: errorMessages.unableToFetchComments });
  }
}

/**
 * Gets a specific comment by ID with all related entities.
 * @param {string} req.params.id - The ID of the comment to retrieve.
 * @returns {Object} The comment with author, post, and nested replies.
 * @throws {404} If the comment is not found.
 * @throws {500} If there's an error during the retrieval process.
 */
export async function get(req, res) {
  try {
    const comment = await findCommentOr404(req.params.id, res);
    if (!comment) return;

    return res.status(httpStatus.ok).send(comment);
  } catch (error) {
    console.error(error);
    return res
      .status(httpStatus.internalServerError)
      .send({ message: errorMessages.unableToFetchComment });
  }
}

/**
 * Updates a comment's content.
 * @param {string} req.params.id - The ID of the comment to update.
 * @param {Object} req.body - The request body containing updated comment data.
 * @param {string} req.body.body - The new content of the comment.
 * @param {Object} req.user - The authenticated user from JWT token.
 * @returns {Object} The updated comment with 200 status code.
 * @throws {400} If the body field is missing.
 * @throws {403} If the user is not the owner of the comment.
 * @throws {404} If the comment is not found.
 * @throws {500} If there's an error during the update process.
 */
export async function update(req, res) {
  try {
    const comment = await findCommentOr404(req.params.id, res);
    if (!comment) return;
    const {id: userId} = req.user;
    if (comment.userId !== userId) {
      return res
        .status(httpStatus.forbidden)
        .send({ message: errorMessages.cannotUpdateOtherComment });
    }

    const { body } = req.body; // Already validated by Joi

    await comment.update({ body });
    return res.status(httpStatus.ok).send(comment);
  } catch (error) {
    console.error(error);
    return res
      .status(httpStatus.internalServerError)
      .send({ message: errorMessages.unableToUpdateComment });
  }
}

/**
 * Deletes a comment by ID.
 * @param {string} req.params.id - The ID of the comment to delete.
 * @param {Object} req.user - The authenticated user from JWT token.
 * @returns {void} 204 No Content status code on success.
 * @throws {403} If the user is not the owner of the comment.
 * @throws {404} If the comment is not found.
 * @throws {500} If there's an error during the deletion process.
 */
export async function remove(req, res) {
  try {
    const comment = await findCommentOr404(req.params.id, res);
    if (!comment) return;
    const {id: userId} = req.user;
    if (comment.userId !== userId) {
      return res
        .status(httpStatus.forbidden)
        .send({ message: errorMessages.cannotDeleteOtherComment });
    }

    await comment.destroy();
    return res.status(httpStatus.noContent).send();
  } catch (error) {
    console.error(error);
    return res
      .status(httpStatus.internalServerError)
      .send({ message: errorMessages.unableToDeleteComment });
  }
}
