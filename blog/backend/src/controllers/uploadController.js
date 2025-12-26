/**
 * Upload Controller - Handles Cloudinary signed upload signature generation
 * Provides secure upload parameters for direct frontend-to-Cloudinary uploads
 */
import { HTTP_STATUS, ERROR_MESSAGES } from "../utils/constants.js";
import { generateUploadSignature } from "../services/cloudinaryService.js";

const { OK, INTERNAL_SERVER_ERROR } = HTTP_STATUS;
const { UNABLE_TO_GENERATE_UPLOAD_SIGNATURE } = ERROR_MESSAGES;

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

    return res.status(OK).send({
      data: uploadParams,
    });
  } catch (error) {
    console.error("Error generating upload signature:", error);
    return res.status(INTERNAL_SERVER_ERROR).send({
      data: { message: UNABLE_TO_GENERATE_UPLOAD_SIGNATURE },
    });
  }
}
