import { Request, Response } from "express";
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
export declare function create(req: Request, res: Response): Promise<void>;
/**
 * Gets all top-level comments, optionally filtered by post
 *
 * @param req - Express request object with query parameters for filtering
 * @param res - Express response object
 * @returns Promise that resolves when response is sent
 * @throws {500} If there's an error during the retrieval process
 */
export declare function list(req: Request, res: Response): Promise<void>;
/**
 * Gets a specific comment by ID with all related entities
 *
 * @param req - Express request object with comment ID in params
 * @param res - Express response object
 * @returns Promise that resolves when response is sent
 * @throws {404} If the comment is not found
 * @throws {500} If there's an error during the retrieval process
 */
export declare function get(req: Request, res: Response): Promise<void>;
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
export declare function update(req: Request, res: Response): Promise<void>;
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
export declare function remove(req: Request, res: Response): Promise<void>;
//# sourceMappingURL=commentController.d.ts.map