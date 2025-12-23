/**
 * Upload Controller - Handles Cloudinary signed upload signature generation
 * Provides secure upload parameters for direct frontend-to-Cloudinary uploads
 */
import { HTTP_STATUS, ERROR_MESSAGES } from "../utils/constants.js";
import { generateUploadSignature } from "../services/cloudinaryService.js";

/**
 * Generates signed upload parameters for Cloudinary direct upload
 * @param {Object} req.body - Request body
 * @param {string} [req.body.folder] - Optional folder name (default: 'blog')
 * @param {Object} req.user - The authenticated user from JWT token
 * @returns {Object} Signed upload parameters (signature, timestamp, cloud_name, api_key, folder)
 * @throws {500} If there's an error generating signature
 */
export async function getUploadSignature(req, res) {
  try {
    const { folder = "blog" } = req.body || {};

    // Generate signed upload parameters (sanitization handled in service)
    const uploadParams = generateUploadSignature(folder);

    return res.status(HTTP_STATUS.OK).send({
      data: uploadParams,
    });
  } catch (error) {
    console.error("Error generating upload signature:", error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
      data: { message: ERROR_MESSAGES.UNABLE_TO_GENERATE_UPLOAD_SIGNATURE },
    });
  }
}

