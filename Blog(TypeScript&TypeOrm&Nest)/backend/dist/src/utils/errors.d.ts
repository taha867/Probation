import { Response } from "express";
import { ERROR_MESSAGES } from "./constants.js";
export declare class AppError extends Error {
    /**
     * Informs TypeScript these properties exist
     */
    code: string;
    statusCode: number;
    /**
     * @param code - Machine-readable error code (must match ERROR_MESSAGES key)
     * @param statusCode - HTTP status code (e.g., HTTP_STATUS.UNAUTHORIZED)
     */
    constructor(code: string, statusCode: number);
}
/**

 * @param err - Error to check (can be any error type)
 * @param res - Express response object
 * @param errorMessages - Error messages object (ERROR_MESSAGES)
 * @returns true if error was handled, false otherwise
 */
export declare const handleAppError: (err: unknown, res: Response, errorMessages: typeof ERROR_MESSAGES) => boolean;
//# sourceMappingURL=errors.d.ts.map