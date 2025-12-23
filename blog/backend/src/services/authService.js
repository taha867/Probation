import { Op } from "sequelize";
import models from "../models/index.js";
import { HTTP_STATUS, USER_STATUS } from "../utils/constants.js";
import { AppError } from "../utils/errors.js";
import { signToken, verifyToken } from "../utils/jwt.js";
import { comparePassword } from "../utils/bcrypt.js";
import { emailService } from "./emailService.js";

const { UNPROCESSABLE_ENTITY, UNAUTHORIZED, NOT_FOUND } = HTTP_STATUS;
const { LOGGED_IN, LOGGED_OUT } = USER_STATUS;

export class AuthService {
  constructor(models) {
    this.User = models.User;
  }

  async registerUser({ name, email, phone, password, image }) {
    const existing = await this.User.findOne({
      where: { [Op.or]: [{ phone }, { email }] },
    });

    if (existing) {
      // Service throws a domain error; controller decides how to respond.
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

  async authenticateUser({ email, phone, password }) {
    const user = await this.User.findOne({
      where: email ? { email } : { phone },
    });
    if (!user) {
      throw new AppError("INVALID_CREDENTIALS", UNAUTHORIZED);
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new AppError("INVALID_CREDENTIALS", UNAUTHORIZED);
    }

    await user.update({
      status: LOGGED_IN,
      lastLoginAt: new Date(),
    });

    const accessToken = signToken(
      {
        userId: user.id,
        email: user.email,
        tokenVersion: user.tokenVersion,
        type: "access",
      },
      { expiresIn: "15m" }
    );

    const refreshToken = signToken(
      { userId: user.id, tokenVersion: user.tokenVersion, type: "refresh" },
      { expiresIn: "7d" }
    );

    const {
      id,
      name,
      email: userEmail,
      phone: userPhone,
      status,
      image,
    } = user;
    return {
      ok: true,
      user: {
        id,
        name,
        email: userEmail,
        phone: userPhone,
        image,
        status,
      },
      accessToken,
      refreshToken,
    };
  }

  async logoutUser(userId) {
    const user = await this.User.findByPk(userId);
    if (!user) {
      throw new AppError("USER_NOT_FOUND", NOT_FOUND);
    }

    await user.update({
      status: LOGGED_OUT,
      tokenVersion: user.tokenVersion + 1,
    });

    return { ok: true };
  }

  async verifyAndRefreshToken(refreshToken) {
    let decoded;
    try {
      decoded = verifyToken(refreshToken);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
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

    if (user.tokenVersion !== decoded.tokenVersion) {
      throw new AppError("INVALID_REFRESH_TOKEN", UNAUTHORIZED);
    }
    const { id, email, tokenVersion } = user;
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
      accessToken,
    };
  }

  async createPasswordResetToken(email) {
    const user = await this.User.findOne({ where: { email } });

    if (!user) {
      // Return success even if user not found (security best practice)
      // Don't reveal whether email exists in system
      return { ok: true, emailSent: false };
    }

    const resetToken = signToken(
      { userId: user.id, type: "password_reset" },
      { expiresIn: "1h" }
    );

    try {
      // Send password reset email
      await emailService.sendPasswordResetEmail(email, resetToken, user.name);

      return { ok: true, emailSent: true };
    } catch (error) {
      console.error("Failed to send password reset email:", error);
      throw new AppError(
        "EMAIL_SEND_FAILED",
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }

  async resetUserPassword(token, newPassword) {
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
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

export const authService = new AuthService(models);
