import { RateLimitRequestHandler } from "express-rate-limit";
import { Request, Response, NextFunction } from "express";
/**
 * Authentication middleware
 * Verifies JWT access token and attaches user information to request
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function to pass control to next middleware
 * @returns void - Sends response or calls next()
 */
export declare const authenticateToken: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Rate limiter for login attempts
 * Limits login attempts to mitigate brute-force attacks
 * 5 attempts per minute per IP → after that, return 429
 */
export declare const loginRateLimiter: RateLimitRequestHandler;
export default authenticateToken;
//# sourceMappingURL=authMiddleware.d.ts.map