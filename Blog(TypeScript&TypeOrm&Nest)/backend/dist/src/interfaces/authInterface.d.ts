import type { ServiceResult } from "./commonInterface.js";
import type { PublicUserProfile } from "./userInterface.js";
/**
 * JWT token payload structure
 * Decoded JWT token content
 * Base interface - extended for specific token types
 */
export interface TokenPayload {
    userId: number;
    type: "access" | "refresh" | "password_reset";
    iat?: number;
    exp?: number;
}
/**
 * Access/Refresh token payload
 * Includes tokenVersion for token invalidation
 */
export interface AccessRefreshTokenPayload extends TokenPayload {
    type: "access" | "refresh";
    tokenVersion: number;
    email?: string;
}
/**
 * Sign up input type
 * Matches the structure validated by signUpSchema
 */
export interface SignUpInput {
    name: string;
    email: string;
    phone: string;
    password: string;
    image?: string | null;
}
/**
 * Sign in input type
 * Matches the structure validated by signInSchema
 * Either email or phone must be provided
 */
export interface SignInInput {
    email?: string;
    phone?: string;
    password: string;
}
/**
 * Forgot password input type
 * Matches the structure validated by forgotPasswordSchema
 */
export interface ForgotPasswordInput {
    email: string;
}
/**
 * Reset password input type
 * Matches the structure validated by resetPasswordSchema
 */
export interface ResetPasswordInput {
    token: string;
    newPassword: string;
    confirmPassword: string;
}
/**
 * Refresh token input type
 * Matches the structure validated by refreshTokenSchema
 */
export interface RefreshTokenInput {
    refreshToken: string;
}
/**
 * Authentication result data payload
 * Data structure returned after successful user authentication
 * Reuses PublicUserProfile DTO from userInterface for consistency
 */
export interface AuthenticationResultData {
    user: PublicUserProfile;
    accessToken: string;
    refreshToken: string;
}
/**
 * Authentication result from service
 * Returned after successful user authentication
 * Uses ServiceResult<T> DTO for consistency
 */
export type AuthenticationResult = ServiceResult<AuthenticationResultData>;
/**
 * Token refresh result data payload
 * Data structure returned after successful token refresh
 */
export interface TokenRefreshResultData {
    accessToken: string;
}
/**
 * Token refresh result from service
 * Returned after successful token refresh
 * Uses ServiceResult<T> DTO for consistency
 */
export type TokenRefreshResult = ServiceResult<TokenRefreshResultData>;
/**
 * Password reset token creation result data payload
 * Data structure indicating whether email was sent successfully
 */
export interface PasswordResetTokenResultData {
    emailSent: boolean;
}
/**
 * Password reset token creation result
 * Returned after password reset token creation
 * Indicates whether email was sent successfully
 * Uses ServiceResult<T> DTO for consistency
 */
export type PasswordResetTokenResult = ServiceResult<PasswordResetTokenResultData>;
//# sourceMappingURL=authInterface.d.ts.map