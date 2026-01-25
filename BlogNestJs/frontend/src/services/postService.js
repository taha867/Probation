import { fetchClient } from "../middleware/fetchClient";
import { buildQueryString } from "../utils/queryParams";

// Original API function for fetching user posts (used by postsPromise.js)
export const fetchUserPosts = async (userId, options = {}) => {
  if (!userId) {
    throw new Error("User ID is required to fetch posts");
  }

  const params = buildQueryString(options);
  const response = await fetchClient(`/users/${userId}/posts?${params}`, {
    method: "GET",
  });
  const { posts = [], paginationOptions = {} } = response.data || {};

  return {
    posts,
    pagination: paginationOptions,
  };
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
  const response = await fetchClient(`/posts/${postId}`, {
    method: "GET",
  });
  return response.data;
};

export const getPosts = async (params = {}) => {
  const queryParams = buildQueryString(params);
  const response = await fetchClient(`/posts?${queryParams}`, {
    method: "GET",
  });
  return response.data;
};

// Search/filter posts - uses the reusable searchPosts function
export const filterPosts = (posts, searchQuery) => {
  return searchPosts(posts, searchQuery);
};

// Calculate total pages - pure function
export const calculateTotalPages = (total, limit) => {
  return Math.ceil(total / limit);
};

/**
 * Create a new post
 */
export const createPost = async (formData) => {
  const response = await fetchClient("/posts", {
    method: "POST",
    body: formData,
  });
  return response.data;
};

/**
 * Update an existing post
 */
export const updatePost = async (postId, formData) => {
  const response = await fetchClient(`/posts/${postId}`, {
    method: "PUT",
    body: formData,
  });
  return response.data;
};

/**
 * Delete a post
 */
export const deletePost = async (postId) => {
  await fetchClient(`/posts/${postId}`, {
    method: "DELETE",
  });
};

/**
 * Fetch all public posts (for home page)
 * Business logic: Fetches all posts from the API
 * Filters published posts on client side if needed
 */
export const fetchAllPosts = async (options = {}) => {
  const params = buildQueryString(options);
  const response = await fetchClient(`/posts?${params}`, {
    method: "GET",
  });
  // Backend returns "items" and "paginationOptions"
  const { items = [], paginationOptions = {} } = response.data || {};

  return {
    posts: items,
    pagination: paginationOptions,
  };
};
