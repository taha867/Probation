import {
  HTTP_STATUS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from "../utils/constants.js";
import { validateRequest } from "../utils/validations.js";
import {
  getPaginationParams,
  buildPaginationMeta,
} from "../utils/pagination.js";
import {
  createPostSchema,
  updatePostSchema,
  listPostsQuerySchema,
  postIdParamSchema,
  postIdParamForCommentsSchema,
} from "../validations/postValidation.js";
import { postService } from "../services/postService.js";
import { handleAppError } from "../utils/errors.js";

/**
 * Creates a new post.
 * @param {Object} req.body - The request body containing post data.
 * @param {string} req.body.title - The title of the post.
 * @param {string} req.body.body - The content of the post.
 * @param {string} [req.body.status] - The status of the post (draft or published).
 * @param {string} [req.body.image] - The image URL of the post (optional).
 * @param {Object} req.user - The authenticated user from JWT token.
 * @returns {Object} The created post with 201 status code.
 * @throws {400} If title or body are missing.
 * @throws {500} If there's an error during the creation process.
 */
export async function create(req, res) {
  const validatedBody = validateRequest(createPostSchema, req.body, res);
  if (!validatedBody) return;
  const { title, body, status, image } = validatedBody; // Already validated by Joi
  const { id: userId} = req.user; // Get userId from authenticated user

  try {
    const post = await postService.createPost({ title, body, status, image, userId });
    return res.status(HTTP_STATUS.CREATED).send({ data: post });
  } catch (error) {
    console.error(error);
    return res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .send({ message: ERROR_MESSAGES.UNABLE_TO_CREATE_POST });
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
  const validatedQuery = validateRequest(listPostsQuerySchema, req.query, res, {
    convert: true,
  });
  if (!validatedQuery) return;

  const { page, limit } = getPaginationParams(validatedQuery);
  const { search, userId } = validatedQuery; // Already validated by Joi

  try {
    const { rows, count } = await postService.listPosts({
      page,
      limit,
      search,
      userId,
    });

    return res.status(HTTP_STATUS.OK).send({
      data: {
        items: rows,
        meta: buildPaginationMeta({ total: count, page, limit }),
      },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .send({ message: ERROR_MESSAGES.UNABLE_TO_FETCH_POST });
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
    const validatedParams = validateRequest(
      postIdParamSchema,
      req.params,
      res,
      { convert: true }
    );
    if (!validatedParams) return;
    const { id ={}} = validatedParams;
    const post = await postService.findPostWithAuthor(id);
    if (!post) {
      return res.status(HTTP_STATUS.NOT_FOUND).send({
        data: { message: ERROR_MESSAGES.POST_NOT_FOUND },
      });
    }

    return res.status(HTTP_STATUS.OK).send({ data: post });
  } catch (error) {
    console.error(error);
    return res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .send({ message: ERROR_MESSAGES.UNABLE_TO_FETCH_POST });
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
  const validatedParams = validateRequest(
    postIdParamForCommentsSchema,
    req.params,
    res,
    { convert: true }
  );
  if (!validatedParams) return;
  const { postId } = validatedParams;

  const validatedQuery = validateRequest(listPostsQuerySchema, req.query, res, {
    convert: true,
  });
  if (!validatedQuery) return;
  const { page, limit } = getPaginationParams(validatedQuery);

  try {
    const { post, comments, meta } = await postService.getPostWithComments({
      postId,
      page,
      limit,
    });

    if (!post) {
      return res.status(HTTP_STATUS.NOT_FOUND).send({
        data: { message: ERROR_MESSAGES.POST_NOT_FOUND },
      });
    }

    return res.status(HTTP_STATUS.OK).send({
      data: {
        post,
        comments,
        meta,
      },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .send({ message: ERROR_MESSAGES.UNABLE_TO_FETCH_POST_COMMENTS });
  }
}

/**
 * Updates a post's content and status.
 * @param {string} req.params.id - The ID of the post to update.
 * @param {Object} req.body - The request body containing updated post data.
 * @param {string} [req.body.title] - The new title of the post.
 * @param {string} [req.body.body] - The new content of the post.
 * @param {string} [req.body.status] - The new status of the post.
 * @param {string} [req.body.image] - The new image URL of the post (optional).
 * @param {Object} req.user - The authenticated user from JWT token.
 * @returns {Object} The updated post with 200 status code.
 * @throws {403} If the user is not the owner of the post.
 * @throws {404} If the post is not found.
 * @throws {500} If there's an error during the update process.
 */
export async function update(req, res) {
  try {
    const validatedParams = validateRequest(
      postIdParamSchema,
      req.params,
      res,
      { convert: true }
    );
    if (!validatedParams) return;
    const { id: postId } = validatedParams;
    const { id: userId } = req.user;
    const validatedBody = validateRequest(updatePostSchema, req.body, res);
    if (!validatedBody) return;
    const { title, body, status, image } = validatedBody;
    const result = await postService.updatePostForUser({
      postId,
      userId,
      data: { title, body, status, image },
    });
    return res.status(HTTP_STATUS.OK).send({ data: result.post });
  } catch (err) {
    if (handleAppError(err, res, ERROR_MESSAGES)) return;

    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
      data: { message: ERROR_MESSAGES.UNABLE_TO_UPDATE_POST },
    });
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
    const { id: userId } = req.user;
    const validatedParams = validateRequest(
      postIdParamSchema,
      req.params,
      res,
      { convert: true }
    );
    if (!validatedParams) return;
    const { id } = validatedParams;
    await postService.deletePostForUser({ postId: id, userId });

    // Return a JSON message so clients can see confirmation
    return res.status(HTTP_STATUS.OK).send({
      data: { message: SUCCESS_MESSAGES.POST_DELETED },
    });
  } catch (err) {
    if (handleAppError(err, res, ERROR_MESSAGES)) return;

    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
      data: { message: ERROR_MESSAGES.UNABLE_TO_DELETE_POST },
    });
  }
}
