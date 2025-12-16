/**
 * Posts Hooks - Custom hooks for posts business logic
 * Following React 19 best practices with optimized performance
 */
import { useCallback, useMemo, useEffect } from "react";
import { usePostsContext } from "../contexts/postsContext";
import { POSTS_ACTIONS, POST_TABS } from "../utils/constants";
import { useAuth } from "./authHooks";
import {
  getUserPosts,
  createPost,
  updatePost,
  deletePost,
  getPost,
} from "../services/postService";
import toast from "react-hot-toast";

/**
 * Hook for posts data management
 */
export function usePosts() {
  const { state, dispatch } = usePostsContext();
  const { user } = useAuth();

  // Memoized filtered posts for search
  const filteredPosts = useMemo(() => {
    if (!state.searchQuery.trim()) return state.posts;

    const query = state.searchQuery.toLowerCase();
    return state.posts.filter(
      (post) =>
        post.title.toLowerCase().includes(query) ||
        post.body.toLowerCase().includes(query),
    );
  }, [state.posts, state.searchQuery]);

  // Fetch posts function
  const fetchPosts = useCallback(
    async (page = 1) => {
      if (!user?.id) {
        dispatch({ type: POSTS_ACTIONS.SET_LOADING, payload: false });
        return;
      }

      dispatch({ type: POSTS_ACTIONS.SET_LOADING, payload: true });

      try {
        const response = await getUserPosts(user.id, {
          page,
          limit: state.pagination.limit,
        });

        const { posts: userPosts, meta } = response.data.data;

        dispatch({ type: POSTS_ACTIONS.SET_POSTS, payload: userPosts });
        dispatch({ type: POSTS_ACTIONS.SET_PAGINATION, payload: meta });
      } catch (error) {
        const errorMessage =
          error?.response?.data?.message ||
          "Failed to fetch posts. Please try again.";

        dispatch({ type: POSTS_ACTIONS.SET_ERROR, payload: errorMessage });
        toast.error(errorMessage);
      }
    },
    [user?.id, state.pagination.limit, dispatch],
  );

  // Auto-fetch posts when user changes
  useEffect(() => {
    if (user?.id) {
      fetchPosts();
    }
  }, [user?.id, fetchPosts]);

  // Search function with debouncing
  const setSearchQuery = useCallback(
    (query) => {
      dispatch({ type: POSTS_ACTIONS.SET_SEARCH_QUERY, payload: query });
    },
    [dispatch],
  );

  // Tab management
  const setActiveTab = useCallback(
    (tab) => {
      dispatch({ type: POSTS_ACTIONS.SET_ACTIVE_TAB, payload: tab });
    },
    [dispatch],
  );

  // Page change
  const changePage = useCallback(
    (newPage) => {
      fetchPosts(newPage);
    },
    [fetchPosts],
  );

  return {
    // State
    posts: state.posts,
    filteredPosts,
    loading: state.loading,
    pagination: state.pagination,
    searchQuery: state.searchQuery,
    activeTab: state.activeTab,
    error: state.error,

    // Actions
    fetchPosts,
    setSearchQuery,
    setActiveTab,
    changePage,
  };
}

/**
 * Hook for post CRUD operations
 */
export function usePostOperations() {
  const { dispatch } = usePostsContext();

  // Create post with optimistic update
  const createPostOptimistic = useCallback(
    async (postData) => {
      const loadingToast = toast.loading("Creating post...");

      try {
        const response = await createPost(postData);
        const newPost = response.data.data;

        // Optimistic update
        dispatch({ type: POSTS_ACTIONS.ADD_POST, payload: newPost });

        toast.dismiss(loadingToast);
        toast.success("Post created successfully!");

        // Switch to list tab
        dispatch({
          type: POSTS_ACTIONS.SET_ACTIVE_TAB,
          payload: POST_TABS.LIST,
        });

        return newPost;
      } catch (error) {
        toast.dismiss(loadingToast);
        const errorMessage =
          error?.response?.data?.message ||
          error?.response?.data?.data?.message ||
          "Failed to create post. Please try again.";

        toast.error(errorMessage);
        throw error;
      }
    },
    [dispatch],
  );

  // Update post with optimistic update
  const updatePostOptimistic = useCallback(
    async (postId, postData) => {
      const loadingToast = toast.loading("Updating post...");

      try {
        const response = await updatePost(postId, postData);
        const updatedPost = response.data.data;

        // Optimistic update
        dispatch({ type: POSTS_ACTIONS.UPDATE_POST, payload: updatedPost });

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
        throw error;
      }
    },
    [dispatch],
  );

  // Delete post with optimistic update
  const deletePostOptimistic = useCallback(
    async (postId) => {
      const loadingToast = toast.loading("Deleting post...");

      try {
        await deletePost(postId);

        // Optimistic update
        dispatch({ type: POSTS_ACTIONS.DELETE_POST, payload: postId });

        toast.dismiss(loadingToast);
        toast.success("Post deleted successfully!");
      } catch (error) {
        toast.dismiss(loadingToast);
        const errorMessage =
          error?.response?.data?.message ||
          error?.response?.data?.data?.message ||
          "Failed to delete post. Please try again.";

        toast.error(errorMessage);
        throw error;
      }
    },
    [dispatch],
  );

  return {
    createPost: createPostOptimistic,
    updatePost: updatePostOptimistic,
    deletePost: deletePostOptimistic,
  };
}

/**
 * Hook for dialog management
 */
export function usePostDialogs() {
  const { state, dispatch } = usePostsContext();

  // Edit dialog
  const openEditDialog = useCallback(
    (post) => {
      dispatch({ type: POSTS_ACTIONS.OPEN_EDIT_DIALOG, payload: post });
    },
    [dispatch],
  );

  const closeEditDialog = useCallback(() => {
    dispatch({ type: POSTS_ACTIONS.CLOSE_EDIT_DIALOG });
  }, [dispatch]);

  // View dialog
  const openViewDialog = useCallback(
    async (post) => {
      dispatch({ type: POSTS_ACTIONS.OPEN_VIEW_DIALOG, payload: post });

      // Fetch full post details
      dispatch({ type: POSTS_ACTIONS.SET_VIEW_DIALOG_LOADING, payload: true });

      try {
        const response = await getPost(post.id);
        dispatch({
          type: POSTS_ACTIONS.SET_FULL_POST,
          payload: response.data.data,
        });
      } catch (error) {
        const errorMessage =
          error?.response?.data?.message || "Failed to fetch post details.";
        toast.error(errorMessage);
        dispatch({
          type: POSTS_ACTIONS.SET_VIEW_DIALOG_LOADING,
          payload: false,
        });
      }
    },
    [dispatch],
  );

  const closeViewDialog = useCallback(() => {
    dispatch({ type: POSTS_ACTIONS.CLOSE_VIEW_DIALOG });
  }, [dispatch]);

  // Delete dialog
  const openDeleteDialog = useCallback(
    (postId) => {
      dispatch({ type: POSTS_ACTIONS.OPEN_DELETE_DIALOG, payload: postId });
    },
    [dispatch],
  );

  const closeDeleteDialog = useCallback(() => {
    dispatch({ type: POSTS_ACTIONS.CLOSE_DELETE_DIALOG });
  }, [dispatch]);

  return {
    // Edit dialog
    editDialog: state.dialogs.edit,
    openEditDialog,
    closeEditDialog,

    // View dialog
    viewDialog: state.dialogs.view,
    openViewDialog,
    closeViewDialog,

    // Delete dialog
    deleteDialog: state.dialogs.delete,
    openDeleteDialog,
    closeDeleteDialog,
  };
}
