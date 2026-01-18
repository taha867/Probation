import { Response } from "express";
/**
 * Initialize database connection
 * @param res - Optional Express response object for error handling in HTTP context
 * @returns Promise that resolves when connection is established
 * @throws Error if connection fails and no response object is provided
 */
export declare const initDb: (res?: Response) => Promise<void>;
export declare const closeDb: () => Promise<void>;
//# sourceMappingURL=dbConfig.d.ts.map