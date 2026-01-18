import { Request, Response } from "express";
import {
  HTTP_STATUS,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
} from "../utils/constants.js";
import { validateRequest } from "../utils/validations.js";
import {
  createCommentSchema,
  updateCommentSchema,
  listCommentsQuerySchema,
  commentIdParamSchema,
  CreateCommentInput,
  UpdateCommentInput,
  ListCommentsQuery,
} from "../validations/commentValidation.js";
import { commentService } from "../services/commentService.js";
import { handleAppError } from "../utils/errors.js";
import type { IdParam } from "../interfaces/index.js";

const { INTERNAL_SERVER_ERROR, OK, NOT_FOUND, CREATED, UNAUTHORIZED } = HTTP_STATUS;
const {
  UNABLE_TO_CREATE_COMMENT,
  UNABLE_TO_FETCH_COMMENT,
  UNABLE_TO_DELETE_COMMENT,
  UNABLE_TO_UPDATE_COMMENT,
  UNABLE_TO_FETCH_COMMENTS,
  COMMENT_NOT_FOUND,
  ACCESS_TOKEN_REQUIRED
} = ERROR_MESSAGES;
const {
  COMMENT_CREATED,
  COMMENT_UPDATED,
  COMMENT_DELETED,
} = SUCCESS_MESSAGES;

/**
 * Creates a new comment or reply to an existing comment
 * 
 * @param req - Express request object containing comment data
 * @param res - Express response object
 * @returns Promise that resolves when response is sent
 * @throws {400} If body or both postId and parentId are missing
 * @throws {404} If the post or parent comment is not found
 * @throws {500} If there's an error during the creation process
 */
export async function create(req: Request, res: Response): Promise<void> {
  // Type guard: Ensure user exists
  if (!req.user) {
    res.status(UNAUTHORIZED).send({
      data: { message: ACCESS_TOKEN_REQUIRED },
    });
    return;
  }

  const validatedBody = validateRequest<CreateCommentInput>(
    createCommentSchema,
    req.body,
    res
  );
  if (!validatedBody) return;

  const { body, postId, parentId } = validatedBody;
  const { id: userId } = req.user;

  try {
    const result = await commentService.createCommentOrReply({
      authUserId: userId,
      data: {
        body,
        postId,
        parentId,
      },
    });

    if (!result.data) {
      throw new Error("Comment creation result missing data");
    }

    res.status(CREATED).send({
      data: result.data,
      message: COMMENT_CREATED,
    });
  } catch (err: unknown) {
    if (handleAppError(err, res, ERROR_MESSAGES)) return;

    console.error(err);
    res.status(INTERNAL_SERVER_ERROR).send({
      message: UNABLE_TO_CREATE_COMMENT,
    });
  }
}

/**
 * Gets all top-level comments, optionally filtered by post
 * 
 * @param req - Express request object with query parameters for filtering
 * @param res - Express response object
 * @returns Promise that resolves when response is sent
 * @throws {500} If there's an error during the retrieval process
 */
export async function list(req: Request, res: Response): Promise<void> {
  const validatedQuery = validateRequest<ListCommentsQuery>(
    listCommentsQuerySchema,
    req.query,
    res,
    { convert: true }
  );

  if (!validatedQuery) return;
  const { postId } = validatedQuery;

  try {
    const comments = await commentService.listTopLevelComments({ postId });
    res.status(OK).send({ data: comments });
  } catch (error: unknown) {
    console.error(error);
    res.status(INTERNAL_SERVER_ERROR).send({
      message: UNABLE_TO_FETCH_COMMENTS,
    });
  }
}

/**
 * Gets a specific comment by ID with all related entities
 * 
 * @param req - Express request object with comment ID in params
 * @param res - Express response object
 * @returns Promise that resolves when response is sent
 * @throws {404} If the comment is not found
 * @throws {500} If there's an error during the retrieval process
 */
export async function get(req: Request, res: Response): Promise<void> {
  try {
    const validatedParams = validateRequest<IdParam>(
      commentIdParamSchema,
      req.params,
      res,
      { convert: true }
    );

    if (!validatedParams) return;

    const { id } = validatedParams;
    const comment = await commentService.findCommentWithRelations(id);

    if (!comment) {
      res.status(NOT_FOUND).send({
        data: { message: COMMENT_NOT_FOUND },
      });
      return;
    }

    res.status(OK).send({ data: comment });
  } catch (error: unknown) {
    console.error(error);
    res.status(INTERNAL_SERVER_ERROR).send({
      data: { message: UNABLE_TO_FETCH_COMMENT },
    });
  }
}

/**
 * Updates a comment's content
 * 
 * @param req - Express request object with comment ID in params and updated data in body
 * @param res - Express response object
 * @returns Promise that resolves when response is sent
 * @throws {400} If the body field is missing
 * @throws {403} If the user is not the owner of the comment
 * @throws {404} If the comment is not found
 * @throws {500} If there's an error during the update process
 */
export async function update(req: Request, res: Response): Promise<void> {
  try {
    // Type guard: Ensure user exists
    if (!req.user) {
      res.status(UNAUTHORIZED).send({
        data: { message: ACCESS_TOKEN_REQUIRED },
      });
      return;
    }

    const validatedParams = validateRequest<IdParam>(
      commentIdParamSchema,
      req.params,
      res,
      { convert: true }
    );

    if (!validatedParams) return;

    const { id: commentId } = validatedParams;
    const { id: userId } = req.user;

    const validatedBody = validateRequest<UpdateCommentInput>(
      updateCommentSchema,
      req.body,
      res
    );
    if (!validatedBody) return;

    const { body } = validatedBody;

    const result = await commentService.updateCommentForUser({
      commentId,
      authUserId: userId,
      body,
    });
    const{data}=result;
    if (!data) {
      throw new Error("Update result missing data");
    }

    res.status(OK).send({
      data,
      message: COMMENT_UPDATED,
    });
  } catch (err: unknown) {
    if (handleAppError(err, res, ERROR_MESSAGES)) return;

    console.error(err);
    res.status(INTERNAL_SERVER_ERROR).send({
      data: { message: UNABLE_TO_UPDATE_COMMENT },
    });
  }
}

/**
 * Deletes a comment by ID
 * 
 * @param req - Express request object with comment ID in params
 * @param res - Express response object
 * @returns Promise that resolves when response is sent
 * @throws {403} If the user is not the owner of the comment
 * @throws {404} If the comment is not found
 * @throws {500} If there's an error during the deletion process
 */
export async function remove(req: Request, res: Response): Promise<void> {
  try {
    // Type guard: Ensure user exists
    if (!req.user) {
      res.status(UNAUTHORIZED).send({
        data: { message: ACCESS_TOKEN_REQUIRED },
      });
      return;
    }

    const validatedParams = validateRequest<IdParam>(
      commentIdParamSchema,
      req.params,
      res,
      { convert: true }
    );

    if (!validatedParams) return;

    const { id: commentId } = validatedParams;
    const { id: userId } = req.user;

    await commentService.deleteCommentForUser({
      commentId,
      authUserId: userId,
    });

    res.status(OK).send({
      data: { message: COMMENT_DELETED },
    });
  } catch (err: unknown) {
    if (handleAppError(err, res, ERROR_MESSAGES)) return;

    console.error(err);
    res.status(INTERNAL_SERVER_ERROR).send({
      data: { message: UNABLE_TO_DELETE_COMMENT },
    });
  }
}

