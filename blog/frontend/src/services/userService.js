import apiClient from "../utils/axiosInstance";

/**
 * Fetch current authenticated user's profile from backend
 * returns Current user data including id, name, email, image
 */
export const fetchCurrentUserProfile = async () => {
  const response = await apiClient.get("/users/me");
  return response.data;
};

/**
 * Update user profile
 * @param {number} userId - User ID
 * @param {FormData|Object} payload - FormData for file uploads or JSON object for other fields
 */
export const updateUserProfile = async (userId, payload) => {
  // If FormData, axios will automatically set Content-Type with boundary
  const response = await apiClient.put(`/users/${userId}`, payload);
  return response.data;
};
