import { AUTH_ACTIONS, AUTH_STATUS } from "../utils/constants";

// Auth reducer for managing authentication state
export const initialAuthState = {
  user: null,
  token: null,
  status: AUTH_STATUS.IDLE,
  error: "",
  message: "",
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
} = AUTH_ACTIONS;

const { BUSY, IDLE } = AUTH_STATUS;

export function authReducer(state, action) {
  switch (action.type) {
    case LOGIN_START:
    case SIGNUP_START:
      return {
        ...state,
        status: BUSY,
        error: "",
        message: "",
      };

    case LOGIN_SUCCESS:
      const {
        user: loginUser,
        token: loginToken,
        message: loginMessage,
      } = action.payload;
      return {
        ...state,
        status: IDLE,
        user: loginUser,
        token: loginToken,
        message: loginMessage,
        error: "",
      };

    case SIGNUP_SUCCESS:
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
      };

    case SET_USER_FROM_TOKEN:
      const { user: tokenUser, token: tokenToken } = action.payload;
      return {
        ...state,
        user: tokenUser,
        token: tokenToken,
      };

    case CLEAR_MESSAGES:
      return {
        ...state,
        error: "",
        message: "",
      };

    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}

// Action creators for better type safety and consistency
export const authActions = {
  loginStart: () => ({ type: LOGIN_START }),

  signupStart: () => ({ type: SIGNUP_START }),

  loginSuccess: (user, token, message) => ({
    type: LOGIN_SUCCESS,
    payload: { user, token, message },
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

  setUserFromToken: (user, token) => ({
    type: SET_USER_FROM_TOKEN,
    payload: { user, token },
  }),

  clearMessages: () => ({ type: CLEAR_MESSAGES }),
};

//Your component → dispatch(action) → authReducer(state, action) → newState
