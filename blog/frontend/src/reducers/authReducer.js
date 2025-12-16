import { AUTH_ACTIONS, AUTH_STATUS } from "../utils/constants";

// Auth reducer for managing authentication state
export const initialAuthState = {
  user: null,
  status: AUTH_STATUS.IDLE,
  error: "",
  message: "",
  isInitialized: false, // Track if auth has been initialized from localStorage
};

const {
  LOGIN_START,
  SIGNUP_START,
  LOGIN_SUCCESS,
  SIGNUP_SUCCESS,
  AUTH_ERROR,
  LOGOUT,
  SET_USER_FROM_TOKEN,
  CLEAR_MESSAGES,
  FORGOT_PASSWORD_START,
  FORGOT_PASSWORD_SUCCESS,
  RESET_PASSWORD_START,
  RESET_PASSWORD_SUCCESS,
  INITIALIZE_AUTH,
} = AUTH_ACTIONS;

const { BUSY, IDLE } = AUTH_STATUS;

export const authReducer = (state, action) => {
  switch (action.type) {
    case LOGIN_START:
    case SIGNUP_START:
    case FORGOT_PASSWORD_START:
    case RESET_PASSWORD_START:
      return {
        ...state,
        status: BUSY,
        error: "",
        message: "",
      };

    case LOGIN_SUCCESS:
      const { user: loginUser, message: loginMessage } = action.payload;
      return {
        ...state,
        status: IDLE,
        user: loginUser,
        message: loginMessage,
        error: "",
        isInitialized: true,
      };

    case SIGNUP_SUCCESS:
    case FORGOT_PASSWORD_SUCCESS:
    case RESET_PASSWORD_SUCCESS:
      const { message: signupMessage } = action.payload;
      return {
        ...state,
        status: IDLE,
        message: signupMessage,
        error: "",
      };

    case AUTH_ERROR:
      return {
        ...state,
        status: IDLE,
        error: action.payload,
        message: "",
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
        error: "",
        message: "",
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
  loginStart: () => ({ type: LOGIN_START }),

  signupStart: () => ({ type: SIGNUP_START }),

  loginSuccess: (user, message) => ({
    type: LOGIN_SUCCESS,
    payload: { user, message },
  }),

  signupSuccess: (message) => ({
    type: SIGNUP_SUCCESS,
    payload: { message },
  }),

  authError: (error) => ({
    type: AUTH_ERROR,
    payload: error,
  }),

  logout: () => ({ type: LOGOUT }),

  setUserFromToken: (user) => ({
    type: SET_USER_FROM_TOKEN,
    payload: { user },
  }),

  clearMessages: () => ({ type: CLEAR_MESSAGES }),

  forgotPasswordStart: () => ({ type: FORGOT_PASSWORD_START }),

  forgotPasswordSuccess: (message) => ({
    type: FORGOT_PASSWORD_SUCCESS,
    payload: { message },
  }),

  resetPasswordStart: () => ({ type: RESET_PASSWORD_START }),

  resetPasswordSuccess: (message) => ({
    type: RESET_PASSWORD_SUCCESS,
    payload: { message },
  }),

  initializeAuth: () => ({ type: INITIALIZE_AUTH }),
};

//Your component → dispatch(action) → authReducer(state, action) → newState
