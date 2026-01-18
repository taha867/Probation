import rateLimit from "express-rate-limit";
import { HTTP_STATUS, ERROR_MESSAGES } from "../utils/constants.js";
import { verifyToken } from "../utils/jwt.js";
const { UNAUTHORIZED, TOO_MANY_REQUESTS, INTERNAL_SERVER_ERROR } = HTTP_STATUS;
const { ACCESS_TOKEN_REQUIRED, INVALID_TOKEN, ACCESS_TOKEN_EXPIRED, AUTHENTICATION_FAILED, } = ERROR_MESSAGES;
/**
 * Authentication middleware
 * Verifies JWT access token and attaches user information to request
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function to pass control to next middleware
 * @returns void - Sends response or calls next()
 */
export const authenticateToken = async (req, res, next) => {
    try {
        // Reads token from headers
        // Authorization: Bearer xyz123token
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN (xyz123token, This extracts the token only.)
        if (!token) {
            res.status(UNAUTHORIZED).send({
                data: { message: ACCESS_TOKEN_REQUIRED },
            });
            return;
        }
        const decoded = verifyToken(token);
        // Verify this is an access token, not a refresh token
        if (decoded.type !== "access") {
            res.status(UNAUTHORIZED).send({
                data: { message: INVALID_TOKEN },
            });
            return;
        }
        // Store only userId in req.user (optimized - no database query)
        req.user = { id: decoded.userId };
        next();
    }
    catch (error) {
        // Type guard: Check if error is JsonWebTokenError
        if (error instanceof Error && error.name === "JsonWebTokenError") {
            res.status(UNAUTHORIZED).send({
                data: { message: INVALID_TOKEN },
            });
            return;
        }
        // Type guard: Check if error is TokenExpiredError
        if (error instanceof Error && error.name === "TokenExpiredError") {
            res.status(UNAUTHORIZED).send({
                data: { message: ACCESS_TOKEN_EXPIRED },
            });
            return;
        }
        console.error("Auth middleware error:", error);
        res.status(INTERNAL_SERVER_ERROR).send({
            data: { message: AUTHENTICATION_FAILED },
        });
    }
};
/**
 * Rate limiter for login attempts
 * Limits login attempts to mitigate brute-force attacks
 * 5 attempts per minute per IP → after that, return 429
 */
export const loginRateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // Limit each IP to 5 requests per `window` (here, per 15 minutes)
    standardHeaders: true, //Enable the Ratelimit header.
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    handler: (_req, res) => {
        res.status(TOO_MANY_REQUESTS).json({
            data: { message: ERROR_MESSAGES.TOO_MANY_REQUESTS },
        });
    },
});
export default authenticateToken;
//# sourceMappingURL=authMiddleware.js.map