import { AUTH_ACTIONS } from "../utils/constants";

// Auth reducer for managing authentication state
export const initialAuthState = {
  user: null,
  // status removed - replaced by useTransition's isPending
  isInitialized: false, // Track if auth has been initialized from localStorage
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
  INITIALIZE_AUTH,
} = AUTH_ACTIONS;

export const authReducer = (state, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      const { user: loginUser } = action.payload;
      return {
        ...state,
        user: loginUser,
        isInitialized: true,
      };

    case SIGNUP_SUCCESS:
    case FORGOT_PASSWORD_SUCCESS:
    case RESET_PASSWORD_SUCCESS:
    case AUTH_ERROR:
      return {
        ...state,
        // No status changes - useTransition handles loading states
      };

    case LOGOUT:
      return {
        ...initialAuthState,
        isInitialized: true,
      };

    case SET_USER_FROM_TOKEN:
      const { user: tokenUser } = action.payload;
      return {
        ...state,
        user: tokenUser,
        isInitialized: true,
      };

    case CLEAR_MESSAGES:
      return {
        ...state,
      };

    case INITIALIZE_AUTH:
      return {
        ...state,
        isInitialized: true,
      };

    default:
      throw new Error(`Unknown action type: ${action.type}`);
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

  initializeAuth: () => ({ type: INITIALIZE_AUTH }),
};

//Your component → dispatch(action) → authReducer(state, action) → newState
