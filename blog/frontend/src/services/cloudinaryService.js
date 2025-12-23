/**
 * Cloudinary Service - Handles direct uploads to Cloudinary
 * Uses signed upload parameters from backend for secure uploads
 */
import apiClient from "../utils/axiosInstance";

const CLOUDINARY_UPLOAD_URL = import.meta.env.VITE_CLOUDINARY_UPLOAD_URL;

/**
 * Get signed upload parameters from backend
 * @param {string} folder - Optional folder name (default: 'blog')
 * @returns {Promise<Object>} Signed upload parameters
 */
export const getUploadSignature = async (folder = "blog") => {
  const response = await apiClient.post("/upload/signature", { folder });
  return response.data.data;
};

/**
 * Upload file directly to Cloudinary
 * @param {File} file - The file to upload
 * @param {Object} signatureParams - Signed upload parameters from backend
 * @param {string} folder - Optional folder name
 * @returns {Promise<Object>} Upload result with secure_url and public_id
 */
export const uploadToCloudinary = async (file, signatureParams, folder = "blog") => {
  const { signature, timestamp, cloud_name, api_key } = signatureParams;

  // Create FormData for Cloudinary upload
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", api_key);
  formData.append("signature", signature);
  formData.append("timestamp", timestamp);
  formData.append("folder", folder);

  // Upload to Cloudinary
  const response = await fetch(
    `${CLOUDINARY_UPLOAD_URL}/${cloud_name}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Failed to upload image to Cloudinary");
  }

  const data = await response.json();
  return {
    secure_url: data.secure_url,
    public_id: data.public_id,
  };
};

/**
 * Upload image with automatic signature fetching
 * @param {File} file - The file to upload
 * @param {string} folder - Optional folder name (default: 'blog')
 * @returns {Promise<Object>} Upload result with secure_url and public_id
 */
export const uploadImage = async (file, folder = "blog") => {
  // Get signed upload parameters from backend
  const signatureParams = await getUploadSignature(folder);

  // Upload directly to Cloudinary
  return uploadToCloudinary(file, signatureParams, folder);
};

