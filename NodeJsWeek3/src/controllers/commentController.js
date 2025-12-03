import { httpStatus, errorMessages, successMessages } from "../utils/constants.js";
import { validateRequest } from "../utils/validations.js";
import {
  createCommentSchema,
  updateCommentSchema,
  listCommentsQuerySchema,
  commentIdParamSchema,
} from "../validations/commentValidation.js";
import { commentService } from "../services/commentService.js";
import { handleAppError } from "../utils/errors.js";

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
    const result = await commentService.createCommentOrReply({
      body,
      postId,
      parentId,
      userId,
    });
    return res.status(httpStatus.CREATED).send({ data: result.comment });
  } catch (err) {
    if (handleAppError(err, res, errorMessages)) return;

    // eslint-disable-next-line no-console
    console.error(err);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send({ message: errorMessages.UNABLE_TO_CREATE_COMMENT });
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
  const validatedQuery = validateRequest(
    listCommentsQuerySchema,
    req.query,
    res,
    { convert: true }
  );
  if (!validatedQuery) return;
  const { postId } = validatedQuery;

  try {
    const comments = await commentService.listTopLevelComments({ postId });
    return res.status(httpStatus.OK).send({ data: comments });
  } catch (error) {
    console.error(error);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send({ message: errorMessages.UNABLE_TO_FETCH_COMMENTS });
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
    const validatedParams = validateRequest(
      commentIdParamSchema,
      req.params,
      res,
      { convert: true }
    );
    if (!validatedParams) return;
    const { id } = validatedParams;
    const comment = await commentService.findCommentWithRelations(id);
    if (!comment) {
      return res.status(httpStatus.NOT_FOUND).send({
        data: { message: errorMessages.COMMENT_NOT_FOUND },
      });
    }

    return res.status(httpStatus.OK).send({ data: comment });
  } catch (error) {
    console.error(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      data: { message: errorMessages.UNABLE_TO_FETCH_COMMENT },
    });
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
    const validatedParams = validateRequest(
      commentIdParamSchema,
      req.params,
      res,
      { convert: true }
    );
    if (!validatedParams) return;
    const { id } = validatedParams;
    const { id: userId } = req.user;
    const validatedBody = validateRequest(updateCommentSchema, req.body, res);
    if (!validatedBody) return;
    const { body } = validatedBody; // Already validated by Joi
    const result = await commentService.updateCommentForUser({
      id,
      userId,
      body,
    });

    return res.status(httpStatus.OK).send({ data: result.comment });
  } catch (err) {
    if (handleAppError(err, res, errorMessages)) return;

    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      data: { message: errorMessages.UNABLE_TO_UPDATE_COMMENT },
    });
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
    const validatedParams = validateRequest(
      commentIdParamSchema,
      req.params,
      res,
      { convert: true }
    );
    if (!validatedParams) return;
    const { id } = validatedParams;
    const { id: userId } = req.user;
    await commentService.deleteCommentForUser({ id, userId });

    return res.status(httpStatus.OK).send({
      data: { message: successMessages.COMMENT_DELETED },
    });
  } catch (err) {
    if (handleAppError(err, res, errorMessages)) return;

    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      data: { message: errorMessages.UNABLE_TO_DELETE_COMMENT },
    });
  }
}
