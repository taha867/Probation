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
 */
export const updateUserProfile = async (userId, payload) => {
  const response = await apiClient.put(`/users/${userId}`, payload);
  return response.data;
};
