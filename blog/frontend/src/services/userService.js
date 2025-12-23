/**
 * User service - API calls for user operations
 * Handles user profile updates including Cloudinary image URLs
 */
import apiClient from "../utils/axiosInstance";

/**
 * Update user profile
 * @param {number} userId - The user ID
 * @param {Object} payload - JSON payload containing user fields and optional image URL/publicId
 * @returns {Promise<Object>} Updated user data
 */
export const updateUserProfile = async (userId, payload) => {
  const response = await apiClient.put(`/users/${userId}`, payload);
  return response.data;
};

