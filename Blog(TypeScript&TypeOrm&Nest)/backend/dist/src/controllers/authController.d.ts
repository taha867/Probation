import { Request, Response } from "express";
/**
 * Registers a new user account
 * @param req - Express request object containing user registration data
 * @param res - Express response object
 * @returns Promise that resolves when response is sent
 * @throws {422} If email or phone already exists in the database
 * @throws {500} If there's an error during the registration process
 */
export declare function signUp(req: Request, res: Response): Promise<void>;
/**
 * Authenticates a user and generates a JWT token
 * @param req - Express request object containing login credentials
 * @param res - Express response object
 * @returns Promise that resolves when response is sent
 * @throws {400} If password or both email and phone are missing
 * @throws {401} If invalid credentials are provided
 * @throws {500} If there's an error during the authentication process
 */
export declare function signIn(req: Request, res: Response): Promise<void>;
/**
 * Logs out a user by updating their status to "logged out"
 * @param req - Express request object (must have authenticated user)
 * @param res - Express response object
 * @returns Promise that resolves when response is sent
 * @throws {404} If the user is not found
 * @throws {500} If there's an error during the logout process
 */
export declare function signOut(req: Request, res: Response): Promise<void>;
/**
 * Refreshes an access token using a valid refresh token
 * @param req - Express request object containing refresh token
 * @param res - Express response object
 * @returns Promise that resolves when response is sent
 * @throws {400} If refreshToken is missing
 * @throws {401} If refresh token is invalid, expired, or revoked
 * @throws {404} If user is not found
 * @throws {500} If there's an error during the refresh process
 */
export declare function refreshToken(req: Request, res: Response): Promise<void>;
/**
 * Generates a password reset token and sends it to the user's email
 * @param req - Express request object containing user email
 * @param res - Express response object
 * @returns Promise that resolves when response is sent
 * @throws {400} If email is missing
 * @throws {500} If there's an error during the process or email sending fails
 */
export declare function forgotPassword(req: Request, res: Response): Promise<void>;
/**
 * Resets user password using a valid reset token
 * @param req - Express request object containing reset token and new password
 * @param res - Express response object
 * @returns Promise that resolves when response is sent
 * @throws {400} If token or newPassword is missing
 * @throws {401} If reset token is invalid or expired
 * @throws {404} If user is not found
 * @throws {500} If there's an error during the reset process
 */
export declare function resetPassword(req: Request, res: Response): Promise<void>;
//# sourceMappingURL=authController.d.ts.map