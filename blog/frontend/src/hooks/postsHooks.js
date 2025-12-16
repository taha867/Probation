/**
 * Posts Hooks - React integration layer for posts
 * Handles React-specific logic: state management, side effects, memoization
 * Business logic is delegated to postService
 */
import { useCallback, useMemo, useEffect } from "react";
import { usePostsContext } from "../contexts/postsContext";
import { POSTS_ACTIONS, POST_TABS } from "../utils/constants";
import { useAuth } from "./authHooks";
import {
  fetchUserPosts,
  createPost,
  updatePost,
  deletePost,
  getPostDetails,
  searchPosts,
} from "../services/postService";

//Hook for posts data management

export function usePosts() {
  const { state, dispatch } = usePostsContext();
  const { user } = useAuth();

  const { posts, searchQuery, pagination, activeTab, loading, error } = state;
  const filteredPosts = useMemo(() => {
    return searchPosts(posts, searchQuery);
  }, [posts, searchQuery]);

  const {
    SET_LOADING,
    SET_POSTS,
    SET_PAGINATION,
    SET_ERROR,
    SET_SEARCH_QUERY,
    SET_ACTIVE_TAB,
  } = POSTS_ACTIONS;

  // Fetch posts function
  const fetchPosts = useCallback(
    async (page = 1) => {
      if (!user?.id) {
        dispatch({ type: SET_LOADING, payload: false });
        return;
      }

      dispatch({ type: SET_LOADING, payload: true });

      try {
        // Delegate business logic to service
        const result = await fetchUserPosts(user.id, {
          page,
          limit: pagination.limit,
        });

        // Use direct property access to avoid variable name conflicts
        dispatch({ type: SET_POSTS, payload: result.posts });
        dispatch({
          type: SET_PAGINATION,
          payload: result.pagination,
        });
      } catch (error) {
        dispatch({ type: SET_ERROR, payload: error.message });
      }
    },
    [user?.id, pagination.limit, dispatch],
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
      dispatch({ type: SET_SEARCH_QUERY, payload: query });
    },
    [dispatch],
  );

  // Tab management
  const setActiveTab = useCallback(
    (tab) => {
      dispatch({ type: SET_ACTIVE_TAB, payload: tab });
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
    posts: posts,
    filteredPosts,
    loading: loading,
    pagination: pagination,
    searchQuery: searchQuery,
    activeTab: activeTab,
    error: error,

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
  const { SET_ACTIVE_TAB, ADD_POST, UPDATE_POST, DELETE_POST } = POSTS_ACTIONS;

  const { LIST } = POST_TABS;

  // Create post with optimistic update - React integration only
  const createPostOptimistic = useCallback(
    async (postData) => {
      try {
        const newPost = await createPost(postData);

        // React-specific: Optimistic update
        dispatch({ type: ADD_POST, payload: newPost });

        // React-specific: Switch to list tab
        dispatch({
          type: SET_ACTIVE_TAB,
          payload: LIST,
        });

        return newPost;
      } catch (error) {
        // Error handling is done in service, just re-throw
        throw error;
      }
    },
    [dispatch],
  );

  // Update post with optimistic update - React integration only
  const updatePostOptimistic = useCallback(
    async (postId, postData) => {
      try {
        // Delegate business logic to service
        const updatedPost = await updatePost(postId, postData);

        // React-specific: Optimistic update
        dispatch({ type: UPDATE_POST, payload: updatedPost });

        return updatedPost;
      } catch (error) {
        // Error handling is done in service, just re-throw
        throw error;
      }
    },
    [dispatch],
  );

  // Delete post with optimistic update - React integration only
  const deletePostOptimistic = useCallback(
    async (postId) => {
      try {
        // Delegate business logic to service
        await deletePost(postId);

        // React-specific: Optimistic update
        dispatch({ type: DELETE_POST, payload: postId });
      } catch (error) {
        // Error handling is done in service, just re-throw
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
  const {
    OPEN_EDIT_DIALOG,
    CLOSE_EDIT_DIALOG,
    OPEN_VIEW_DIALOG,
    SET_VIEW_DIALOG_LOADING,
  } = POSTS_ACTIONS;

  // Edit dialog
  const openEditDialog = useCallback(
    (post) => {
      dispatch({ type: OPEN_EDIT_DIALOG, payload: post });
    },
    [dispatch],
  );

  const closeEditDialog = useCallback(() => {
    dispatch({ type: CLOSE_EDIT_DIALOG });
  }, [dispatch]);

  // View dialog - React integration only
  const openViewDialog = useCallback(
    async (post) => {
      // React-specific: Open dialog and set loading
      dispatch({ type: OPEN_VIEW_DIALOG, payload: post });
      dispatch({ type: SET_VIEW_DIALOG_LOADING, payload: true });

      try {
        // Delegate business logic to service
        const fullPost = await getPostDetails(post.id);

        // React-specific: Update state
        dispatch({
          type: POSTS_ACTIONS.SET_FULL_POST,
          payload: fullPost,
        });
      } catch (error) {
        // React-specific: Handle loading state
        dispatch({
          type: SET_VIEW_DIALOG_LOADING,
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
