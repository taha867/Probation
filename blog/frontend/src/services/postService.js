/**
 * Post Service - Complete post management with business logic
 * Handles all post-related operations with error handling and notifications
 */
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";

export const fetchUserPosts = async (userId, options = {}) => {
  if (!userId) {
    throw new Error("User ID is required to fetch posts");
  }

  try {
    const response = await axiosInstance.get(`/users/${userId}/posts`, {
      params: options,
    });
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
  const loadingToast = toast.loading("Creating post...");

  try {
    const response = await axiosInstance.post("/posts", postData);
    const newPost = response.data.data;

    toast.dismiss(loadingToast);
    toast.success("Post created successfully!");

    return newPost;
  } catch (error) {
    toast.dismiss(loadingToast);
    const errorMessage =
      error?.response?.data?.message ||
      error?.response?.data?.data?.message ||
      "Failed to create post. Please try again.";

    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

export const updatePost = async (postId, postData) => {
  const loadingToast = toast.loading("Updating post...");

  try {
    const response = await axiosInstance.put(`/posts/${postId}`, postData);
    const updatedPost = response.data.data;

    toast.dismiss(loadingToast);
    toast.success("Post updated successfully!");

    return updatedPost;
  } catch (error) {
    toast.dismiss(loadingToast);
    const errorMessage =
      error?.response?.data?.message ||
      error?.response?.data?.data?.message ||
      "Failed to update post. Please try again.";

    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

export const deletePost = async (postId) => {
  const loadingToast = toast.loading("Deleting post...");

  try {
    await axiosInstance.delete(`/posts/${postId}`);

    toast.dismiss(loadingToast);
    toast.success("Post deleted successfully!");
  } catch (error) {
    toast.dismiss(loadingToast);
    const errorMessage =
      error?.response?.data?.message ||
      error?.response?.data?.data?.message ||
      "Failed to delete post. Please try again.";

    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

export const getPostDetails = async (postId) => {
  try {
    const response = await axiosInstance.get(`/posts/${postId}`);
    return response.data.data;
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message || "Failed to fetch post details.";

    toast.error(errorMessage);
    throw new Error(errorMessage);
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
