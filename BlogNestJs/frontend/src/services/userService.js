import { fetchClient } from "../middleware/fetchClient";

/**
 * Fetch current authenticated user's profile from backend
 * returns Current user data including id, name, email, image, phone no
 */
export const fetchCurrentUserProfile = async () => {
  const response = await fetchClient("/users/me", {
    method: "GET",
  });
  return response;
};

/**
 * Update user profile
 * @param {number} userId - User ID
 * @param {FormData|Object} payload - FormData for file uploads or JSON object for other fields
 */
export const updateUserProfile = async (userId, payload) => {
  // fetchClient automatically handles Content-Type for both FormData and JSON
  const response = await fetchClient(`/users/${userId}`, {
    method: "PUT",
    body: payload instanceof FormData ? payload : JSON.stringify(payload),
  });
  return response;
};
