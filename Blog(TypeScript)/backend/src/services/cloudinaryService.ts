import { v2 as cloudinary } from "cloudinary";

/**
 * Cloudinary upload API response interface
 * Structure returned after successful image upload from Cloudinary
 */
interface UploadApiResponse {
  secure_url: string;
  public_id: string;
  url?: string;
  width?: number;
  height?: number;
  format?: string;
  resource_type?: string;
  [key: string]: unknown; // Allow additional properties
}

/**
 * Cloudinary upload API error response interface
 * Structure returned when upload fails
 */
interface UploadApiErrorResponse extends Error {
  http_code?: number;
  message: string;
  name: string;
}

/**
 * Cloudinary upload result interface
 * Simplified structure returned after successful image upload
 * Used as return type for our service functions
 */
export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
}

/**
 * Cloudinary deletion result interface
 * Structure returned after image deletion
 */
export interface CloudinaryDeletionResult {
  result: string; // "ok" | "not found"
}

// Configure Cloudinary SDK
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

/**
 * Delete an image from Cloudinary using public_id
 * 
 * @param publicId - The public_id of the image to delete
 * @returns Promise resolving to deletion result or null if deletion fails
 * 
 * @example
 * const result = await deleteImageFromCloudinary("blog/users/1234567890_profile.jpg");
 * if (result) {
 *   console.log("Image deleted:", result.result);
 * }
 */
export const deleteImageFromCloudinary = async (
  publicId: string | null | undefined
): Promise<CloudinaryDeletionResult | null> => {
  if (!publicId) return null;

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result as CloudinaryDeletionResult;
  } catch (error: unknown) {
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
 * 
 * @example
 * const publicId = extractPublicIdFromUrl(
 *   "https://res.cloudinary.com/demo/image/upload/v1234567890/blog/users/profile.jpg"
 * );
 * // Returns: "blog/users/profile"
 */
export const extractPublicIdFromUrl = (url: string | null | undefined): string | null => {
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
  } catch (error: unknown) {
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
 * 
 * @example
 * sanitizeFolder("blog/users") // Returns: "blog/users"
 * sanitizeFolder("blog/../users") // Returns: "blogusers" (removes invalid chars)
 */
const sanitizeFolder = (folder: string = "blog"): string => {
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
 * 
 * @example
 * const result = await uploadImageToCloudinary(
 *   fileBuffer,
 *   "blog/users",
 *   "profile.jpg"
 * );
 * // Returns: { secure_url: "https://...", public_id: "blog/users/1234567890_profile" }
 */
export const uploadImageToCloudinary = async (
  fileBuffer: Buffer,
  folder: string = "blog",
  originalName: string = "image"
): Promise<CloudinaryUploadResult> => {
  try {
    const sanitizedFolder = sanitizeFolder(folder);
    
    // Generate unique filename to avoid conflicts
    const timestamp = Date.now();
    const sanitizedName = originalName.replace(/[^a-zA-Z0-9._-]/g, "");
    const publicId = `${sanitizedFolder}/${timestamp}_${sanitizedName}`;

    return new Promise<CloudinaryUploadResult>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: sanitizedFolder,
          resource_type: "image",
          public_id: publicId.split(".")[0], // Remove extension if present
        },
        (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(error);
          } else if (result) {
            resolve({
              secure_url: result.secure_url,
              public_id: result.public_id,
            });
          } else {
            reject(new Error("Upload completed but no result returned"));
          }
        }
      );

      // Write buffer to upload stream
      uploadStream.end(fileBuffer);
    });
  } catch (error: unknown) {
    console.error("Error uploading image to Cloudinary:", error);
    throw error;
  }
};

export default cloudinary;

