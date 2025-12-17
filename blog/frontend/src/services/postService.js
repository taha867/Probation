/**
 * Post Service - Complete post management with business logic
 * Handles all post-related operations (notifications handled by axios interceptors)
 */
import axiosInstance from "../utils/axiosInstance";

export const fetchUserPosts = async (userId, options = {}) => {
  if (!userId) {
    throw new Error("User ID is required to fetch posts");
  }

  try {
    const response = await axiosInstance.get(`/users/${userId}/posts`, {
      params: options,
    });
    // const { posts: userPosts, meta } = response.data.data;
    const {data } = response || {}
    const { posts: userPosts, meta } = response.data.data;

    return {
      posts: userPosts,
      pagination: meta,
    };
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message ||
      "Failed to fetch posts. Please try again.";

    throw new Error(errorMessage);
  }
};

export const createPost = async (postData) => {
  try {
    const response = await axiosInstance.post("/posts", postData);
    return response.data.data;
  } catch (error) {
    throw error; // Error message handled by axios interceptor
  }
};

export const updatePost = async (postId, postData) => {
  try {
    const response = await axiosInstance.put(`/posts/${postId}`, postData);
    return response.data.data;
  } catch (error) {
    throw error; // Error message handled by axios interceptor
  }
};

export const deletePost = async (postId) => {
  try {
    await axiosInstance.delete(`/posts/${postId}`);
  } catch (error) {
    throw error; // Error message handled by axios interceptor
  }
};

export const getPostDetails = async (postId) => {
  try {
    const response = await axiosInstance.get(`/posts/${postId}`);
    return response.data.data;
  } catch (error) {
    throw error; // Error message handled by axios interceptor
  }
};

export const getPosts = async (params = {}) => {
  try {
    const response = await axiosInstance.get("/posts", { params });
    return response.data;
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message || "Failed to fetch posts.";
    throw new Error(errorMessage);
  }
};

export const getPostComments = async (postId, params = {}) => {
  try {
    const response = await axiosInstance.get(`/posts/${postId}/comments`, {
      params,
    });
    return response.data;
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message || "Failed to fetch comments.";
    throw new Error(errorMessage);
  }
};

export const searchPosts = (posts, searchQuery) => {
  if (!searchQuery.trim()) return posts;

  const query = searchQuery.toLowerCase();
  return posts.filter(
    (post) =>
      post.title.toLowerCase().includes(query) ||
      post.body.toLowerCase().includes(query),
  );
};
