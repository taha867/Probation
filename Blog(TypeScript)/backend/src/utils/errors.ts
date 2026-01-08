import { Response } from "express";
import { ERROR_MESSAGES } from "./constants.js";

export class AppError extends Error {
  /**
   * Informs TypeScript these properties exist
   */
  declare code: string;
  declare statusCode: number;

  /**
   * @param code - Machine-readable error code (must match ERROR_MESSAGES key)
   * @param statusCode - HTTP status code (e.g., HTTP_STATUS.UNAUTHORIZED)
   */
  constructor(code: string, statusCode: number) {
    // Pass the error code to the parent Error
    super(code);
    this.name = "AppError"; // Useful for logging or debugging to see exactly which error type occurred
    this.code = code;
    this.statusCode = statusCode;
  }
}

/**

 * @param err - Error to check (can be any error type)
 * @param res - Express response object
 * @param errorMessages - Error messages object (ERROR_MESSAGES)
 * @returns true if error was handled, false otherwise
 */
export const handleAppError = (
  err: unknown,
  res: Response,
  errorMessages: typeof ERROR_MESSAGES
): boolean => {
  // Type guard: Check if err is an AppError instance
  if (!(err instanceof AppError)) {
    return false; // If err is not an AppError, return false so other handlers can continue
  }

  // TypeScript now knows err is AppError, so we can safely access properties
  // keyof typeof ERROR_MESSAGES gets all keys
  // Type assertion ensures err.code is a valid key
  // Type-safe property access

  const message: string =
    (errorMessages[err.code as keyof typeof errorMessages] as string) ||
    err.code;
  const status: number = err.statusCode || 500;

  res.status(status).send({ data: { message } });
  return true;
};
