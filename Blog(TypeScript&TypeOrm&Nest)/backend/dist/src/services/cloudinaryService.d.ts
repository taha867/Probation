import { v2 as cloudinary } from "cloudinary";
import type { CloudinaryUploadResult, CloudinaryDeletionResult } from "../interfaces/cloudinaryInterface.js";
/**
 * Delete an image from Cloudinary using public_id
 *
 * @param publicId - The public_id of the image to delete
 * @returns Promise resolving to deletion result or null if deletion fails
 */
export declare const deleteImageFromCloudinary: (publicId: string | null | undefined) => Promise<CloudinaryDeletionResult | null>;
/**
 * Extract public_id from Cloudinary URL
 * Parses Cloudinary URL format to extract the public_id
 *
 * @param url - Cloudinary image URL
 * @returns Public ID string or null if extraction fails
 */
export declare const extractPublicIdFromUrl: (url: string | null | undefined) => string | null;
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
export declare const uploadImageToCloudinary: (fileBuffer: Buffer, folder?: string, originalName?: string) => Promise<CloudinaryUploadResult>;
export default cloudinary;
//# sourceMappingURL=cloudinaryService.d.ts.map