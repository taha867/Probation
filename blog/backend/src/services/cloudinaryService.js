/**
 * Cloudinary Service - Handles Cloudinary business logic
 * Manages image upload signatures, deletions, and URL parsing
 */
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary SDK
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Generate signed upload parameters for direct frontend upload
 * @param {string} folder - Optional folder path in Cloudinary (e.g., 'blog/posts', 'blog/users')
 * @returns {Object} Signed upload parameters (signature, timestamp, cloud_name, api_key, folder)
 */
export const generateUploadSignature = (folder = "blog") => {
  const timestamp = Math.round(new Date().getTime() / 1000);

  // Sanitize folder name (security: prevent path traversal)
  const sanitizedFolder = folder.replace(/[^a-zA-Z0-9/_-]/g, "");

  // Generate signature using Cloudinary's signing algorithm
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp,
      folder: sanitizedFolder,
    },
    process.env.CLOUDINARY_API_SECRET
  );

  return {
    signature,
    timestamp,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    folder: sanitizedFolder,
  };
};

/**
 * Delete an image from Cloudinary using public_id
 * @param {string} publicId - The public_id of the image to delete
 * @returns {Promise<Object>} Deletion result
 */
export const deleteImageFromCloudinary = async (publicId) => {
  if (!publicId) return null;

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    // Don't throw - image deletion failure shouldn't break the flow
    return null;
  }
};

/**
 * Extract public_id from Cloudinary URL
 * @param {string} url - Cloudinary image URL
 * @returns {string|null} Public ID or null
 */
export const extractPublicIdFromUrl = (url) => {
  if (!url) return null;

  try {
    // Cloudinary URL format: https://res.cloudinary.com/{cloud_name}/image/upload/{version}/{public_id}.{format}
    // Extract public_id from URL
    const matches = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);
    if (matches && matches[1]) {
      // Remove folder prefix if present
      return matches[1].replace(/^blog\//, "");
    }
    return null;
  } catch (error) {
    console.error("Error extracting public_id from URL:", error);
    return null;
  }
};

export default cloudinary;
