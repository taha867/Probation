import {
  HTTP_STATUS,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
} from "../utils/constants.js";
import { validateRequest } from "../utils/validations.js";
import {
  getPaginationParams,
  buildPaginationMeta,
} from "../utils/pagination.js";
import {
  getUserPostsQuerySchema,
  updateUserSchema,
  userIdParamSchema,
  listUsersQuerySchema,
} from "../validations/userValidation.js";
import { userService } from "../services/userService.js";
import { handleAppError } from "../utils/errors.js";

const { INTERNAL_SERVER_ERROR, OK, NOT_FOUND } = HTTP_STATUS;
const {
  UNABLE_TO_FETCH_USERS,
  UNABLE_TO_FETCH_USER_POSTS,
  USER_NOT_FOUND,
  UNABLE_TO_UPDATE_USER,
  UNABLE_TO_DELETE_USER,
  UNABLE_TO_FETCH_CURRENT_USER,
} = ERROR_MESSAGES;
const { USER_UPDATED } = SUCCESS_MESSAGES;

/**
 * Gets paginated list of all users.
 * @param {Object} req.query - The query parameters for pagination.
 * @param {number} [req.query.page=1] - The page number to retrieve.
 * @param {number} [req.query.limit=20] - The number of users per page (max 100).
 * @returns {Object} Paginated list of users with metadata.
 * @throws {500} If there's an error during the retrieval process.
 */
export async function list(req, res) {
  const validatedQuery = validateRequest(listUsersQuerySchema, req.query, res, {
    convert: true,
  });
  if (!validatedQuery) return;
  const { page, limit } = getPaginationParams(validatedQuery);

  try {
    const { rows, count } = await userService.listUsers({ page, limit });

    return res.status(OK).send({
      data: {
        users: rows,
        meta: buildPaginationMeta({ total: count, page, limit }),
      },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .send({ message: UNABLE_TO_FETCH_USERS });
  }
}

/**
 * Gets the current authenticated user's profile.
 * @param {Object} req.user - The authenticated user from JWT token.
 * @returns {Object} Current user's profile information.
 * @throws {404} If the user is not found.
 * @throws {500} If there's an error during the retrieval process.
 */
export async function getCurrentUser(req, res) {
  const { id: userId } = req.user;

  try {
    const user = await userService.findUserById(userId);

    if (!user) {
      return res.status(NOT_FOUND).send({
        data: { message: USER_NOT_FOUND },
      });
    }

    const { id, name, email, image } = user;

    return res.status(OK).send({
      data: {
        user: {
          id,
          name,
          email,
          image,
        },
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(INTERNAL_SERVER_ERROR).send({
      data: { message: UNABLE_TO_FETCH_CURRENT_USER },
    });
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
  const validatedParams = validateRequest(userIdParamSchema, req.params, res, {
    convert: true,
  });
  if (!validatedParams) return;
  const { id: requestedUserId } = validatedParams;

  const validatedQuery = validateRequest(
    getUserPostsQuerySchema,
    req.query,
    res,
    { convert: true }
  );
  if (!validatedQuery) return;
  const { page, limit } = getPaginationParams(validatedQuery);
  const { search } = validatedQuery;

  try {
    const result = await userService.getUserPostsWithComments({
      userId: requestedUserId,
      page,
      limit,
      search,
    });

    if (!result.user) {
      return res.status(NOT_FOUND).send({
        data: { message: USER_NOT_FOUND },
      });
    }

    return res.status(OK).send({ data: result });
  } catch (error) {
    console.error(error);
    return res.status(INTERNAL_SERVER_ERROR).send({
      data: { message: UNABLE_TO_FETCH_USER_POSTS },
    });
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
 * @param {string} [req.body.image] - Optional profile image URL for the user.
 * @param {Object} req.user - The authenticated user from JWT token.
 * @returns {Object} The updated user information with 200 status code.
 * @throws {400} If the user id is invalid.
 * @throws {403} If the user is trying to update another user's profile.
 * @throws {404} If the user is not found.
 * @throws {422} If the email or phone already exists for another user.
 * @throws {500} If there's an error during the update process.
 */
export async function update(req, res) {
  const validatedParams = validateRequest(userIdParamSchema, req.params, res, {
    convert: true,
  });
  if (!validatedParams) return;
  const { id: requestedUserId } = validatedParams;
  const { id: authUser } = req.user;
  try {
    // When only a file is uploaded via FormData, req.body might be empty
    // We need to ensure validation passes by adding a placeholder field
    // The validation schema will detect req.file and handle it appropriately
    const bodyForValidation = { ...req.body };
    if (req.file && !bodyForValidation.image) {
      // File was uploaded but body doesn't have image field - add placeholder for validation
      bodyForValidation.image = req.file.originalname;
    }

    const validatedBody = validateRequest(
      updateUserSchema,
      bodyForValidation,
      res,
      { context: { req } } // Passing req object as context
      // The file is in req.file (from multer middleware)
      // The validation payload only has { name, email, phone, ... }
      // The validation needs to know if a file was uploaded
    );
    if (!validatedBody) return; 

    // Remove the placeholder image field if it was added (service will handle the actual file)
    if (req.file && validatedBody.image === req.file.originalname) {
      delete validatedBody.image;
    }

  
    const fileBuffer = req.file ? req.file.buffer : null;
    const fileName = req.file ? req.file.originalname : null;

    const result = await userService.updateUserForSelf({
      requestedUserId,
      authUserId: authUser,
      data: validatedBody,
      fileBuffer,
      fileName,
    });

    const { user } = result;
    const {
      id,
      name: userName,
      email: userEmail,
      phone: userPhone,
      image: userImage,
      status,
    } = user;
    return res.status(OK).send({
      data: {
        message: USER_UPDATED,
        user: {
          id,
          name: userName,
          email: userEmail,
          phone: userPhone,
          image: userImage,
          status,
        },
      },
    });
  } catch (err) {
    if (handleAppError(err, res, ERROR_MESSAGES)) return;

    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(INTERNAL_SERVER_ERROR).send({
      data: { message: UNABLE_TO_UPDATE_USER },
    });
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
  const validatedParams = validateRequest(userIdParamSchema, req.params, res, {
    convert: true,
  });
  if (!validatedParams) return;
  const { id: requestedUserId } = validatedParams;
  const { id: authUser } = req.user;
  try {
    const result = await userService.deleteUserForSelf({
      requestedUserId,
      authUserId: authUser,
    });

    return res.status(HTTP_STATUS.OK).send({
      data: { message: SUCCESS_MESSAGES.USER_DELETED },
    });
  } catch (err) {
    if (handleAppError(err, res, ERROR_MESSAGES)) return;

    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(INTERNAL_SERVER_ERROR).send({
      data: { message: UNABLE_TO_DELETE_USER },
    });
  }
}
