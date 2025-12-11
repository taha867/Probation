import { createContext, useReducer, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "auth_token";

const authStateContext = createContext(null);
const authDispatchContext = createContext(null);

const initialAuthState = {
  user: null,
  token: null,
  status: "idle",
  error: "",
  message: "",
};

function authReducer(state, action) {
  switch (action.type) {
    case "LOGIN_START":
    case "SIGNUP_START":
      return { ...state, status: "busy", error: "", message: "" };

    case "LOGIN_SUCCESS":
      return {
        ...state,
        status: "idle",
        user: action.payload.user,
        token: action.payload.token,
        message: action.payload.message,
      };

    case "SIGNUP_SUCCESS":
      return { ...state, status: "idle", message: action.payload.message };

    case "AUTH_ERROR":
      return { ...state, status: "idle", error: action.payload };

    case "LOGOUT":
      return { ...initialAuthState };

    case "SET_USER_FROM_TOKEN":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
      };

    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  // On app load, check localStorage for token
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        if (decodedUser.exp * 1000 < Date.now()) {
          localStorage.removeItem(TOKEN_KEY);
        } else {
          dispatch({
            type: "SET_USER_FROM_TOKEN",
            payload: { user: decodedUser, token },
          });
        }
      } catch {
        localStorage.removeItem(TOKEN_KEY);
      }
    }
  }, []);

  return (
    // uthStateContext.provider --> a component that supplies the context value to decendents
    <authStateContext.Provider value={state}>
      <authDispatchContext.Provider value={dispatch}>
        {children}
      </authDispatchContext.Provider>
    </authStateContext.Provider>
  );
}

// Custom hooks
export function useAuthState() {
  const context = useContext(authStateContext);
  if (!context) throw new Error("useAuthState must be inside AuthProvider");
  return context;
}
export function useAuthDispatch() {
  const context = useContext(authDispatchContext);
  if (!context) throw new Error("useAuthDispatch must be inside AuthProvider");
  return context;
}
