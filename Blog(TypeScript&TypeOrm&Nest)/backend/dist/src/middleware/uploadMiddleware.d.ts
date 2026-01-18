import multer from "multer";
import { Request, Response, NextFunction } from "express";
/**
 * Multer Configuration
 * Configures multer middleware with storage, filtering, and limits
 *
 * Concept: Multer Middleware Configuration
 * - storage: Where files are stored (memory vs disk)
 * - fileFilter: Function to validate/accept files
 * - limits: Size and count restrictions
 */
export declare const upload: multer.Multer;
/**
 * Error Handling Middleware for Multer
 * Handles multer-specific errors and file validation errors
 *
 * @param err - Error object (can be MulterError or generic Error)
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function to pass control
 */
export declare const handleUploadError: (err: unknown, _req: Request, res: Response, next: NextFunction) => void;
/**
 * Combined Middleware for Single Image Upload
 * Combines upload.single("image") + error handling
 * Use this instead of manually adding both middlewares
 */
export declare const handleImageUpload: readonly [import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, (err: unknown, _req: Request, res: Response, next: NextFunction) => void];
//# sourceMappingURL=uploadMiddleware.d.ts.map