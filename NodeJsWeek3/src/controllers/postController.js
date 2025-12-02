import { httpStatus, errorMessages, successMessages } from "../utils/constants.js";
import { validateRequest } from "../middleware/validationMiddleware.js";
import {
  createPostSchema,
  updatePostSchema,
  listPostsQuerySchema,
  postIdParamSchema,
  postIdParamForCommentsSchema,
} from "../validations/postValidation.js";
import {
  createPost,
  listPosts,
  findPostWithAuthor,
  getPostWithComments,
  updatePostForUser,
  deletePostForUser,
} from "../services/postService.js";

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
  const validatedBody = validateRequest(createPostSchema, req.body, res);
  if (!validatedBody) return;
  const { title, body, status } = validatedBody; // Already validated by Joi
  const { id: userId } = req.user; // Get userId from authenticated user

  try {
    const post = await createPost({ title, body, status, userId });
    return res.status(httpStatus.CREATED).send(post);
  } catch (error) {
    console.error(error);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
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
  const validatedQuery = validateRequest(
    listPostsQuerySchema,
    req.query,
    res,
    { convert: true }
  );
  if (!validatedQuery) return;

  const page = parseInt(validatedQuery.page ?? 1, 10) || 1;
  const limit = parseInt(validatedQuery.limit ?? 10, 10) || 10;
  const { search, userId } = validatedQuery; // Already validated by Joi

  try {
    const { rows, count } = await listPosts({
      page,
      limit,
      search,
      userId,
    });

    return res.status(httpStatus.OK).send({
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
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send({ message: errorMessages.unableToFetchPost });
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
    const { id } = validatedParams;
    const post = await findPostWithAuthor(id);
    if (!post) {
      return res
        .status(httpStatus.NOT_FOUND)
        .send({ message: errorMessages.postNotFound });
    }

    return res.status(httpStatus.OK).send(post);
  } catch (error) {
    console.error(error);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
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
  const validatedParams = validateRequest(
    postIdParamForCommentsSchema,
    req.params,
    res,
    { convert: true }
  );
  if (!validatedParams) return;
  const { postId } = validatedParams;

  const validatedQuery = validateRequest(
    listPostsQuerySchema,
    req.query,
    res,
    { convert: true }
  );
  if (!validatedQuery) return;
  const page = parseInt(validatedQuery.page ?? 1, 10) || 1;
  const limit = parseInt(validatedQuery.limit ?? 10, 10) || 10;

  try {
    const { post, comments, meta } = await getPostWithComments({
      postId,
      page,
      limit,
    });

    if (!post) {
      return res
        .status(httpStatus.NOT_FOUND)
        .send({ message: errorMessages.postNotFound });
    }

    return res.status(httpStatus.OK).send({
      post,
      comments,
      meta,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
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
    const { title, body, status } = validatedBody;
    const result = await updatePostForUser({
      postId,
      userId,
      data: { title, body, status },
    });

    if (!result.ok) {
      if (result.reason === "NOT_FOUND") {
        return res
          .status(httpStatus.NOT_FOUND)
          .send({ message: errorMessages.postNotFound });
      }
      if (result.reason === "FORBIDDEN") {
        return res
          .status(httpStatus.FORBIDDEN)
          .send({ message: errorMessages.cannotUpdateOtherPost });
      }
    }

    return res.status(httpStatus.OK).send(result.post);
  } catch (error) {
    console.error(error);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
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
    const { id: userId } = req.user;
    const validatedParams = validateRequest(
      postIdParamSchema,
      req.params,
      res,
      { convert: true }
    );
    if (!validatedParams) return;
    const { id } = validatedParams;
    const result = await deletePostForUser({ postId: id, userId });

    if (!result.ok) {
      if (result.reason === "NOT_FOUND") {
        return res
          .status(httpStatus.NOT_FOUND)
          .send({ message: errorMessages.postNotFound });
      }
      if (result.reason === "FORBIDDEN") {
        return res
          .status(httpStatus.FORBIDDEN)
          .send({ message: errorMessages.cannotDeleteOtherPost });
      }
    }

    // Return a JSON message so clients can see confirmation
    return res.status(httpStatus.OK).send({
      message: successMessages.postDeleted,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send({ message: errorMessages.unableToDeletePost });
  }
}
