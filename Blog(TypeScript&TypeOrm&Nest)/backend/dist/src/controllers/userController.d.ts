import { Request, Response } from "express";
/**
 * Gets paginated list of all users
 *
 * @param req - Express request object with pagination query parameters
 * @param res - Express response object
 * @returns Promise that resolves when response is sent
 * @throws {500} If there's an error during the retrieval process
 */
export declare function list(req: Request, res: Response): Promise<void>;
/**
 * Gets the current authenticated user's profile
 *
 * @param req - Express request object with authenticated user from JWT token
 * @param res - Express response object
 * @returns Promise that resolves when response is sent
 * @throws {404} If the user is not found
 * @throws {500} If there's an error during the retrieval process
 */
export declare function getCurrentUser(req: Request, res: Response): Promise<void>;
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
export declare function getUserPostsWithComment(req: Request, res: Response): Promise<void>;
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
export declare function update(req: Request, res: Response): Promise<void>;
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
export declare function remove(req: Request, res: Response): Promise<void>;
//# sourceMappingURL=userController.d.ts.map