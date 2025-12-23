import axiosInstance from "../utils/axiosInstance";

// Original API function for fetching user posts (used by postsPromise.js)
export const fetchUserPosts = async (userId, options = {}) => {
  if (!userId) {
    throw new Error("User ID is required to fetch posts");
  }

  try {
    const response = await axiosInstance.get(`/users/${userId}/posts`, {
      params: options,
    });
    const { data: { data } = {} } = response;
    const { posts: userPosts = {}, meta = {} } = data;

    return {
      posts: userPosts,
      pagination: meta,
    };
  } catch (error) {
    const { response: { data: { message } = {} } = {} } = error || {};

    const errorMessage = message || "Failed to fetch posts. Please try again.";

    throw new Error(errorMessage);
  }
};

export const searchPosts = (posts, searchQuery) => {
  if (!searchQuery.trim()) return posts;

  const query = searchQuery.toLowerCase();
  return posts.filter(
    (post) =>
      post.title.toLowerCase().includes(query) ||
      post.body.toLowerCase().includes(query)
  );
};

export const getPostDetails = async (postId) => {
  try {
    const response = await axiosInstance.get(`/posts/${postId}`);
    const { data: { data } = {} } = response;
    return data;
  } catch (error) {
    throw error; // Error message handled by axios interceptor
  }
};

// Keep getPosts and getPostComments as they might be used elsewhere
export const getPosts = async (params = {}) => {
  try {
    const response = await axiosInstance.get("/posts", { params });
    const { data = {} } = response;
    return data;
  } catch (error) {
    const { response: { data: { message } = {} } = {} } = error || {};
    const errorMessage = message || "Failed to fetch posts. Please try again.";
    throw new Error(errorMessage);
  }
};

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
 * Pure service functions - no React dependencies
 * These functions only handle API calls and return data
 * State management is handled by React Query hooks
 */

/**
 * Pure business logic functions (no React dependencies)
 */

// Search/filter posts - uses the reusable searchPosts function
export const filterPosts = (posts, searchQuery) => {
  return searchPosts(posts, searchQuery);
};

// Calculate total pages - pure function
export const calculateTotalPages = (total, limit) => {
  return Math.ceil(total / limit);
};

/**
 * Fetch all public posts (for home page)
 * Business logic: Fetches all posts from the API
 * Filters published posts on client side if needed
 */
export const fetchAllPosts = async (options = {}) => {
  try {
    const response = await axiosInstance.get("/posts", {
      params: options,
    });
    const { data: { data } = {} } = response;
    // Backend returns "items" and "meta"
    const { items = [], meta = {} } = data;

    return {
      posts: items,
      pagination: meta,
    };
  } catch (error) {
    const { response: { data: { message } = {} } = {} } = error || {};
    const errorMessage = message || "Failed to fetch posts. Please try again.";
    throw new Error(errorMessage);
  }
};
