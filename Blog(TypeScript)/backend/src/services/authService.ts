import { Op } from "sequelize";
import { ModelStatic, Model } from "sequelize";
import models from "../models/index.js";
import { HTTP_STATUS, USER_STATUS } from "../utils/constants.js";
import { AppError } from "../utils/errors.js";
import { signToken, verifyToken } from "../utils/jwt.js";
import { comparePassword } from "../utils/bcrypt.js";
import { emailService } from "./emailService.js";
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
  // User interfaces
  AuthUserData,
  UserTokenVersion,
  UserIdEmailToken,
  UserIdAndName,
} from "../interfaces/index.js";
import { DatabaseModels } from "../models/index.js";

const { UNPROCESSABLE_ENTITY, UNAUTHORIZED, NOT_FOUND } = HTTP_STATUS;
const { LOGGED_IN, LOGGED_OUT } = USER_STATUS;

/**
 * in sequelize Models are loaded dynamically at runtime,
 * TypeScript doesn't know:
-> That models.User exists
-> What methods models.User has
-> The return types of those methods
          create a type that describes the methods used
 */
type UserModel = ModelStatic<Model<any, any>> & {
  findOne: (options?: any) => Promise<Model<any, any> | null>;
  findByPk: (id: number) => Promise<Model<any, any> | null>;
  create: (values: any) => Promise<Model<any, any>>;
};


export class AuthService {
  /**
   * User model instance
   * Used for database operations on User table
   */
  private User: UserModel;

  
  constructor(models: DatabaseModels) {
    // Type assertion: We know User exists in models
    this.User = models.User as UserModel;
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

    const existing = await this.User.findOne({
      where: { [Op.or]: [{ phone }, { email }] },
    });

    if (existing) {
      // Service throws a domain error; controller decides how to respond
      throw new AppError("USER_ALREADY_EXISTS", UNPROCESSABLE_ENTITY);
    }

    await this.User.create({
      name,
      email,
      password,
      phone,
      image,
      status: LOGGED_OUT,
    });

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

    const user = await this.User.findOne({
      where: email ? { email } : { phone },
    });

    if (!user) {
      throw new AppError("INVALID_CREDENTIALS", UNAUTHORIZED);
    }

    // Type assertion: We know user has password property
    const userPassword = (user.get("password") as string) || "";
    const isPasswordValid = await comparePassword(password, userPassword);

    if (!isPasswordValid) {
      throw new AppError("INVALID_CREDENTIALS", UNAUTHORIZED);
    }

    await user.update({
      status: LOGGED_IN,
      lastLoginAt: new Date(),
    });

    // Convert Sequelize model to plain object and destructure all properties at once
    // Note: email/phone from input are no longer needed after this point
    // Reuses AuthUserData interface to avoid redundant type definitions
    const {
      id,
      name,
      email: userEmail,
      phone: userPhone,
      status: userStatus,
      image,
      tokenVersion = 0,
    } = user.get() as AuthUserData;

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
    const user = await this.User.findByPk(userId);

    if (!user) {
      throw new AppError("USER_NOT_FOUND", NOT_FOUND);
    }

    // Destructure tokenVersion from user data
    // Reuses UserTokenVersion type to avoid redundant type definitions
    const { tokenVersion = 0 } = user.get() as UserTokenVersion;

    await user.update({
      status: LOGGED_OUT,
      tokenVersion: tokenVersion + 1,
    });

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

    const user = await this.User.findByPk(decoded.userId);

    if (!user) {
      throw new AppError("USER_NOT_FOUND", NOT_FOUND);
    }

    // Destructure all needed properties from user at once
    // Reuses UserIdEmailToken type to avoid redundant type definitions
    const {
      id,
      email,
      tokenVersion = 0,
    } = user.get() as UserIdEmailToken;

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
    const user = await this.User.findOne({ where: { email } });

    if (!user) {
      // Return success even if user not found (security best practice)
      // Don't reveal whether email exists in system
      return { ok: true, data: { emailSent: false } };
    }

    // Destructure user properties at once
    // Reuses UserIdAndName type to avoid redundant type definitions
    const {
      id: userId,
      name = "User",
    } = user.get() as UserIdAndName;

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

    const user = await this.User.findByPk(decoded.userId);

    if (!user) {
      throw new AppError("USER_NOT_FOUND", NOT_FOUND);
    }

    await user.update({ password: newPassword });

    return { ok: true };
  }
}

// Export singleton instance
export const authService = new AuthService(models);

