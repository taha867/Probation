import { v2 as cloudinary } from "cloudinary";
// Configure Cloudinary SDK
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
/**
 * Delete an image from Cloudinary using public_id
 *
 * @param publicId - The public_id of the image to delete
 * @returns Promise resolving to deletion result or null if deletion fails
 */
export const deleteImageFromCloudinary = async (publicId) => {
    if (!publicId)
        return null;
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    }
    catch (error) {
        console.error("Error deleting image from Cloudinary:", error);
        // Don't throw - image deletion failure shouldn't break the flow
        return null;
    }
};
/**
 * Extract public_id from Cloudinary URL
 * Parses Cloudinary URL format to extract the public_id
 *
 * @param url - Cloudinary image URL
 * @returns Public ID string or null if extraction fails
 */
export const extractPublicIdFromUrl = (url) => {
    if (!url)
        return null;
    try {
        // Cloudinary URL format: https://res.cloudinary.com/{cloud_name}/image/upload/{version}/{public_id}.{format}
        // Extract public_id from URL
        const matches = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);
        if (matches && matches[1]) {
            // Remove folder prefix if present
            return matches[1].replace(/^blog\//, "");
        }
        return null;
    }
    catch (error) {
        console.error("Error extracting public_id from URL:", error);
        return null;
    }
};
/**
 * Sanitize folder name to prevent path traversal attacks
 * Removes all characters except alphanumeric, forward slash, underscore, and hyphen
 *
 * @param folder - Folder name to sanitize
 * @returns Sanitized folder name
 */
const sanitizeFolder = (folder = "blog") => {
    return folder.replace(/[^a-zA-Z0-9/_-]/g, "");
};
/**
 * Upload image file buffer to Cloudinary
 * Handles file buffer uploads using Cloudinary's upload_stream API
 *
 * @param fileBuffer - File buffer from multer middleware
 * @param folder - Optional folder path (default: 'blog')
 * @param originalName - Original filename (optional, default: 'image')
 * @returns Promise resolving to upload result with secure_url and public_id
 * @throws Error if upload fails
*/
export const uploadImageToCloudinary = async (fileBuffer, folder = "blog", originalName = "image") => {
    try {
        const sanitizedFolder = sanitizeFolder(folder);
        // Generate unique filename to avoid conflicts
        const timestamp = Date.now();
        const sanitizedName = originalName.replace(/[^a-zA-Z0-9._-]/g, "");
        const publicId = `${sanitizedFolder}/${timestamp}_${sanitizedName}`;
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream({
                folder: sanitizedFolder,
                resource_type: "image",
                public_id: publicId.split(".")[0], // Remove extension if present
            }, (error, result) => {
                if (error) {
                    console.error("Cloudinary upload error:", error);
                    reject(error);
                }
                else if (result) {
                    resolve({
                        secure_url: result.secure_url,
                        public_id: result.public_id,
                    });
                }
                else {
                    reject(new Error("Upload completed but no result returned"));
                }
            });
            // Write buffer to upload stream
            uploadStream.end(fileBuffer);
        });
    }
    catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
        throw error;
    }
};
export default cloudinary;
//# sourceMappingURL=cloudinaryService.js.map