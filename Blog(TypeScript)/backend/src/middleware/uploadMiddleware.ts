/**
 * Upload Middleware
 * Handles file uploads using Multer with memory storage
 * Files are stored in memory and uploaded directly to Cloudinary
 */

import multer from "multer";
import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS, ERROR_MESSAGES } from "../utils/constants.js";

const { BAD_REQUEST } = HTTP_STATUS;
const { VALIDATION_ERROR } = ERROR_MESSAGES;

/**
 * Memory Storage Configuration
 * Files are stored in RAM, not saved to disk
 * Available as req.file.buffer for direct upload to Cloudinary
 * 
 * Concept: Multer Storage Engine
 * - memoryStorage(): Stores files in memory as Buffer objects
 * - diskStorage(): Saves files to disk (not used here)
 * - Memory storage is faster but limited by RAM
 */
const storage = multer.memoryStorage();

/**
 * File Filter Function
 * Validates file types before processing
 * Only allows image files (mimetype starts with "image/")
 * 
 * @param req - Express request object
 * @param file - File object from multer containing file metadata
 * @param cb - Callback function (error, accept)
 * 
 * Concept: File Filtering
 * - Called for each file before storage
 * - cb(null, true) = accept file
 * - cb(error) = reject file with error
 * - file.mimetype = MIME type (e.g., "image/jpeg", "image/png")
 * 
 * Note: FileFilterCallback is an overloaded interface with two call signatures:
 * - (error: Error): void - reject with error (can omit second parameter)
 * - (error: null, acceptFile: boolean): void - accept or reject
 * 
 * We don't explicitly type the callback parameter to avoid type conflicts.
 * TypeScript will infer the correct type from multer's Options interface.
 */
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
): void => {
  if (file.mimetype.startsWith("image/")) {
    // Accept the file: cb(null, true)
    cb(null, true);
  } else {
    // Reject the file with error: cb(error)
    // FileFilterCallback overload allows calling with just error (no second parameter)
    cb(new Error("Only image files are allowed"));
  }
};

/**
 * Multer Configuration
 * Configures multer middleware with storage, filtering, and limits
 * 
 * Concept: Multer Middleware Configuration
 * - storage: Where files are stored (memory vs disk)
 * - fileFilter: Function to validate/accept files
 * - limits: Size and count restrictions
 */
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
});

/**
 * Error Handling Middleware for Multer
 * Handles multer-specific errors and file validation errors
 * 
 * @param err - Error object (can be MulterError or generic Error)
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function to pass control
 * 
 * Concept: Express Error Handling Middleware
 * - Signature: (err, req, res, next) => void
 * - TypeScript: Uses ErrorRequestHandler type
 * - Handles specific error types before passing to next middleware
 * - Type guards: instanceof checks to narrow error types
 */
export const handleUploadError = (
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Type guard: Check if error is MulterError
  // Concept: Type Narrowing with instanceof
  // TypeScript narrows err from unknown to MulterError after instanceof check
  if (err instanceof multer.MulterError) {
    // Handle specific Multer error codes
    // After instanceof check, TypeScript knows err has 'code' property
    if (err.code === "LIMIT_FILE_SIZE") {
      res.status(BAD_REQUEST).send({
        data: { message: "File size exceeds 5MB limit" },
      });
      return;
    }
    // Handle other Multer errors
    res.status(BAD_REQUEST).send({
      data: { message: VALIDATION_ERROR },
    });
    return;
  }

  // Type guard: Check if error is Error with specific message
  // Concept: Type Narrowing with property checks
  // After instanceof Error check, TypeScript knows err has message property
  if (err instanceof Error && err.message === "Only image files are allowed") {
    res.status(BAD_REQUEST).send({
      data: { message: err.message },
    });
    return;
  }

  // Pass other errors to next error handler
  // Concept: Error Propagation
  // If this middleware can't handle the error, pass it to the next error handler
  next(err);
};

/**
 * Combined Middleware for Single Image Upload
 * Combines upload.single("image") + error handling
 * Use this instead of manually adding both middlewares
 * 
 * Concept: Middleware Composition
 * - Array of middleware functions
 * - Spread operator (...) unpacks array in route definitions
 * - First middleware processes upload, second handles errors
 * 
 * Usage:
 * router.post("/", authenticateToken, ...handleImageUpload, create);
 * 
 * Type: Array of Express middleware functions
 * - upload.single("image"): Multer middleware for single file upload
 * - handleUploadError: Error handling middleware
 */
export const handleImageUpload = [
  upload.single("image"),
  handleUploadError,
] as const;

