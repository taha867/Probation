import { AppDataSource } from "../config/data-source.js";
import { User } from "../entities/User.js";
import { HTTP_STATUS, USER_STATUS } from "../utils/constants.js";
import { AppError } from "../utils/errors.js";
import { signToken, verifyToken } from "../utils/jwt.js";
import { comparePassword } from "../utils/bcrypt.js";
import { emailService } from "./emailService.js";
import { UserRepository } from "../repositories/index.js";
// All interfaces imported from barrel export (index.ts)
import type {
  // Common interfaces
  ServiceResult,
  // Auth interfaces
  AuthenticationResult,
  TokenRefreshResult,
  AccessRefreshTokenPayload,
  SignUpInput,
  SignInInput,
  PasswordResetTokenResult,
} from "../interfaces/index.js";

const { UNPROCESSABLE_ENTITY, UNAUTHORIZED, NOT_FOUND } = HTTP_STATUS;
const { LOGGED_IN, LOGGED_OUT } = USER_STATUS;

export class AuthService {
  /**
   * User repository instance
   * Used for database operations on User table
   */
  private userRepo: UserRepository;

  constructor(userRepo?: UserRepository) {
    // Dependency injection for testability
    this.userRepo = userRepo || new UserRepository(AppDataSource);
  }

  /**
   * Register a new user account
   * Checks for existing user with same email or phone before creating
   * 
   * @param input - User registration data
   * @returns Promise resolving to success response
   * @throws AppError if user already exists
   */
  async registerUser(input: SignUpInput): Promise<ServiceResult<void>> {
    const { name, email, phone, password, image } = input;

    // Use repository method instead of direct query
    const exists = await this.userRepo.existsByEmailOrPhone(email, phone || undefined);

    if (exists) {
      // Service throws a domain error; controller decides how to respond
      throw new AppError("USER_ALREADY_EXISTS", UNPROCESSABLE_ENTITY);
    }

    // Create user (password hashing happens in @BeforeInsert hook)
    const user = new User();
    user.name = name;
    user.email = email;
    user.password = password; // Will be hashed automatically
    user.phone = phone || null;
    user.image = image || null;
    user.status = LOGGED_OUT;

    await this.userRepo.save(user);

    return { ok: true };
  }

  /**
   * Authenticate a user and generate JWT tokens
   * Validates credentials and returns user data with access/refresh tokens
   * 
   * @param input - User credentials (email or phone + password)
   * @returns Promise resolving to authentication result with tokens
   * @throws AppError if credentials are invalid
   */
  async authenticateUser(
    input: SignInInput
  ): Promise<AuthenticationResult> {
    const { email, phone, password } = input;

    // Use repository method for authentication
    const user = await this.userRepo.findByEmailOrPhone(email, phone);

    if (!user) {
      throw new AppError("INVALID_CREDENTIALS", UNAUTHORIZED);
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new AppError("INVALID_CREDENTIALS", UNAUTHORIZED);
    }

    // Update user
    user.status = LOGGED_IN;
    user.lastLoginAt = new Date();
    await this.userRepo.save(user);

    // Destructure user properties
    const {
      id,
      name,
      email: userEmail,
      phone: userPhone,
      status: userStatus,
      image,
      tokenVersion = 0,
    } = user;

    const accessToken = signToken(
      {
        userId: id,
        email: userEmail,
        tokenVersion,
        type: "access",
      },
      { expiresIn: "15m" }
    );

    const refreshToken = signToken(
      { userId: id, tokenVersion, type: "refresh" },
      { expiresIn: "7d" }
    );

    return {
      ok: true,
      data: {
        user: {
          id,
          name,
          email: userEmail,
          phone: userPhone,
          image: image ?? null,
          status: userStatus,
        },
        accessToken,
        refreshToken,
      },
    };
  }

  /**
   * Logout a user by updating their status
   * Increments tokenVersion to invalidate all existing tokens
   * 
   * @param userId - ID of the user to logout
   * @returns Promise resolving to success response
   * @throws AppError if user is not found
   */
  async logoutUser(userId: number): Promise<ServiceResult<void>> {
    const user = await this.userRepo.findById(userId);

    if (!user) {
      throw new AppError("USER_NOT_FOUND", NOT_FOUND);
    }

    const { tokenVersion = 0 } = user;

    user.status = LOGGED_OUT;
    user.tokenVersion = tokenVersion + 1;
    await this.userRepo.save(user);

    return { ok: true };
  }

  /**
   * Verify refresh token and generate new access token
   * Validates token signature, expiration, and token version
   * 
   * @param refreshToken - JWT refresh token string
   * @returns Promise resolving to new access token
   * @throws AppError if token is invalid, expired, or user not found
   */
  async verifyAndRefreshToken(
    refreshToken: string
  ): Promise<TokenRefreshResult> {
    let decoded;
    try {
      decoded = verifyToken(refreshToken);
    } catch (error: unknown) {
      // Type guard: Check if error is TokenExpiredError
      if (error instanceof Error && error.name === "TokenExpiredError") {
        throw new AppError("REFRESH_TOKEN_EXPIRED", UNAUTHORIZED);
      }
      throw new AppError("INVALID_REFRESH_TOKEN", UNAUTHORIZED);
    }

    if (decoded.type !== "refresh") {
      throw new AppError("INVALID_REFRESH_TOKEN", UNAUTHORIZED);
    }

    const user = await this.userRepo.findById(decoded.userId);

    if (!user) {
      throw new AppError("USER_NOT_FOUND", NOT_FOUND);
    }

    const {
      id,
      email,
      tokenVersion = 0,
    } = user;

    // Type guard: Check if decoded token is AccessRefreshTokenPayload
    const refreshPayload = decoded as AccessRefreshTokenPayload;
    if (tokenVersion !== refreshPayload.tokenVersion) {
      throw new AppError("INVALID_REFRESH_TOKEN", UNAUTHORIZED);
    }

    const accessToken = signToken(
      {
        userId: id,
        email,
        tokenVersion,
        type: "access",
      },
      { expiresIn: "15m" }
    );

    return {
      ok: true,
      data: {
        accessToken,
      },
    };
  }

  /**
   * Create password reset token and send email
   * Generates JWT token and sends password reset email to user
   * Returns success even if user not found (security best practice)
   * 
   * @param email - User's email address
   * @returns Promise resolving to result indicating if email was sent
   * @throws AppError if email sending fails
   */
  async createPasswordResetToken(
    email: string
  ): Promise<PasswordResetTokenResult> {
    const user = await this.userRepo.findByEmail(email);

    if (!user) {
      // Return success even if user not found (security best practice)
      // Don't reveal whether email exists in system
      return { ok: true, data: { emailSent: false } };
    }

    const {
      id: userId,
      name = "User",
    } = user;

    const resetToken = signToken(
      { userId, type: "password_reset" },
      { expiresIn: "1h" }
    );

    try {
      // Send password reset email
      await emailService.sendPasswordResetEmail(email, resetToken, name);

      return { ok: true, data: { emailSent: true } };
    } catch (error: unknown) {
      console.error("Failed to send password reset email:", error);
      throw new AppError(
        "EMAIL_SEND_FAILED",
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Reset user password using reset token
   * Validates token and updates user password
   * 
   * @param token - Password reset JWT token
   * @param newPassword - New password to set
   * @returns Promise resolving to success response
   * @throws AppError if token is invalid, expired, or user not found
   */
  async resetUserPassword(
    token: string,
    newPassword: string
  ): Promise<ServiceResult<void>> {
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (error: unknown) {
      // Type guard: Check if error is TokenExpiredError
      if (error instanceof Error && error.name === "TokenExpiredError") {
        throw new AppError("RESET_TOKEN_EXPIRED", UNAUTHORIZED);
      }
      throw new AppError("INVALID_RESET_TOKEN", UNAUTHORIZED);
    }

    if (decoded.type !== "password_reset") {
      throw new AppError("INVALID_RESET_TOKEN", UNAUTHORIZED);
    }

    const user = await this.userRepo.findById(decoded.userId);

    if (!user) {
      throw new AppError("USER_NOT_FOUND", NOT_FOUND);
    }

    user.password = newPassword; // Will be hashed in @BeforeUpdate hook
    await this.userRepo.save(user);

    return { ok: true };
  }
}

// Export singleton instance
export const authService = new AuthService();
