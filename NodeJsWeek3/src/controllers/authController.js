import {
  httpStatus,
  successMessages,
  errorMessages,
} from "../utils/constants.js";
import { validateRequest } from "../middleware/validationMiddleware.js";
import {
  signUpSchema,
  signInSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  refreshTokenSchema,
} from "../validations/authValidation.js";
import {
  registerUser,
  authenticateUser,
  logoutUser,
  verifyAndRefreshToken,
  createPasswordResetToken,
  resetUserPassword,
} from "../services/authService.js";

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
  const validatedBody = validateRequest(signUpSchema, req.body, res);
  if (!validatedBody) return;
  const { email, password, name, phone } = validatedBody;
  try {
    const result = await registerUser({ name, email, phone, password });
    if (!result.ok && result.reason === "USER_ALREADY_EXISTS") {
      return res
        .status(httpStatus.UNPROCESSABLE_ENTITY)
        .send({ message: errorMessages.userAlreadyExists });
    }

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
  const validatedBody = validateRequest(signInSchema, req.body, res);
  if (!validatedBody) return;
  const { email, phone, password } = validatedBody;

  try {
    const result = await authenticateUser({ email, phone, password });
    if (!result.ok && result.reason === "INVALID_CREDENTIALS") {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .send({ message: errorMessages.invalidCredentials });
    }

    const { user, accessToken, refreshToken } = result;
    const { id, name, email: userEmail, phone: userPhone, status } = user;
    return res.status(httpStatus.OK).send({
      message: successMessages.signedIn,
      accessToken,
      refreshToken,
      user: {
        id,
        name,
        email: userEmail,
        phone: userPhone,
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
    const result = await logoutUser(authUser);
    if (!result.ok && result.reason === "USER_NOT_FOUND") {
      return res
        .status(httpStatus.NOT_FOUND)
        .send({ message: errorMessages.userNotFound });
    }

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
  const validatedBody = validateRequest(refreshTokenSchema, req.body, res);
  if (!validatedBody) return;
  const { refreshToken } = validatedBody;

  try {
    const result = await verifyAndRefreshToken(refreshToken);

    if (!result.ok) {
      if (result.reason === "REFRESH_TOKEN_EXPIRED") {
        return res.status(httpStatus.UNAUTHORIZED).send({
          message: errorMessages.refreshTokenExpired,
        });
      }
      if (result.reason === "USER_NOT_FOUND") {
        return res.status(httpStatus.NOT_FOUND).send({
          message: errorMessages.userNotFound,
        });
      }
      return res.status(httpStatus.UNAUTHORIZED).send({
        message: errorMessages.invalidRefreshToken,
      });
    }

    return res.status(httpStatus.OK).send({
      message: successMessages.tokenRefreshed,
      accessToken: result.accessToken,
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
  const validatedBody = validateRequest(forgotPasswordSchema, req.body, res);
  if (!validatedBody) return;
  const { email } = validatedBody;

  try {
    const result = await createPasswordResetToken(email);

    return res.status(httpStatus.OK).send({
      message: successMessages.resetTokenSent,
      resetToken: result.resetToken ?? undefined,
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
  const validatedBody = validateRequest(resetPasswordSchema, req.body, res);
  if (!validatedBody) return;
  const { token, newPassword } = validatedBody;

  try {
    const result = await resetUserPassword(token, newPassword);

    if (!result.ok) {
      if (result.reason === "RESET_TOKEN_EXPIRED") {
        return res.status(httpStatus.UNAUTHORIZED).send({
          message: errorMessages.resetTokenExpired,
        });
      }
      if (result.reason === "RESET_TOKEN_INVALID") {
        return res.status(httpStatus.UNAUTHORIZED).send({
          message: errorMessages.invalidResetToken,
        });
      }
      if (result.reason === "USER_NOT_FOUND") {
        return res.status(httpStatus.NOT_FOUND).send({
          message: errorMessages.userNotFound,
        });
      }
    }

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
