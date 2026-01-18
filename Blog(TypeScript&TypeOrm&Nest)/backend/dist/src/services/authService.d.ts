import { UserRepository } from "../repositories/index.js";
import type { ServiceResult, AuthenticationResult, TokenRefreshResult, SignUpInput, SignInInput, PasswordResetTokenResult } from "../interfaces/index.js";
export declare class AuthService {
    /**
     * The service needs a repository to talk to the database.
     * The constructor says: "If you give me a repository, I'll use it. Otherwise, I'll create one myself."
     * This lets you swap the repository when needed (e.g., for tests).
     */
    private userRepo;
    constructor(userRepo?: UserRepository);
    /**
     * Register a new user account
     * Checks for existing user with same email or phone before creating
     *
     * @param input - User registration data
     * @returns Promise resolving to success response
     * @throws AppError if user already exists
     */
    registerUser(input: SignUpInput): Promise<ServiceResult<void>>;
    /**
     * Authenticate a user and generate JWT tokens
     * Validates credentials and returns user data with access/refresh tokens
     *
     * @param input - User credentials (email or phone + password)
     * @returns Promise resolving to authentication result with tokens
     * @throws AppError if credentials are invalid
     */
    authenticateUser(input: SignInInput): Promise<AuthenticationResult>;
    /**
     * Logout a user by updating their status
     * Increments tokenVersion to invalidate all existing tokens
     *
     * @param userId - ID of the user to logout
     * @returns Promise resolving to success response
     * @throws AppError if user is not found
     */
    logoutUser(userId: number): Promise<ServiceResult<void>>;
    /**
     * Verify refresh token and generate new access token
     * Validates token signature, expiration, and token version
     *
     * @param refreshToken - JWT refresh token string
     * @returns Promise resolving to new access token
     * @throws AppError if token is invalid, expired, or user not found
     */
    verifyAndRefreshToken(refreshToken: string): Promise<TokenRefreshResult>;
    /**
     * Create password reset token and send email
     * Generates JWT token and sends password reset email to user
     * Returns success even if user not found (security best practice)
     *
     * @param email - User's email address
     * @returns Promise resolving to result indicating if email was sent
     * @throws AppError if email sending fails
     */
    createPasswordResetToken(email: string): Promise<PasswordResetTokenResult>;
    /**
     * Reset user password using reset token
     * Validates token and updates user password
     *
     * @param token - Password reset JWT token
     * @param newPassword - New password to set
     * @returns Promise resolving to success response
     * @throws AppError if token is invalid, expired, or user not found
     */
    resetUserPassword(token: string, newPassword: string): Promise<ServiceResult<void>>;
}
export declare const authService: AuthService;
//# sourceMappingURL=authService.d.ts.map