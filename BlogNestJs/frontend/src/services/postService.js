import { fetchClient } from "../middleware/fetchClient";
import { buildQueryString } from "../utils/queryParams";


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


export const filterPosts = (posts, searchQuery) => {
  return searchPosts(posts, searchQuery);
};


export const calculateTotalPages = (total, limit) => {
  return Math.ceil(total / limit);
};


export const createPost = async (formData) => {
  const response = await fetchClient("/posts", {
    method: "POST",
    body: formData,
  });
  return response.data;
};


export const updatePost = async (postId, formData) => {
  const response = await fetchClient(`/posts/${postId}`, {
    method: "PUT",
    body: formData,
  });
  return response.data;
};


export const deletePost = async (postId) => {
  await fetchClient(`/posts/${postId}`, {
    method: "DELETE",
  });
};

/**
 * Fetch all public posts (for home page)
 */
export const fetchAllPosts = async (options = {}) => {
  const params = buildQueryString(options);
  const response = await fetchClient(`/posts?${params}`, {
    method: "GET",
  });

  const { items = [], paginationOptions = {} } = response.data || {};

  return {
    posts: items,
    pagination: paginationOptions,
  };
};
