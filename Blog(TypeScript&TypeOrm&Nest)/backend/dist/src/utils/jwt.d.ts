import { SignOptions, VerifyOptions } from "jsonwebtoken";
import { TokenPayload } from "../interfaces/authInterface.js";
/**
 * Signs a JWT token with the provided payload
 *
 * @template T - Type of the payload (extends TokenPayload)
 * @param payload - Token payload data (must include userId and type)
 * @param options - JWT signing options (expiresIn, etc.)
 * @returns Signed JWT token string
 * @throws Error if JWT_SECRET is not set
 */
export declare const signToken: <T extends TokenPayload>(payload: T, options?: SignOptions) => string;
/**
 * Verifies and decodes a JWT token
 *
 * @param token - JWT token string to verify
 * @param options - JWT verification options
 * @returns Decoded token payload
 * @throws JsonWebTokenError if token is invalid
 * @throws TokenExpiredError if token has expired
 * @throws Error if JWT_SECRET is not set
 */
export declare const verifyToken: (token: string, options?: VerifyOptions) => TokenPayload;
//# sourceMappingURL=jwt.d.ts.map