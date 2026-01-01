/**
 * Upload Middleware - Handles multipart/form-data file uploads using multer
 * Files are stored in memory and uploaded directly to Cloudinary
 */
import multer from "multer";
import { HTTP_STATUS, ERROR_MESSAGES } from "../utils/constants.js";

// Configure multer for memory storage (no disk storage needed)
// Files will be stored in memory and uploaded directly to Cloudinary
const storage = multer.memoryStorage();

// File filter - only allow images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

// Multer configuration
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
});

// Error handling middleware for multer
export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(HTTP_STATUS.BAD_REQUEST).send({
        data: { message: "File size exceeds 5MB limit" },
      });
    }
    return res.status(HTTP_STATUS.BAD_REQUEST).send({
      data: { message: ERROR_MESSAGES.VALIDATION_ERROR },
    });
  }
  if (err.message === "Only image files are allowed") {
    return res.status(HTTP_STATUS.BAD_REQUEST).send({
      data: { message: err.message },
    });
  }
  next(err);
};

/**
 * Combined middleware for single image upload
 * Combines upload.single("image") + error handling
 * Use this instead of manually adding both middlewares
 * 
 * Usage:
 * router.post("/", authenticateToken, ...handleImageUpload, create);
 */
export const handleImageUpload = [
  upload.single("image"),
  handleUploadError,
];

