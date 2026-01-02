import { AUTH_ACTIONS } from "../utils/constants";

// Auth reducer for managing authentication state
export const initialAuthState = {
  user: null,
  isInitializing: true, // Track if initial auth check is in progress
};

const {
  LOGIN_SUCCESS,
  SIGNUP_SUCCESS,
  AUTH_ERROR,
  LOGOUT,
  SET_USER_FROM_TOKEN,
  CLEAR_MESSAGES,
  FORGOT_PASSWORD_SUCCESS,
  RESET_PASSWORD_SUCCESS,
} = AUTH_ACTIONS;

export const authReducer = (state, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      const { user: loginUser } = action.payload;
      return {
        ...state,
        user: loginUser,
      };

    case SIGNUP_SUCCESS:
    case FORGOT_PASSWORD_SUCCESS:
    case RESET_PASSWORD_SUCCESS:
    case AUTH_ERROR:
      // These actions exist for consistency and future extensibility
      // They don't modify state but allow components to dispatch them
      // Success/error handling is done by React Query
      return {
        ...state,
      };

    case "SET_INITIALIZING":
      return {
        ...state,
        isInitializing: action.payload.isInitializing,
      };

    case LOGOUT:
      return {
        ...initialAuthState,
      };

    case SET_USER_FROM_TOKEN:
      const { user: tokenUser } = action.payload;
      return {
        ...state,
        user: tokenUser,
      };

    case CLEAR_MESSAGES:
      return {
        ...state,
      };

    default:
      // Log error but don't crash - return current state for graceful degradation
      console.error(`Unknown action type: ${action.type}`, action);
      return state;
  }
};

// Action creators for better type safety and consistency
export const authActions = {
  loginSuccess: (user) => ({
    type: LOGIN_SUCCESS,
    payload: { user },
  }),

  signupSuccess: () => ({
    type: SIGNUP_SUCCESS,
  }),

  authError: () => ({
    type: AUTH_ERROR,
  }),

  logout: () => ({ type: LOGOUT }),

  setUserFromToken: (user) => ({
    type: SET_USER_FROM_TOKEN,
    payload: { user },
  }),

  clearMessages: () => ({ type: CLEAR_MESSAGES }),

  forgotPasswordSuccess: () => ({
    type: FORGOT_PASSWORD_SUCCESS,
  }),

  resetPasswordSuccess: () => ({
    type: RESET_PASSWORD_SUCCESS,
  }),
};

//Your component → dispatch(action) → authReducer(state, action) → newState
