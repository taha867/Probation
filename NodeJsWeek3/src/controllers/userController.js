import { httpStatus, successMessages, errorMessages } from "../utils/constants.js";
import { validateRequest } from "../middleware/validationMiddleware.js";
import {
  getUserPostsQuerySchema,
  updateUserSchema,
  userIdParamSchema,
  listUsersQuerySchema,
} from "../validations/userValidation.js";
import {
  listUsers,
  getUserPostsWithComments,
  updateUserForSelf,
  deleteUserForSelf,
} from "../services/userService.js";

/**
 * Gets paginated list of all users.
 * @param {Object} req.query - The query parameters for pagination.
 * @param {number} [req.query.page=1] - The page number to retrieve.
 * @param {number} [req.query.limit=20] - The number of users per page (max 100).
 * @returns {Object} Paginated list of users with metadata.
 * @throws {500} If there's an error during the retrieval process.
 */
export async function list(req, res) {
  const validatedQuery = validateRequest(
    listUsersQuerySchema,
    req.query,
    res,
    { convert: true }
  );
  if (!validatedQuery) return;
  const page = parseInt(validatedQuery.page ?? 1, 10) || 1;
  const limit = parseInt(validatedQuery.limit ?? 10, 10) || 10;

  try {
    const { rows, count } = await listUsers({ page, limit });

    return res.status(httpStatus.OK).send({
      users: rows,
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
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send({ message: errorMessages.unableToFetchUsers });
  }
}

/**
 * Gets all posts for a specific user with nested comments and replies.
 * @param {string} req.params.id - The userId of the posts to retrieve.
 * @param {Object} req.query - The query parameters for pagination.
 * @param {number} [req.query.page=1] - The page number to retrieve.
 * @param {number} [req.query.limit=10] - The number of posts per page (max 100).
 * @returns {Object} User information and paginated posts with nested comments.
 * @throws {400} If the user id is invalid.
 * @throws {404} If the user is not found.
 * @throws {500} If there's an error during the retrieval process.
 */
export async function getUserPostsWithComment(req, res) {
  const validatedParams = validateRequest(
    userIdParamSchema,
    req.params,
    res,
    { convert: true }
  );
  if (!validatedParams) return;
  const { id: requestedUserId } = validatedParams;

  const validatedQuery = validateRequest(
    getUserPostsQuerySchema,
    req.query,
    res,
    { convert: true }
  );
  if (!validatedQuery) return;
  const page = parseInt(validatedQuery.page ?? 1, 10) || 1;
  const limit = parseInt(validatedQuery.limit ?? 10, 10) || 10;

  try {
    const result = await getUserPostsWithComments({
      userId: requestedUserId,
      page,
      limit,
    });

    if (!result.user) {
      return res
        .status(httpStatus.NOT_FOUND)
        .send({ message: errorMessages.userNotFound });
    }

    return res.status(httpStatus.OK).send(result);
  } catch (error) {
    console.error(error);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send({ message: errorMessages.unableToFetchUserPosts });
  }
}

/**
 * Updates a user's profile information.
 * @param {string} req.params.id - The ID of the user to update.
 * @param {Object} req.body - The request body containing updated user data.
 * @param {string} [req.body.name] - The new name of the user.
 * @param {string} [req.body.email] - The new email address of the user.
 * @param {string} [req.body.phone] - The new phone number of the user.
 * @param {string} [req.body.password] - The new password for the user account.
 * @param {Object} req.user - The authenticated user from JWT token.
 * @returns {Object} The updated user information with 200 status code.
 * @throws {400} If the user id is invalid.
 * @throws {403} If the user is trying to update another user's profile.
 * @throws {404} If the user is not found.
 * @throws {422} If the email or phone already exists for another user.
 * @throws {500} If there's an error during the update process.
 */
export async function update(req, res) {
  const validatedParams = validateRequest(
    userIdParamSchema,
    req.params,
    res,
    { convert: true }
  );
  if (!validatedParams) return;
  const { id: requestedUserId } = validatedParams;
  const {id: authUser} = req.user;
  try {
    const updateBody = validateRequest(updateUserSchema, req.body, res);
    if (!updateBody) return;
    const result = await updateUserForSelf({
      requestedUserId,
      authUserId: authUser,
      data: updateBody,
    });

    if (!result.ok) {
      if (result.reason === "FORBIDDEN") {
        return res
          .status(httpStatus.FORBIDDEN)
          .send({ message: errorMessages.cannotUpdateOtherUser });
      }
      if (result.reason === "NOT_FOUND") {
        return res
          .status(httpStatus.NOT_FOUND)
          .send({ message: errorMessages.userNotFound });
      }
      if (result.reason === "EMAIL_EXISTS") {
        return res
          .status(httpStatus.UNPROCESSABLE_ENTITY)
          .send({ message: errorMessages.emailAlreadyExists });
      }
      if (result.reason === "PHONE_EXISTS") {
        return res
          .status(httpStatus.UNPROCESSABLE_ENTITY)
          .send({ message: errorMessages.phoneAlreadyExists });
      }
    }

    const { user } = result;
    const { id, name: userName, email: userEmail, phone: userPhone, status } = user;
    return res.status(httpStatus.OK).send({
      message: successMessages.userUpdated,
      user: {
        id,
        name: userName,
        email: userEmail,
        phone: userPhone,
        status,
      },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send({ message: errorMessages.unableToUpdateUser });
  }
}

/**
 * Deletes a user account and all associated data (posts, comments).
 * @param {string} req.params.id - The ID of the user to delete.
 * @param {Object} req.user - The authenticated user from JWT token.
 * @returns {Object} Success message with 200 status code.
 * @throws {400} If the user id is invalid.
 * @throws {403} If the user is trying to delete another user's account.
 * @throws {404} If the user is not found.
 * @throws {500} If there's an error during the deletion process.
 */
export async function remove(req, res) {
  const validatedParams = validateRequest(
    userIdParamSchema,
    req.params,
    res,
    { convert: true }
  );
  if (!validatedParams) return;
  const { id: requestedUserId } = validatedParams;
  const {id: authUser} = req.user;
  try {
    const result = await deleteUserForSelf({
      requestedUserId,
      authUserId: authUser,
    });

    if (!result.ok) {
      if (result.reason === "FORBIDDEN") {
        return res
          .status(httpStatus.FORBIDDEN)
          .send({ message: errorMessages.cannotDeleteOtherUser });
      }
      if (result.reason === "NOT_FOUND") {
        return res
          .status(httpStatus.NOT_FOUND)
          .send({ message: errorMessages.userNotFound });
      }
    }

    return res.status(httpStatus.OK).send({
      message: successMessages.userDeleted,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send({ message: errorMessages.unableToDeleteUser });
  }
}
