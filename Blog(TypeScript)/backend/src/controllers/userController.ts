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

// Note: req.file is now available globally via express.d.ts augmentation

/**
 * User ID parameter interface
 * Extracted from validated route parameters
 */
interface UserIdParam {
  id: number;
}

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

  // Type guard: Ensure page and limit are numbers (Joi converts strings to numbers)
  const page = validatedQuery.page ?? 1;
  const limit = validatedQuery.limit ?? 20;

  try {
    const result = await userService.listUsers({ page, limit });

    res.status(OK).send({
      data: {
        users: result.rows,
        meta: result.meta,
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
    res.status(HTTP_STATUS.UNAUTHORIZED).send({
      data: { message: ERROR_MESSAGES.ACCESS_TOKEN_REQUIRED },
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
  const validatedParams = validateRequest<UserIdParam>(
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

  // Type guard: Ensure page and limit are numbers
  const page = validatedQuery.page ?? 1;
  const limit = validatedQuery.limit ?? 10;
  const { search } = validatedQuery;

  try {
    const result = await userService.getUserPostsWithComments({
      userId: requestedUserId,
      page,
      limit,
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
  const validatedParams = validateRequest<UserIdParam>(
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
    res.status(HTTP_STATUS.UNAUTHORIZED).send({
      data: { message: ERROR_MESSAGES.ACCESS_TOKEN_REQUIRED },
    });
    return;
  }

  const { id: authUser } = req.user;

  try {
    // When only a file is uploaded via FormData, req.body might be empty
    // We need to ensure validation passes by adding a placeholder field
    // The validation schema will detect req.file and handle it appropriately
    const bodyForValidation: Record<string, unknown> = { ...req.body };
    if (req.file && !bodyForValidation.image) {
      // File was uploaded but body doesn't have image field - add placeholder for validation
      bodyForValidation.image = req.file.originalname;
    }

    const validatedBody = validateRequest<UpdateUserInput>(
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
  const validatedParams = validateRequest<UserIdParam>(
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
    res.status(HTTP_STATUS.UNAUTHORIZED).send({
      data: { message: ERROR_MESSAGES.ACCESS_TOKEN_REQUIRED },
    });
    return;
  }

  const { id: authUser } = req.user;

  try {
    await userService.deleteUserForSelf({
      requestedUserId,
      authUserId: authUser,
    });

    res.status(HTTP_STATUS.OK).send({
      data: { message: SUCCESS_MESSAGES.USER_DELETED },
    });
  } catch (err: unknown) {
    if (handleAppError(err, res, ERROR_MESSAGES)) return;

    console.error(err);
    res.status(INTERNAL_SERVER_ERROR).send({
      data: { message: UNABLE_TO_DELETE_USER },
    });
  }
}

