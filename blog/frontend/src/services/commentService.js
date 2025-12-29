import axiosInstance from "../utils/axiosInstance";

/**
 * Get comments for a specific post
 * @param {number} postId - Post ID
 * @param {Object} params - Query parameters (page, limit, etc.)
 */
export const getPostComments = async (postId, params = {}) => {
  try {
    const response = await axiosInstance.get(`/posts/${postId}/comments`, {
      params,
    });
    const { data = {} } = response;
    return data;
  } catch (error) {
    const { response: { data: { message } = {} } = {} } = error || {};
    const errorMessage = message || "Failed to fetch comments";
    throw new Error(errorMessage);
  }
};

/**
 * Create a new comment or reply
 * @param {Object} commentData - Comment data
 * @param {string} commentData.body - Comment content
 * @param {number} [commentData.postId] - Post ID (for top-level comments)
 * @param {number} [commentData.parentId] - Parent comment ID (for replies)
 * @returns {Promise<Object>} Created comment
 */
export const createComment = async (commentData) => {
  try {
    const response = await axiosInstance.post("/comments", commentData);
    const { data: { data } = {} } = response;
    return data;
  } catch (error) {
    throw error; // Error message handled by axios interceptor
  }
};

/**
 * Update an existing comment
 * @param {number} commentId - Comment ID to update
 * @param {string} body - Updated comment content
 * @returns {Promise<Object>} Updated comment
 */
export const updateComment = async (commentId, body) => {
  try {
    const response = await axiosInstance.put(`/comments/${commentId}`, {
      body,
    });
    const { data: { data } = {} } = response;
    return data;
  } catch (error) {
    throw error; // Error message handled by axios interceptor
  }
};

/**
 * Delete a comment
 * @param {number} commentId - Comment ID to delete
 * @returns {Promise<Object>} Deletion result
 */
export const deleteComment = async (commentId) => {
  try {
    const response = await axiosInstance.delete(`/comments/${commentId}`);
    const { data: { data } = {} } = response;
    return data;
  } catch (error) {
    throw error; // Error message handled by axios interceptor
  }
};
