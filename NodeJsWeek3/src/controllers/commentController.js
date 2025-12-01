import { httpStatus, errorMessages } from "../utils/constants.js";
import { validateRequest } from "../middleware/validationMiddleware.js";
import {
  createCommentSchema,
  updateCommentSchema,
  listCommentsQuerySchema,
  commentIdParamSchema,
} from "../validations/commentValidation.js";
import {
  createCommentOrReply,
  listTopLevelComments,
  findCommentWithRelations,
  updateCommentForUser,
  deleteCommentForUser,
} from "../services/commentService.js";

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
  const validatedBody = validateRequest(createCommentSchema, req.body, res);
  if (!validatedBody) return;
  const { body, postId, parentId } = validatedBody; // Already validated by Joi
  const { id: userId } = req.user;

  try {
    const result = await createCommentOrReply({
      body,
      postId,
      parentId,
      userId,
    });

    if (!result.ok) {
      if (result.reason === "PARENT_NOT_FOUND") {
        return res
          .status(httpStatus.NOT_FOUND)
          .send({ message: errorMessages.parentCommentNotFound });
      }
      if (result.reason === "POST_NOT_FOUND") {
        return res
          .status(httpStatus.NOT_FOUND)
          .send({ message: errorMessages.postNotFound });
      }
    }

    return res.status(httpStatus.CREATED).send(result.comment);
  } catch (error) {
    console.error(error);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
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
  const validatedQuery = validateRequest(listCommentsQuerySchema, req.query, res);
  if (!validatedQuery) return;
  const { postId } = validatedQuery;

  try {
    const comments = await listTopLevelComments({ postId });
    return res.status(httpStatus.OK).send(comments);
  } catch (error) {
    console.error(error);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
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
    const validatedParams = validateRequest(commentIdParamSchema, req.params, res);
    if (!validatedParams) return;
    const { id } = validatedParams;
    const comment = await findCommentWithRelations(id);
    if (!comment) {
      return res
        .status(httpStatus.NOT_FOUND)
        .send({ message: errorMessages.commentNotFound });
    }

    return res.status(httpStatus.OK).send(comment);
  } catch (error) {
    console.error(error);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
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
    const validatedParams = validateRequest(commentIdParamSchema, req.params, res);
    if (!validatedParams) return;
    const { id } = validatedParams;
    const { id: userId } = req.user;
    const validatedBody = validateRequest(updateCommentSchema, req.body, res);
    if (!validatedBody) return;
    const { body } = validatedBody; // Already validated by Joi
    const result = await updateCommentForUser({ id, userId, body });

    if (!result.ok) {
      if (result.reason === "NOT_FOUND") {
        return res
          .status(httpStatus.NOT_FOUND)
          .send({ message: errorMessages.commentNotFound });
      }
      if (result.reason === "FORBIDDEN") {
        return res
          .status(httpStatus.FORBIDDEN)
          .send({ message: errorMessages.cannotUpdateOtherComment });
      }
    }

    return res.status(httpStatus.OK).send(result.comment);
  } catch (error) {
    console.error(error);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
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
    const validatedParams = validateRequest(commentIdParamSchema, req.params, res);
    if (!validatedParams) return;
    const { id } = validatedParams;
    const { id: userId } = req.user;
    const result = await deleteCommentForUser({ id, userId });

    if (!result.ok) {
      if (result.reason === "NOT_FOUND") {
        return res
          .status(httpStatus.NOT_FOUND)
          .send({ message: errorMessages.commentNotFound });
      }
      if (result.reason === "FORBIDDEN") {
        return res
          .status(httpStatus.FORBIDDEN)
          .send({ message: errorMessages.cannotDeleteOtherComment });
      }
    }

    return res.status(httpStatus.NO_CONTENT).send();
  } catch (error) {
    console.error(error);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send({ message: errorMessages.unableToDeleteComment });
  }
}
