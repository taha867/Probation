import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import { httpStatus, errorMessages } from "../utils/constants.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const authenticateToken = async (req, res, next) => {
  try {
    //Reads token from headers
    //Authorization: Bearer xyz123token
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN (xyz123token, This extracts the token only.)

    if (!token) {
      return res.status(httpStatus.UNAUTHORIZED).send({ message: errorMessages.accessTokenRequired });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Verify this is an access token, not a refresh token
    if (decoded.type !== "access") {
      return res.status(httpStatus.UNAUTHORIZED).send({ message: errorMessages.invalidToken });
    }
    
    // Store only userId in req.user (optimized - no database query)
    req.user = { id: decoded.userId };
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(httpStatus.UNAUTHORIZED).send({ message: errorMessages.invalidToken });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(httpStatus.UNAUTHORIZED).send({ message: errorMessages.accessTokenExpired });
    }
    console.error("Auth middleware error:", error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: errorMessages.authenticationFailed });
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
    return res.status(httpStatus.TOO_MANY_REQUESTS).json({
      message: errorMessages.tooManyRequests,
    });
  },
});

export default authenticateToken;

