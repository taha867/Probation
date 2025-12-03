import { Op } from "sequelize";
import models from "../models/index.js";
import { httpStatus, userStatus } from "../utils/constants.js";
import { AppError } from "../utils/errors.js";
import { signToken, verifyToken } from "../utils/jwt.js";
import { comparePassword } from "../utils/bcrypt.js";

export class AuthService {
  constructor(models) {
    this.User = models.User;
  }

  async registerUser({ name, email, phone, password }) {
    const existing = await this.User.findOne({
      where: { [Op.or]: [{ phone }, { email }] },
    });

    if (existing) {
      // Service throws a domain error; controller decides how to respond.
      throw new AppError("USER_ALREADY_EXISTS", httpStatus.UNPROCESSABLE_ENTITY);
    }

    await this.User.create({
      name,
      email,
      password,
      phone,
      status: userStatus.LOGGED_OUT,
    });

    return { ok: true };
  }

  async authenticateUser({ email, phone, password }) {
    const user = await this.User.findOne({
      where: email ? { email } : { phone },
    });
    if (!user) {
      throw new AppError("INVALID_CREDENTIALS", httpStatus.UNAUTHORIZED);
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new AppError("INVALID_CREDENTIALS", httpStatus.UNAUTHORIZED);
    }

    await user.update({
      status: userStatus.LOGGED_IN,
      last_login_at: new Date(),
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

    const { id, name, email: userEmail, phone: userPhone, status } = user;
    return {
      ok: true,
      user: {
        id,
        name,
        email: userEmail,
        phone: userPhone,
        status,
      },
      accessToken,
      refreshToken,
    };
  }

  async logoutUser(userId) {
    const user = await this.User.findByPk(userId);
    if (!user) {
      throw new AppError("USER_NOT_FOUND", httpStatus.NOT_FOUND);
    }

    await user.update({
      status: userStatus.LOGGED_OUT,
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
        throw new AppError("REFRESH_TOKEN_EXPIRED", httpStatus.UNAUTHORIZED);
      }
      throw new AppError("INVALID_REFRESH_TOKEN", httpStatus.UNAUTHORIZED);
    }

    if (decoded.type !== "refresh") {
      throw new AppError("INVALID_REFRESH_TOKEN", httpStatus.UNAUTHORIZED);
    }

    const user = await this.User.findByPk(decoded.userId);
    if (!user) {
      throw new AppError("USER_NOT_FOUND", httpStatus.NOT_FOUND);
    }

    if (user.tokenVersion !== decoded.tokenVersion) {
      throw new AppError("INVALID_REFRESH_TOKEN", httpStatus.UNAUTHORIZED);
    }

    const accessToken = signToken(
      {
        userId: user.id,
        email: user.email,
        tokenVersion: user.tokenVersion,
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
      return { ok: true, userFound: false, resetToken: null };
    }

    const resetToken = signToken(
      { userId: user.id, type: "password_reset" },
      { expiresIn: "1h" }
    );

    return { ok: true, userFound: true, resetToken };
  }

  async resetUserPassword(token, newPassword) {
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw new AppError("RESET_TOKEN_EXPIRED", httpStatus.UNAUTHORIZED);
      }
      throw new AppError("INVALID_RESET_TOKEN", httpStatus.UNAUTHORIZED);
    }

    if (decoded.type !== "password_reset") {
      throw new AppError("INVALID_RESET_TOKEN", httpStatus.UNAUTHORIZED);
    }

    const user = await this.User.findByPk(decoded.userId);
    if (!user) {
      throw new AppError("USER_NOT_FOUND", httpStatus.NOT_FOUND);
    }

    await user.update({ password: newPassword });

    return { ok: true };
  }
}

export const authService = new AuthService(models);
