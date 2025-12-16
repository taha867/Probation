import { POSTS_ACTIONS, POST_TABS } from "../utils/constants";

// Posts reducer for managing all post-related state
export const initialPostsState = {
  // Data state
  posts: [],
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },

  // UI state
  loading: false,
  searchQuery: "",
  activeTab: POST_TABS.LIST,

  // Dialog state
  dialogs: {
    edit: { isOpen: false, post: null },
    view: { isOpen: false, post: null, fullPost: null, loading: false },
    delete: { isOpen: false, postId: null },
  },

  // Error state
  error: null,
};

const {
  SET_LOADING,
  SET_POSTS,
  SET_PAGINATION,
  ADD_POST,
  UPDATE_POST,
  DELETE_POST,
  SET_SEARCH_QUERY,
  SET_ACTIVE_TAB,
  OPEN_EDIT_DIALOG,
  CLOSE_EDIT_DIALOG,
  OPEN_VIEW_DIALOG,
  CLOSE_VIEW_DIALOG,
  SET_VIEW_DIALOG_LOADING,
  SET_FULL_POST,
  OPEN_DELETE_DIALOG,
  CLOSE_DELETE_DIALOG,
  SET_ERROR,
  CLEAR_ERROR,
} = POSTS_ACTIONS;

export function postsReducer(state, action) {
  switch (action.type) {
    case SET_LOADING:
      return { ...state, loading: action.payload };

    case SET_POSTS:
      return {
        ...state,
        posts: action.payload,
        loading: false,
        error: null,
      };

    case SET_PAGINATION:
      return { ...state, pagination: action.payload };

    case ADD_POST:
      return {
        ...state,
        posts: [action.payload, ...state.posts],
        pagination: {
          ...state.pagination,
          total: state.pagination.total + 1,
        },
      };

    case UPDATE_POST:
      return {
        ...state,
        posts: state.posts.map((post) =>
          post.id === action.payload.id ? action.payload : post,
        ),
      };

    case DELETE_POST:
      return {
        ...state,
        posts: state.posts.filter((post) => post.id !== action.payload),
        pagination: {
          ...state.pagination,
          total: Math.max(0, state.pagination.total - 1),
        },
      };

    case SET_SEARCH_QUERY:
      return { ...state, searchQuery: action.payload };

    case SET_ACTIVE_TAB:
      return { ...state, activeTab: action.payload };

    case OPEN_EDIT_DIALOG:
      return {
        ...state,
        dialogs: {
          ...state.dialogs,
          edit: { isOpen: true, post: action.payload },
          view: { ...state.dialogs.view, isOpen: false }, // Close view dialog
        },
      };

    case CLOSE_EDIT_DIALOG:
      return {
        ...state,
        dialogs: {
          ...state.dialogs,
          edit: { isOpen: false, post: null },
        },
      };

    case OPEN_VIEW_DIALOG:
      return {
        ...state,
        dialogs: {
          ...state.dialogs,
          view: {
            isOpen: true,
            post: action.payload,
            fullPost: null,
            loading: false,
          },
        },
      };

    case CLOSE_VIEW_DIALOG:
      return {
        ...state,
        dialogs: {
          ...state.dialogs,
          view: { isOpen: false, post: null, fullPost: null, loading: false },
        },
      };

    case SET_VIEW_DIALOG_LOADING:
      return {
        ...state,
        dialogs: {
          ...state.dialogs,
          view: { ...state.dialogs.view, loading: action.payload },
        },
      };

    case SET_FULL_POST:
      return {
        ...state,
        dialogs: {
          ...state.dialogs,
          view: {
            ...state.dialogs.view,
            fullPost: action.payload,
            loading: false,
          },
        },
      };

    case OPEN_DELETE_DIALOG:
      return {
        ...state,
        dialogs: {
          ...state.dialogs,
          delete: { isOpen: true, postId: action.payload },
          view: { ...state.dialogs.view, isOpen: false }, // Close view dialog
        },
      };

    case CLOSE_DELETE_DIALOG:
      return {
        ...state,
        dialogs: {
          ...state.dialogs,
          delete: { isOpen: false, postId: null },
        },
      };

    case SET_ERROR:
      return { ...state, error: action.payload, loading: false };

    case CLEAR_ERROR:
      return { ...state, error: null };

    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}

// Action creators for better type safety and consistency
export const postsActions = {
  setLoading: (loading) => ({
    type: SET_LOADING,
    payload: loading,
  }),

  setPosts: (posts) => ({
    type: SET_POSTS,
    payload: posts,
  }),

  setPagination: (pagination) => ({
    type: SET_PAGINATION,
    payload: pagination,
  }),

  addPost: (post) => ({
    type: ADD_POST,
    payload: post,
  }),

  updatePost: (post) => ({
    type: UPDATE_POST,
    payload: post,
  }),

  deletePost: (postId) => ({
    type: DELETE_POST,
    payload: postId,
  }),

  setSearchQuery: (query) => ({
    type: SET_SEARCH_QUERY,
    payload: query,
  }),

  setActiveTab: (tab) => ({
    type: SET_ACTIVE_TAB,
    payload: tab,
  }),

  openEditDialog: (post) => ({
    type: OPEN_EDIT_DIALOG,
    payload: post,
  }),

  closeEditDialog: () => ({
    type: CLOSE_EDIT_DIALOG,
  }),

  openViewDialog: (post) => ({
    type: OPEN_VIEW_DIALOG,
    payload: post,
  }),

  closeViewDialog: () => ({
    type: CLOSE_VIEW_DIALOG,
  }),

  setViewDialogLoading: (loading) => ({
    type: SET_VIEW_DIALOG_LOADING,
    payload: loading,
  }),

  setFullPost: (post) => ({
    type: SET_FULL_POST,
    payload: post,
  }),

  openDeleteDialog: (postId) => ({
    type: OPEN_DELETE_DIALOG,
    payload: postId,
  }),

  closeDeleteDialog: () => ({
    type: CLOSE_DELETE_DIALOG,
  }),

  setError: (error) => ({
    type: SET_ERROR,
    payload: error,
  }),

  clearError: () => ({
    type: CLEAR_ERROR,
  }),
};

//Your component → dispatch(action) → postsReducer(state, action) → newState
