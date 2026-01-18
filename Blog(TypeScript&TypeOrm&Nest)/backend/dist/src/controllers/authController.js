import { HTTP_STATUS, SUCCESS_MESSAGES, ERROR_MESSAGES, } from "../utils/constants.js";
import { handleAppError } from "../utils/errors.js";
import { validateRequest } from "../utils/validations.js";
import { signUpSchema, signInSchema, forgotPasswordSchema, resetPasswordSchema, refreshTokenSchema, } from "../validations/authValidation.js";
import { authService } from "../services/authService.js";
const { INTERNAL_SERVER_ERROR, OK, UNAUTHORIZED } = HTTP_STATUS;
const { OPERATION_FAILED, ACCESS_TOKEN_REQUIRED } = ERROR_MESSAGES;
const { ACCOUNT_CREATED, SIGNED_IN, LOGGED_OUT, TOKEN_REFRESHED, RESET_TOKEN_SENT, PASSWORD_RESET, } = SUCCESS_MESSAGES;
/**
 * Registers a new user account
 * @param req - Express request object containing user registration data
 * @param res - Express response object
 * @returns Promise that resolves when response is sent
 * @throws {422} If email or phone already exists in the database
 * @throws {500} If there's an error during the registration process
 */
export async function signUp(req, res) {
    const validatedBody = validateRequest(signUpSchema, req.body, res);
    // Early return: validation failed, error response already sent to client
    if (!validatedBody)
        return;
    const { email, password, name, phone, image } = validatedBody;
    try {
        await authService.registerUser({
            name,
            email,
            phone,
            password,
            image,
        });
        res.status(OK).send({
            data: { message: ACCOUNT_CREATED },
        });
    }
    catch (err) {
        if (handleAppError(err, res, ERROR_MESSAGES))
            return;
        // Fallback for unexpected errors
        console.error(err);
        res.status(INTERNAL_SERVER_ERROR).send({
            message: OPERATION_FAILED,
        });
    }
}
/**
 * Authenticates a user and generates a JWT token
 * @param req - Express request object containing login credentials
 * @param res - Express response object
 * @returns Promise that resolves when response is sent
 * @throws {400} If password or both email and phone are missing
 * @throws {401} If invalid credentials are provided
 * @throws {500} If there's an error during the authentication process
 */
export async function signIn(req, res) {
    const validatedBody = validateRequest(signInSchema, req.body, res);
    // Early return: validation failed, error response already sent to client
    if (!validatedBody)
        return;
    const { email, phone, password } = validatedBody;
    try {
        const result = await authService.authenticateUser({
            email,
            phone,
            password,
        });
        const { data } = result;
        if (!data) {
            throw new Error("Authentication result missing data");
        }
        const { user, accessToken, refreshToken } = data;
        const { id, name, email: userEmail, phone: userPhone, status, image, } = user;
        res.status(OK).send({
            data: {
                message: SIGNED_IN,
                accessToken,
                refreshToken,
                user: {
                    id,
                    name,
                    email: userEmail,
                    phone: userPhone,
                    image,
                    status,
                },
            },
        });
    }
    catch (err) {
        if (handleAppError(err, res, ERROR_MESSAGES))
            return;
        console.error(err);
        res.status(INTERNAL_SERVER_ERROR).send({
            message: OPERATION_FAILED,
        });
    }
}
/**
 * Logs out a user by updating their status to "logged out"
 * @param req - Express request object (must have authenticated user)
 * @param res - Express response object
 * @returns Promise that resolves when response is sent
 * @throws {404} If the user is not found
 * @throws {500} If there's an error during the logout process
 */
export async function signOut(req, res) {
    try {
        // Type guard: Ensure user exists
        if (!req.user) {
            res.status(UNAUTHORIZED).send({
                data: { message: ACCESS_TOKEN_REQUIRED },
            });
            return;
        }
        const { id } = req.user;
        await authService.logoutUser(id);
        res.status(OK).send({
            data: { message: LOGGED_OUT },
        });
    }
    catch (err) {
        if (handleAppError(err, res, ERROR_MESSAGES))
            return;
        console.error(err);
        res.status(INTERNAL_SERVER_ERROR).send({
            message: OPERATION_FAILED,
        });
    }
}
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
export async function refreshToken(req, res) {
    const validatedBody = validateRequest(refreshTokenSchema, req.body, res);
    // Early return: validation failed, error response already sent to client
    if (!validatedBody)
        return;
    const { refreshToken } = validatedBody;
    try {
        const result = await authService.verifyAndRefreshToken(refreshToken);
        const { data: obtainedData } = result;
        if (!obtainedData) {
            throw new Error("Token refresh result missing data");
        }
        const { accessToken } = obtainedData;
        res.status(OK).send({
            data: {
                message: TOKEN_REFRESHED,
                accessToken: accessToken,
            },
        });
    }
    catch (err) {
        if (handleAppError(err, res, ERROR_MESSAGES))
            return;
        console.error(err);
        res.status(INTERNAL_SERVER_ERROR).send({
            message: OPERATION_FAILED,
        });
    }
}
/**
 * Generates a password reset token and sends it to the user's email
 * @param req - Express request object containing user email
 * @param res - Express response object
 * @returns Promise that resolves when response is sent
 * @throws {400} If email is missing
 * @throws {500} If there's an error during the process or email sending fails
 */
export async function forgotPassword(req, res) {
    const validatedBody = validateRequest(forgotPasswordSchema, req.body, res);
    if (!validatedBody)
        return;
    const { email } = validatedBody;
    try {
        await authService.createPasswordResetToken(email);
        res.status(OK).send({
            data: {
                message: RESET_TOKEN_SENT,
            },
        });
    }
    catch (err) {
        if (handleAppError(err, res, ERROR_MESSAGES))
            return;
        console.error(err);
        res.status(INTERNAL_SERVER_ERROR).send({
            message: OPERATION_FAILED,
        });
    }
}
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
export async function resetPassword(req, res) {
    const validatedBody = validateRequest(resetPasswordSchema, req.body, res);
    if (!validatedBody)
        return;
    const { token, newPassword } = validatedBody;
    try {
        await authService.resetUserPassword(token, newPassword);
        res.status(OK).send({
            data: { message: PASSWORD_RESET },
        });
    }
    catch (err) {
        if (handleAppError(err, res, ERROR_MESSAGES))
            return;
        console.error(err);
        res.status(INTERNAL_SERVER_ERROR).send({
            message: OPERATION_FAILED,
        });
    }
}
//# sourceMappingURL=authController.js.map