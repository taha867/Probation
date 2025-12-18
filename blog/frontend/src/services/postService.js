import axiosInstance from "../utils/axiosInstance";
import { POSTS_ACTIONS } from "../utils/constants";

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

// Keep getPostDetails as it's used by ViewPostDialog
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

const { SET_POSTS, SET_PAGINATION, ADD_POST, UPDATE_POST, DELETE_POST } =
  POSTS_ACTIONS;

/**
 * Fetch posts with state management and transitions
 * Handles the complete flow: API call → state update → UI feedback
 */
export const fetchPosts = async (
  userId,
  options,
  dispatch,
  startTransition
) => {
  if (!userId) {
    return;
  }

  try {
    // Delegate API call to service function
    const result = await fetchUserPosts(userId, options);

    // Non-urgent: Update posts data in background for smooth UX
    startTransition(() => {
      dispatch({ type: SET_POSTS, payload: result.posts });
      dispatch({
        type: SET_PAGINATION,
        payload: {
          limit: result.pagination.limit,
          total: result.pagination.total,
        },
      });
    });

    return result;
  } catch (error) {
    // Error handled by axios interceptor (toast notification)
    console.error("Error fetching posts:", error);
    const { response: { data: { message } = {} } = {} } = error || {};
    const errorMessage = message || "Failed to fetch posts. Please try again.";
    throw new Error(errorMessage);
  }
};

/**
 * Create post with optimistic updates and transitions
 */
export const createPost = async (postData, dispatch, startTransition) => {
  try {
    // Direct axios call integrated into workflow
    const response = await axiosInstance.post("/posts", postData);
    const { data: { data } = {} } = response;
    const newPost = data;

    // Non-urgent: Update post list in background
    startTransition(() => {
      dispatch({ type: ADD_POST, payload: newPost });
    });

    return newPost;
  } catch (error) {
    // Error handling is done by axios interceptor, just re-throw for component
    throw error;
  }
};

/**
 * Update post with optimistic updates and transitions
 */
export const updatePost = async (
  postId,
  postData,
  dispatch,
  startTransition
) => {
  try {
    // Direct axios call integrated into workflow
    const response = await axiosInstance.put(`/posts/${postId}`, postData);
    const { data: { data } = {} } = response;
    const updatedPost = data;

    // Non-urgent: Update post list in background
    startTransition(() => {
      dispatch({ type: UPDATE_POST, payload: updatedPost });
    });

    return updatedPost;
  } catch (error) {
    // Error handling is done by axios interceptor, just re-throw for component
    throw error;
  }
};

/**
 * Delete post with optimistic updates and transitions
 */
export const deletePost = async (postId, dispatch, startTransition) => {
  try {
    // Direct axios call integrated into workflow
    await axiosInstance.delete(`/posts/${postId}`);

    // Non-urgent: Update post list in background
    startTransition(() => {
      dispatch({ type: DELETE_POST, payload: postId });
    });
  } catch (error) {
    // Error handling is done by axios interceptor, just re-throw for component
    throw error;
  }
};

/**
 * Page change with transitions
 * Handles: pagination update → fetch new data → UI feedback
 */
export const changePage = async (
  userId,
  newPage,
  pagination,
  dispatch,
  startTransition
) => {
  // Fetch new data with transition
  startTransition(() => {
    fetchPosts(
      userId,
      { page: newPage, limit: pagination.limit },
      dispatch,
      startTransition
    );
  });
};

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
