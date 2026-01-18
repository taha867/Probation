import { HTTP_STATUS, SUCCESS_MESSAGES, ERROR_MESSAGES, } from "../utils/constants.js";
import { validateRequest } from "../utils/validations.js";
import { createPostSchema, updatePostSchema, listPostsQuerySchema, postIdParamSchema, postIdParamForCommentsSchema, } from "../validations/postValidation.js";
import { postService } from "../services/postService.js";
import { handleAppError } from "../utils/errors.js";
import { uploadImageToCloudinary } from "../services/cloudinaryService.js";
const { INTERNAL_SERVER_ERROR, OK, NOT_FOUND, CREATED, UNAUTHORIZED } = HTTP_STATUS;
const { UNABLE_TO_CREATE_POST, UNABLE_TO_FETCH_POST, POST_NOT_FOUND, UNABLE_TO_FETCH_POST_COMMENTS, UNABLE_TO_DELETE_POST, UNABLE_TO_UPDATE_POST, ACCESS_TOKEN_REQUIRED } = ERROR_MESSAGES;
const { POST_CREATED, POST_UPDATED, POST_DELETED, } = SUCCESS_MESSAGES;
/**
 * Creates a new post
 *
 * @param req - Express request object containing post data (multipart/form-data)
 * @param res - Express response object
 * @returns Promise that resolves when response is sent
 * @throws {400} If title or body are missing or file validation fails
 * @throws {500} If there's an error during the creation process
 */
export async function create(req, res) {
    // Type guard: Ensure user exists
    if (!req.user) {
        res.status(UNAUTHORIZED).send({
            data: { message: ACCESS_TOKEN_REQUIRED },
        });
        return;
    }
    const validatedBody = validateRequest(createPostSchema, req.body, res);
    if (!validatedBody)
        return;
    const { title, body, status } = validatedBody;
    const { id: userId } = req.user;
    let imageUrl = null;
    let imagePublicId = null;
    try {
        // If file was uploaded, upload to Cloudinary
        if (req.file) {
            const uploadResult = await uploadImageToCloudinary(req.file.buffer, "blog/posts", req.file.originalname);
            const { secure_url, public_id } = uploadResult;
            imageUrl = secure_url;
            imagePublicId = public_id;
        }
        const result = await postService.createPost({
            authUserId: userId,
            data: {
                title,
                body,
                status,
            },
            image: imageUrl,
            imagePublicId,
        });
        const { data } = result;
        if (!data) {
            throw new Error("Post creation result missing data");
        }
        res.status(CREATED).send({
            data,
            message: POST_CREATED,
        });
    }
    catch (err) {
        if (handleAppError(err, res, ERROR_MESSAGES))
            return;
        console.error(err);
        res.status(INTERNAL_SERVER_ERROR).send({
            data: { message: UNABLE_TO_CREATE_POST },
        });
    }
}
/**
 * Gets paginated list of posts with optional search and filtering
 *
 * @param req - Express request object with query parameters for pagination and filtering
 * @param res - Express response object
 * @returns Promise that resolves when response is sent
 * @throws {500} If there's an error during the retrieval process
 */
export async function list(req, res) {
    const validatedQuery = validateRequest(listPostsQuerySchema, req.query, res, { convert: true });
    if (!validatedQuery)
        return;
    // Joi validation ensures page and limit are always present (defaults applied)
    const { page, limit, search, userId, status } = validatedQuery;
    try {
        const result = await postService.listPosts({
            page: page,
            limit: limit,
            search,
            userId,
            status,
        });
        const { rows: items, meta } = result;
        res.status(OK).send({
            data: {
                items,
                meta,
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(INTERNAL_SERVER_ERROR).send({
            message: UNABLE_TO_FETCH_POST,
        });
    }
}
/**
 * Gets a specific post by ID
 *
 * @param req - Express request object with post ID in params
 * @param res - Express response object
 * @returns Promise that resolves when response is sent
 * @throws {404} If the post is not found
 * @throws {500} If there's an error during the retrieval process
 */
export async function get(req, res) {
    try {
        const validatedParams = validateRequest(postIdParamSchema, req.params, res, { convert: true });
        if (!validatedParams)
            return;
        const { id } = validatedParams;
        const post = await postService.findPostWithAuthor(id);
        if (!post) {
            res.status(NOT_FOUND).send({
                data: { message: POST_NOT_FOUND },
            });
            return;
        }
        res.status(OK).send({ data: post });
    }
    catch (error) {
        console.error(error);
        res.status(INTERNAL_SERVER_ERROR).send({
            message: UNABLE_TO_FETCH_POST,
        });
    }
}
/**
 * Gets all comments for a specific post with nested replies
 *
 * @param req - Express request object with post ID in params and pagination in query
 * @param res - Express response object
 * @returns Promise that resolves when response is sent
 * @throws {400} If the post ID is invalid
 * @throws {404} If the post is not found
 * @throws {500} If there's an error during the retrieval process
 */
export async function listForPost(req, res) {
    const validatedParams = validateRequest(postIdParamForCommentsSchema, req.params, res, { convert: true });
    if (!validatedParams)
        return;
    const { postId } = validatedParams;
    const validatedQuery = validateRequest(listPostsQuerySchema, req.query, res, { convert: true });
    if (!validatedQuery)
        return;
    // Joi validation ensures page and limit are always present (defaults applied)
    const { page, limit } = validatedQuery;
    try {
        const result = await postService.getPostWithComments({
            postId,
            page: page,
            limit: limit,
        });
        const { post, comments, meta } = result;
        if (!post) {
            res.status(NOT_FOUND).send({
                data: { message: POST_NOT_FOUND },
            });
            return;
        }
        res.status(OK).send({
            data: {
                post,
                comments,
                meta,
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(INTERNAL_SERVER_ERROR).send({
            message: UNABLE_TO_FETCH_POST_COMMENTS,
        });
    }
}
/**
 * Updates a post's content and status
 *
 * @param req - Express request object with post ID in params and updated data in body
 * @param res - Express response object
 * @returns Promise that resolves when response is sent
 * @throws {403} If the user is not the owner of the post
 * @throws {404} If the post is not found
 * @throws {500} If there's an error during the update process
 */
export async function update(req, res) {
    try {
        // Type guard: Ensure user exists
        if (!req.user) {
            res.status(UNAUTHORIZED).send({
                data: { message: ACCESS_TOKEN_REQUIRED },
            });
            return;
        }
        const validatedParams = validateRequest(postIdParamSchema, req.params, res, { convert: true });
        if (!validatedParams)
            return;
        const { id: postId } = validatedParams;
        const { id: userId } = req.user;
        const validatedBody = validateRequest(updatePostSchema, req.body, res);
        if (!validatedBody)
            return;
        // Filter out undefined values - only include fields that were actually provided
        const updateData = Object.fromEntries(Object.entries(validatedBody).filter(([_, value]) => value !== undefined));
        // Pass validated data to service - service will handle all image-related business logic
        const fileBuffer = req.file ? req.file.buffer : null;
        const fileName = req.file ? req.file.originalname : null;
        const result = await postService.updatePostForUser({
            postId,
            authUserId: userId,
            data: updateData,
            fileBuffer,
            fileName,
        });
        const { data } = result;
        if (!data) {
            throw new Error("Update result missing data");
        }
        res.status(OK).send({
            data,
            message: POST_UPDATED,
        });
    }
    catch (err) {
        if (handleAppError(err, res, ERROR_MESSAGES))
            return;
        console.error(err);
        res.status(INTERNAL_SERVER_ERROR).send({
            data: { message: UNABLE_TO_UPDATE_POST },
        });
    }
}
/**
 * Deletes a post by ID
 *
 * @param req - Express request object with post ID in params
 * @param res - Express response object
 * @returns Promise that resolves when response is sent
 * @throws {403} If the user is not the owner of the post
 * @throws {404} If the post is not found
 * @throws {500} If there's an error during the deletion process
 */
export async function remove(req, res) {
    try {
        // Type guard: Ensure user exists
        if (!req.user) {
            res.status(UNAUTHORIZED).send({
                data: { message: ACCESS_TOKEN_REQUIRED },
            });
            return;
        }
        const { id: userId } = req.user;
        const validatedParams = validateRequest(postIdParamSchema, req.params, res, { convert: true });
        if (!validatedParams)
            return;
        const { id } = validatedParams;
        await postService.deletePostForUser({ postId: id, authUserId: userId });
        // Return a JSON message so clients can see confirmation
        res.status(OK).send({
            data: { message: POST_DELETED },
        });
    }
    catch (err) {
        if (handleAppError(err, res, ERROR_MESSAGES))
            return;
        console.error(err);
        res.status(INTERNAL_SERVER_ERROR).send({
            data: { message: UNABLE_TO_DELETE_POST },
        });
    }
}
//# sourceMappingURL=postController.js.map