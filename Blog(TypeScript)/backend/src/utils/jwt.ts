import jwt, { SignOptions, VerifyOptions } from "jsonwebtoken";
import { TokenPayload } from "../interfaces/authInterface.js";


const JWT_SECRET: string | undefined = process.env.JWT_SECRET;

/**
 * Signs a JWT token with the provided payload
 * 
 * @template T - Type of the payload (extends TokenPayload)
 * @param payload - Token payload data (must include userId and type)
 * @param options - JWT signing options (expiresIn, etc.)
 * @returns Signed JWT token string
 * @throws Error if JWT_SECRET is not set
 */
export const signToken = <T extends TokenPayload>(
  payload: T,
  options: SignOptions = {}
): string => {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not set");
  }
  return jwt.sign(payload, JWT_SECRET, options);
};

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
export const verifyToken = (
  token: string,
  options: VerifyOptions = {}
): TokenPayload => {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not set");
  }
  return jwt.verify(token, JWT_SECRET, options) as TokenPayload;
};

