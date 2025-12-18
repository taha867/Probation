import { POSTS_ACTIONS } from "../utils/constants";

// Posts reducer for managing truly minimal essential data only
export const initialPostsState = {
  posts: [],
  pagination: {
    limit: 10, // Business config for API calls
    total: 0, // Server data for total count
  },
};

const { SET_POSTS, SET_PAGINATION, ADD_POST, UPDATE_POST, DELETE_POST } =
  POSTS_ACTIONS;

export const postsReducer = (state, action) => {
  switch (action.type) {
    case SET_POSTS:
      return {
        ...state,
        posts: action.payload,
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

    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
};

// Action creators for better type safety and consistency
export const postsActions = {
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
};

//Your component → dispatch(action) → postsReducer(state, action) → newState
