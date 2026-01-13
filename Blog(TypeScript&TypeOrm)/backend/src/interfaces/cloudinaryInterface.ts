/**
 * Cloudinary upload API response interface
 * Complete structure returned from Cloudinary SDK after successful image upload
 * Used internally for type safety when handling Cloudinary SDK responses
 */
export interface CloudinaryUploadApiResponse {
  secure_url: string;
  public_id: string;
  url?: string;
  width?: number;
  height?: number;
  format?: string;
  resource_type?: string;
  [key: string]: unknown; // Allow additional Cloudinary properties
}

/**
 * Cloudinary upload API error response interface
 * Structure returned when Cloudinary upload fails
 * Used internally for error handling
 */
export interface CloudinaryUploadApiError extends Error {
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
 * Structure returned after image deletion from Cloudinary
 */
export interface CloudinaryDeletionResult {
  result: string; // "ok" | "not found"
}
