/**
 * Post Service - API calls for post management
 * Handles all post-related HTTP requests
 */
import axiosInstance from "../utils/axiosInstance";

export const createPost = async (postData) => {
  return await axiosInstance.post("/posts", postData);
};

// Get all posts with pagination and filtering
export const getPosts = async (params = {}) => {
  return await axiosInstance.get("/posts", { params });
};

// Get posts for a specific user
export const getUserPosts = async (userId, params = {}) => {
  return await axiosInstance.get(`/users/${userId}/posts`, { params });
};

//Get a specific post by ID

export const getPost = async (postId) => {
  return await axiosInstance.get(`/posts/${postId}`);
};

/**
 * Update a post
 * @param {number} postId - Post ID
 * @param {Object} postData - Updated post data
 * @returns {Promise} API response
 */
export const updatePost = async (postId, postData) => {
  return await axiosInstance.put(`/posts/${postId}`, postData);
};

export const deletePost = async (postId) => {
  return await axiosInstance.delete(`/posts/${postId}`);
};

//Get comments for a specific post

export const getPostComments = async (postId, params = {}) => {
  return await axiosInstance.get(`/posts/${postId}/comments`, { params });
};
