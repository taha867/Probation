import {
  HTTP_STATUS,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
} from "../utils/constants.js";
import { handleAppError } from "../utils/errors.js";
import { validateRequest } from "../utils/validations.js";
import {
  signUpSchema,
  signInSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  refreshTokenSchema,
} from "../validations/authValidation.js";
import { authService } from "../services/authService.js";

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
    await authService.registerUser({ name, email, phone, password });

    return res.status(HTTP_STATUS.OK).send({
      data: { message: SUCCESS_MESSAGES.ACCOUNT_CREATED },
    });
  } catch (err) {
    if (handleAppError(err, res, ERROR_MESSAGES)) return;

    // Fallback for unexpected errors
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
      message: ERROR_MESSAGES.OPERATION_FAILED,
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
    const result = await authService.authenticateUser({
      email,
      phone,
      password,
    });
    const { user, accessToken, refreshToken } = result;
    const { id, name, email: userEmail, phone: userPhone, status } = user;
    return res.status(HTTP_STATUS.OK).send({
      data: {
        message: SUCCESS_MESSAGES.SIGNED_IN,
        accessToken,
        refreshToken,
        user: {
          id,
          name,
          email: userEmail,
          phone: userPhone,
          status,
        },
      },
    });
  } catch (err) {
    if (handleAppError(err, res, ERROR_MESSAGES)) return;

    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
      message: ERROR_MESSAGES.OPERATION_FAILED,
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
    await authService.logoutUser(authUser);

    return res.status(HTTP_STATUS.OK).send({
      data: { message: SUCCESS_MESSAGES.LOGGED_OUT },
    });
  } catch (err) {
    if (handleAppError(err, res, ERROR_MESSAGES)) return;

    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
      message: ERROR_MESSAGES.OPERATION_FAILED,
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
    const result = await authService.verifyAndRefreshToken(refreshToken);

    return res.status(HTTP_STATUS.OK).send({
      data: {
        message: SUCCESS_MESSAGES.TOKEN_REFRESHED,
        accessToken: result.accessToken,
      },
    });
  } catch (err) {
    if (handleAppError(err, res, ERROR_MESSAGES)) return;

    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
      message: ERROR_MESSAGES.OPERATION_FAILED,
    });
  }
}

/**
 * Generates a password reset token and sends it to the user's email.
 * @param {Object} req.body - The request body containing user email.
 * @param {string} req.body.email - The email address of the user.
 * @returns {Object} Success message indicating email was sent with 200 status code.
 * @throws {400} If email is missing.
 * @throws {500} If there's an error during the process or email sending fails.
 */
export async function forgotPassword(req, res) {
  const validatedBody = validateRequest(forgotPasswordSchema, req.body, res);
  if (!validatedBody) return;
  const { email } = validatedBody;

  try {
    await authService.createPasswordResetToken(email);

    return res.status(HTTP_STATUS.OK).send({
      data: {
        message: SUCCESS_MESSAGES.RESET_TOKEN_SENT,
      },
    });
  } catch (err) {
    if (handleAppError(err, res, ERROR_MESSAGES)) return;

    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
      message: ERROR_MESSAGES.OPERATION_FAILED,
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
    await authService.resetUserPassword(token, newPassword);

    return res.status(HTTP_STATUS.OK).send({
      data: { message: SUCCESS_MESSAGES.PASSWORD_RESET },
    });
  } catch (err) {
    if (handleAppError(err, res, ERROR_MESSAGES)) return;

    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
      message: ERROR_MESSAGES.OPERATION_FAILED,
    });
  }
}
