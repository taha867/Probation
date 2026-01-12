import { Request, Response } from "express";
import {
  HTTP_STATUS,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
} from "../utils/constants.js";
import { validateRequest } from "../utils/validations.js";
import {
  getUserPostsQuerySchema,
  updateUserSchema,
  userIdParamSchema,
  listUsersQuerySchema,
} from "../validations/userValidation.js";
import { userService } from "../services/userService.js";
import { handleAppError } from "../utils/errors.js";
import {
  ListUsersQuery,
  GetUserPostsQuery,
  UpdateUserInput,
  BaseUserProfile,
  PublicUserProfile,
} from "../interfaces/userInterface.js";
import type { IdParam } from "../interfaces/index.js";

const { INTERNAL_SERVER_ERROR, OK, NOT_FOUND, UNAUTHORIZED, BAD_REQUEST } = HTTP_STATUS;
const {
  UNABLE_TO_FETCH_USERS,
  UNABLE_TO_FETCH_USER_POSTS,
  USER_NOT_FOUND,
  UNABLE_TO_UPDATE_USER,
  UNABLE_TO_DELETE_USER,
  UNABLE_TO_FETCH_CURRENT_USER,
  ACCESS_TOKEN_REQUIRED
} = ERROR_MESSAGES;
const { USER_UPDATED, USER_DELETED } = SUCCESS_MESSAGES;

// Note: req.file is now available globally via express.d.ts augmentation

/**
 * Gets paginated list of all users
 * 
 * @param req - Express request object with pagination query parameters
 * @param res - Express response object
 * @returns Promise that resolves when response is sent
 * @throws {500} If there's an error during the retrieval process
 */
export async function list(req: Request, res: Response): Promise<void> {
  const validatedQuery = validateRequest<ListUsersQuery>(
    listUsersQuerySchema,
    req.query,
    res,
    {
      convert: true,
    }
  );
  if (!validatedQuery) return;

  // Joi validation ensures page and limit are always present (defaults applied)
  const { page, limit } = validatedQuery;

  try {
    const result = await userService.listUsers({
      page: page!,   
      limit: limit!, 
    });
    const { rows : users , meta } = result;
    res.status(OK).send({
      data: {
        users,
        meta,
      },
    });
  } catch (error: unknown) {
    console.error(error);
    res.status(INTERNAL_SERVER_ERROR).send({
      message: UNABLE_TO_FETCH_USERS,
    });
  }
}

/**
 * Gets the current authenticated user's profile
 * 
 * @param req - Express request object with authenticated user from JWT token
 * @param res - Express response object
 * @returns Promise that resolves when response is sent
 * @throws {404} If the user is not found
 * @throws {500} If there's an error during the retrieval process
 */
export async function getCurrentUser(
  req: Request,
  res: Response
): Promise<void> {
  // Type guard: Ensure user exists
  if (!req.user) {
    res.status(UNAUTHORIZED).send({
      data: { message: ACCESS_TOKEN_REQUIRED },
    });
    return;
  }

  const { id: userId } = req.user;

  try {
    const user = await userService.findUserById(userId);

    if (!user) {
      res.status(NOT_FOUND).send({
        data: { message: USER_NOT_FOUND },
      });
      return;
    }

    const { id, name, email, image } = user;

    res.status(OK).send({
      data: {
        user: {
          id,
          name,
          email,
          image,
        } as BaseUserProfile,
      },
    });
  } catch (error: unknown) {
    console.error(error);
    res.status(INTERNAL_SERVER_ERROR).send({
      data: { message: UNABLE_TO_FETCH_CURRENT_USER },
    });
  }
}

/**
 * Gets all posts for a specific user with nested comments and replies
 * 
 * @param req - Express request object with user ID in params and pagination/search in query
 * @param res - Express response object
 * @returns Promise that resolves when response is sent
 * @throws {400} If the user id is invalid
 * @throws {404} If the user is not found
 * @throws {500} If there's an error during the retrieval process
 */
export async function getUserPostsWithComment(
  req: Request,
  res: Response
): Promise<void> {
  const validatedParams = validateRequest<IdParam>(
    userIdParamSchema,
    req.params,
    res,
    {
      convert: true,
    }
  );
  if (!validatedParams) return;

  const { id: requestedUserId } = validatedParams;

  const validatedQuery = validateRequest<GetUserPostsQuery>(
    getUserPostsQuerySchema,
    req.query,
    res,
    { convert: true }
  );
  if (!validatedQuery) return;

  // Joi validation ensures page and limit are always present (defaults applied)
  const { page, limit, search } = validatedQuery;

  try {
    const result = await userService.getUserPostsWithComments({
      userId: requestedUserId,
      page: page!,   // Non-null assertion: Joi guaranteed default
      limit: limit!, // Non-null assertion: Joi guaranteed default
      search,
    });

    if (!result.user) {
      res.status(NOT_FOUND).send({
        data: { message: USER_NOT_FOUND },
      });
      return;
    }

    res.status(OK).send({ data: result });
  } catch (error: unknown) {
    console.error(error);
    res.status(INTERNAL_SERVER_ERROR).send({
      data: { message: UNABLE_TO_FETCH_USER_POSTS },
    });
  }
}

/**
 * Updates a user's profile information
 * 
 * @param req - Express request object with user ID in params, update data in body, and optional file upload
 * @param res - Express response object
 * @returns Promise that resolves when response is sent
 * @throws {400} If the user id is invalid
 * @throws {403} If the user is trying to update another user's profile
 * @throws {404} If the user is not found
 * @throws {422} If the email or phone already exists for another user
 * @throws {500} If there's an error during the update process
 */
export async function update(req: Request, res: Response): Promise<void> {
  const validatedParams = validateRequest<IdParam>(
    userIdParamSchema,
    req.params,
    res,
    {
      convert: true,
    }
  );
  if (!validatedParams) return;

  const { id: requestedUserId } = validatedParams;

  // Type guard: Ensure user exists
  if (!req.user) {
    res.status(UNAUTHORIZED).send({
      data: { message: ACCESS_TOKEN_REQUIRED },
    });
    return;
  }

  const { id: authUser } = req.user;

  try {
    // Validate request body (all fields optional)
    const validatedBody = validateRequest<UpdateUserInput>(
      updateUserSchema,
      req.body,
      res
    );
    if (!validatedBody) return;

    // Filter out undefined values - only include fields that were actually provided
    // Keep null and empty string for image removal
    const updateData: UpdateUserInput = Object.fromEntries(
      Object.entries(validatedBody).filter(([_, value]) => value !== undefined)
    ) as UpdateUserInput;

    // Check if at least one field is being updated (body fields OR file upload)
    const hasBodyFields = Object.keys(updateData).length > 0;
    const hasFileUpload = req.file !== undefined;

    if (!hasBodyFields && !hasFileUpload) {
      res.status(BAD_REQUEST).send({
        data: {
          message: "At least one field must be provided to update",
        },
      });
      return;
    }

    // Extract file data (if uploaded)
    const fileBuffer = req.file ? req.file.buffer : null;
    const fileName = req.file ? req.file.originalname : null;

    const result = await userService.updateUserForSelf({
      requestedUserId,
      authUserId: authUser,
      data: updateData,
      fileBuffer,
      fileName,
    });

    if (!result.data) {
      throw new Error("Update result missing data");
    }

    const {
      id,
      name: userName,
      email: userEmail,
      phone: userPhone,
      image: userImage,
      status,
    } = result.data;

    res.status(OK).send({
      data: {
        message: USER_UPDATED,
        user: {
          id,
          name: userName,
          email: userEmail,
          phone: userPhone,
          image: userImage,
          status,
        } as PublicUserProfile,
      },
    });
  } catch (err: unknown) {
    if (handleAppError(err, res, ERROR_MESSAGES)) return;

    console.error(err);
    res.status(INTERNAL_SERVER_ERROR).send({
      data: { message: UNABLE_TO_UPDATE_USER },
    });
  }
}

/**
 * Deletes a user account and all associated data (posts, comments)
 * 
 * @param req - Express request object with user ID in params and authenticated user
 * @param res - Express response object
 * @returns Promise that resolves when response is sent
 * @throws {400} If the user id is invalid
 * @throws {403} If the user is trying to delete another user's account
 * @throws {404} If the user is not found
 * @throws {500} If there's an error during the deletion process
 */
export async function remove(req: Request, res: Response): Promise<void> {
  const validatedParams = validateRequest<IdParam>(
    userIdParamSchema,
    req.params,
    res,
    {
      convert: true,
    }
  );
  if (!validatedParams) return;

  const { id: requestedUserId } = validatedParams;

  // Type guard: Ensure user exists
  if (!req.user) {
    res.status(UNAUTHORIZED).send({
      data: { message: ACCESS_TOKEN_REQUIRED },
    });
    return;
  }

  const { id: authUser } = req.user;

  try {
    await userService.deleteUserForSelf({
      requestedUserId,
      authUserId: authUser,
    });

    res.status(OK).send({
      data: { message: USER_DELETED },
    });
  } catch (err: unknown) {
    if (handleAppError(err, res, ERROR_MESSAGES)) return;

    console.error(err);
    res.status(INTERNAL_SERVER_ERROR).send({
      data: { message: UNABLE_TO_DELETE_USER },
    });
  }
}

