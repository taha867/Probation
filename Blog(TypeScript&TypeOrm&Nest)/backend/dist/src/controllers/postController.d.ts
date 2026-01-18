import { Request, Response } from "express";
/**
 * Creates a new post
 *
 * @param req - Express request object containing post data (multipart/form-data)
 * @param res - Express response object
 * @returns Promise that resolves when response is sent
 * @throws {400} If title or body are missing or file validation fails
 * @throws {500} If there's an error during the creation process
 */
export declare function create(req: Request, res: Response): Promise<void>;
/**
 * Gets paginated list of posts with optional search and filtering
 *
 * @param req - Express request object with query parameters for pagination and filtering
 * @param res - Express response object
 * @returns Promise that resolves when response is sent
 * @throws {500} If there's an error during the retrieval process
 */
export declare function list(req: Request, res: Response): Promise<void>;
/**
 * Gets a specific post by ID
 *
 * @param req - Express request object with post ID in params
 * @param res - Express response object
 * @returns Promise that resolves when response is sent
 * @throws {404} If the post is not found
 * @throws {500} If there's an error during the retrieval process
 */
export declare function get(req: Request, res: Response): Promise<void>;
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
export declare function listForPost(req: Request, res: Response): Promise<void>;
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
export declare function update(req: Request, res: Response): Promise<void>;
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
export declare function remove(req: Request, res: Response): Promise<void>;
//# sourceMappingURL=postController.d.ts.map