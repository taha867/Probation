import { fetchClient } from "../middleware/fetchClient";
import { buildQueryString } from "../utils/queryParams";

/**
 * Get comments for a specific post
 * @param {number} postId - Post ID
 * @param {Object} params - Query parameters (page, limit, etc.)
 */
export const getPostComments = async (postId, params = {}) => {
  const queryParams = buildQueryString(params);
  const response = await fetchClient(`/posts/${postId}/comments?${queryParams}`, {
    method: "GET",
  });
  return response.data;
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
  const response = await fetchClient("/comments", {
    method: "POST",
    body: JSON.stringify(commentData),
  });
  return response.data;
};

/**
 * Update an existing comment
 * @param {number} commentId - Comment ID to update
 * @param {string} body - Updated comment content
 * @returns {Promise<Object>} Updated comment
 */
export const updateComment = async (commentId, body) => {
  const response = await fetchClient(`/comments/${commentId}`, {
    method: "PUT",
    body: JSON.stringify({ body }),
  });
  return response.data;
};

/**
 * Delete a comment
 * @param {number} commentId - Comment ID to delete
 * @returns {Promise<Object>} Deletion result
 */
export const deleteComment = async (commentId) => {
  const response = await fetchClient(`/comments/${commentId}`, {
    method: "DELETE",
  });
  return response.data;
};
