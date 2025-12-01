import { Op } from "sequelize";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import model from "../models/index.js";
import {
  httpStatus,
  successMessages,
  errorMessages,
  userStatus,
} from "../utils/constants.js";

const { User } = model;

/**
 * Registers a new user account.
 * @param {Object} req.body - The request body containing user registration data.
 * @param {string} req.body.name - The name of the user.
 * @param {string} req.body.email - The email address of the user.
 * @param {string} req.body.phone - The phone number of the user.
 * @param {string} req.body.password - The password for the user account.
 * @returns {Object} Success message with 201 status code.
 * @throws {422} If email or phone already exists in the database.
 * @throws {500} If there's an error during the registration process.
 */
export async function signUp(req, res) {
  const { email, password, name, phone } = req.body;
  try {
    const user = await User.findOne({
      where: { [Op.or]: [{ phone }, { email }] }, //[op.or] used to check multiple parameters (or means either phone or email, in case of and it would be both email and phone no)
    });
    
    if (user) {
      return res
        .status(httpStatus.UNPROCESSABLE_ENTITY)
        .send({ message: errorMessages.userAlreadyExists });
    }

    //Model instance
    //does build + save for you, so the row is created in the database (async).
    await User.create({
      name,
      email,
      password,
      phone,
      status: userStatus.loggedOut,
    });

    return res
      .status(httpStatus.OK)
      .send({ message: successMessages.accountCreated });
  } catch (e) {
    console.log(e);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: errorMessages.operationFailed,
    });
  }
}

/**
 * Authenticates a user and generates a JWT token.
 * @param {Object} req.body - The request body containing login credentials.
 * @param {string} [req.body.email] - The email address of the user (optional if phone is provided).
 * @param {string} [req.body.phone] - The phone number of the user (optional if email is provided).
 * @param {string} req.body.password - The password for authentication.
 * @returns {Object} JWT token and user profile with 200 status code.
 * @throws {400} If password or both email and phone are missing.
 * @throws {401} If invalid credentials are provided.
 * @throws {500} If there's an error during the authentication process.
 */
export async function signIn(req, res) {
  const { email, phone, password } = req.body;

  try {
    const user = await User.findOne({
      where: email ? { email } : { phone },
    });

    if (!user) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .send({ message: errorMessages.invalidCredentials });
    }

    // Compare provided password with hashed password in database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .send({ message: errorMessages.invalidCredentials });
    }

    await user.update({
      status: userStatus.loggedIn,
      last_login_at: new Date(),
    });

    // Reload user to get updated status and tokenVersion
    await user.reload();

    // Generate Access Token (short-lived: 15 minutes)
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, type: "access" },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // Generate Refresh Token (long-lived: 7 days)
    const refreshToken = jwt.sign(
      { userId: user.id, tokenVersion: user.tokenVersion, type: "refresh" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const { id, name, email: userEmail, phone, status } = user;
    return res.status(httpStatus.OK).send({
      message: successMessages.signedIn,
      accessToken,
      refreshToken,
      user: {
        id,
        name,
        email: userEmail,
        phone,
        status,
      },
    });
  } catch (e) {
    console.log(e);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: errorMessages.operationFailed,
    });
  }
}

/**
 * Logs out a user by updating their status to "logged out".
 * @param {Object} req.user - The authenticated user from JWT token.
 * @returns {Object} Success message with 200 status code.
 * @throws {404} If the user is not found.
 * @throws {500} If there's an error during the logout process.
 */
export async function signOut(req, res) {
  try {
    const { id: authUser } = req.user;
    const user = await User.findByPk(authUser);

    if (!user) {
      return res
        .status(httpStatus.NOT_FOUND)
        .send({ message: errorMessages.userNotFound });
    }

    // Increment tokenVersion to invalidate all existing refresh tokens
    await user.update({
      status: userStatus.loggedOut,
      tokenVersion: user.tokenVersion + 1,
    });

    return res.status(httpStatus.OK).send({
      message: successMessages.loggedOut,
    });
  } catch (error) {
    console.error(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: errorMessages.operationFailed,
    });
  }
}

/**
 * Refreshes an access token using a valid refresh token.
 * @param {Object} req.body - The request body containing refresh token.
 * @param {string} req.body.refreshToken - The refresh token.
 * @returns {Object} New access token and optionally new refresh token with 200 status code.
 * @throws {400} If refreshToken is missing.
 * @throws {401} If refresh token is invalid, expired, or revoked.
 * @throws {404} If user is not found.
 * @throws {500} If there's an error during the refresh process.
 */
export async function refreshToken(req, res) {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: errorMessages.refreshTokenRequired,
    });
  }

  try {
    // Verify and decode the refresh token
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(httpStatus.UNAUTHORIZED).send({
          message: errorMessages.refreshTokenExpired,
        });
      }
      return res.status(httpStatus.UNAUTHORIZED).send({
        message: errorMessages.invalidRefreshToken,
      });
    }

    // Check if token is a refresh token
    if (decoded.type !== "refresh") {
      return res.status(httpStatus.UNAUTHORIZED).send({
        message: errorMessages.invalidRefreshToken,
      });
    }

    // Find user by userId from token
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return res.status(httpStatus.NOT_FOUND).send({
        message: errorMessages.userNotFound,
      });
    }

    // Check if token version matches (token is not revoked)
    if (user.tokenVersion !== decoded.tokenVersion) {
      return res.status(httpStatus.UNAUTHORIZED).send({
        message: errorMessages.invalidRefreshToken,
      });
    }

    // Generate new Access Token
    const newAccessToken = jwt.sign(
      { userId: user.id, email: user.email, type: "access" },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    return res.status(httpStatus.OK).send({
      message: successMessages.tokenRefreshed,
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: errorMessages.operationFailed,
    });
  }
}

/**
 * Generates a password reset token and sends it to the user's email.
 * @param {Object} req.body - The request body containing user email.
 * @param {string} req.body.email - The email address of the user.
 * @returns {Object} Success message with reset token (for testing) with 200 status code.
 * @throws {400} If email is missing.
 * @throws {404} If user with the provided email is not found.
 * @throws {500} If there's an error during the process.
 */
export async function forgotPassword(req, res) {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(httpStatus.OK).send({
        message: successMessages.resetTokenSent,
      });
    }

    // Generate password reset token (expires in 1 hour)
    const resetToken = jwt.sign(
      { userId: user.id, type: "password_reset" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(httpStatus.OK).send({
      message: successMessages.resetTokenSent,
      // Only return token in development for testing
      resetToken: resetToken,
    });
  } catch (error) {
    console.error(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: errorMessages.operationFailed,
    });
  }
}

/**
 * Resets user password using a valid reset token.
 * @param {Object} req.body - The request body containing reset token and new password.
 * @param {string} req.body.token - The password reset token.
 * @param {string} req.body.newPassword - The new password for the user account.
 * @param {string} req.body.confirmPassword - For password validation.
 * @returns {Object} Success message with 200 status code.
 * @throws {400} If token or newPassword is missing.
 * @throws {401} If reset token is invalid or expired.
 * @throws {404} If user is not found.
 * @throws {500} If there's an error during the reset process.
 */
export async function resetPassword(req, res) {
  const { token, newPassword } = req.body;

  try {
    // Verify and decode the reset token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(httpStatus.UNAUTHORIZED).send({
          message: errorMessages.resetTokenExpired,
        });
      }
      return res.status(httpStatus.UNAUTHORIZED).send({
        message: errorMessages.invalidResetToken,
      });
    }

    // Check if token is a password reset token
    if (decoded.type !== "password_reset") {
      return res.status(httpStatus.UNAUTHORIZED).send({
        message: errorMessages.invalidResetToken,
      });
    }

    // Find user by userId from token
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return res.status(httpStatus.NOT_FOUND).send({
        message: errorMessages.userNotFound,
      });
    }

    // Update password (bcrypt hook will hash it automatically)
    await user.update({ password: newPassword });

    return res.status(httpStatus.OK).send({
      message: successMessages.passwordReset,
    });
  } catch (error) {
    console.error(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: errorMessages.operationFailed,
    });
  }
}
