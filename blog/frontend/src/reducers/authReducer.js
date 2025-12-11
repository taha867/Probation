// Auth reducer for managing authentication state
export const initialAuthState = {
  user: null,
  token: null,
  status: "idle", // "idle" | "busy"
  error: "",
  message: "",
};

export function authReducer(state, action) {
  switch (action.type) {
    case "LOGIN_START":
    case "SIGNUP_START":
      return { 
        ...state, 
        status: "busy", 
        error: "", 
        message: "" 
      };

    case "LOGIN_SUCCESS":
      return {
        ...state,
        status: "idle",
        user: action.payload.user,
        token: action.payload.token,
        message: action.payload.message,
        error: "",
      };

    case "SIGNUP_SUCCESS":
      return { 
        ...state, 
        status: "idle", 
        message: action.payload.message,
        error: "",
      };

    case "AUTH_ERROR":
      return { 
        ...state, 
        status: "idle", 
        error: action.payload,
        message: "",
      };

    case "LOGOUT":
      return { 
        ...initialAuthState 
      };

    case "SET_USER_FROM_TOKEN":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
      };

    case "CLEAR_MESSAGES":
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
  loginStart: () => ({ type: "LOGIN_START" }),
  
  signupStart: () => ({ type: "SIGNUP_START" }),
  
  loginSuccess: (user, token, message) => ({
    type: "LOGIN_SUCCESS",
    payload: { user, token, message },
  }),
  
  signupSuccess: (message) => ({
    type: "SIGNUP_SUCCESS",
    payload: { message },
  }),
  
  authError: (error) => ({
    type: "AUTH_ERROR",
    payload: error,
  }),
  
  logout: () => ({ type: "LOGOUT" }),
  
  setUserFromToken: (user, token) => ({
    type: "SET_USER_FROM_TOKEN",
    payload: { user, token },
  }),
  
  clearMessages: () => ({ type: "CLEAR_MESSAGES" }),
};