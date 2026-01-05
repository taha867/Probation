import rateLimit from "express-rate-limit";
import { HTTP_STATUS, ERROR_MESSAGES } from "../utils/constants.js";
import { verifyToken } from "../utils/jwt.js";

const { UNAUTHORIZED, TOO_MANY_REQUESTS, INTERNAL_SERVER_ERROR } = HTTP_STATUS;
const {
  ACCESS_TOKEN_REQUIRED,
  INVALID_TOKEN,
  ACCESS_TOKEN_EXPIRED,
  AUTHENTICATION_FAILED,
} = ERROR_MESSAGES;
export const authenticateToken = async (req, res, next) => {
  try {
    //Reads token from headers
    //Authorization: Bearer xyz123token
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN (xyz123token, This extracts the token only.)

    if (!token) {
      return res.status(UNAUTHORIZED).send({
        data: { message: ACCESS_TOKEN_REQUIRED },
      });
    }

    const decoded = verifyToken(token);

    // Verify this is an access token, not a refresh token
    if (decoded.type !== "access") {
      return res.status(UNAUTHORIZED).send({
        data: { message: INVALID_TOKEN },
      });
    }

    // Store only userId in req.user (optimized - no database query)
    req.user = { id: decoded.userId };
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(UNAUTHORIZED).send({
        data: { message: INVALID_TOKEN },
      });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(UNAUTHORIZED).send({
        data: { message: ACCESS_TOKEN_EXPIRED },
      });
    }
    console.error("Auth middleware error:", error);
    return res.status(INTERNAL_SERVER_ERROR).send({
      data: { message: AUTHENTICATION_FAILED },
    });
  }
};

// Limit login attempts to mitigate brute-force attacks
// 5 attempts per minute per IP → after that, return 429
export const loginRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return res.status(TOO_MANY_REQUESTS).json({
      data: { message: ERROR_MESSAGES.TOO_MANY_REQUESTS },
    });
  },
});

export default authenticateToken;
