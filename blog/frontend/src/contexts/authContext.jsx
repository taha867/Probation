import { createContext, useReducer, useContext } from "react";
import { authReducer, initialAuthState } from "../reducers/authReducer";

// Create separate contexts for state and dispatch
const AuthStateContext = createContext(null);
const AuthDispatchContext = createContext(null);

/**
 * Auth Provider component that wraps the app with authentication context
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  return (
    <AuthStateContext.Provider value={state}>
      <AuthDispatchContext.Provider value={dispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
}

/**
 * Hook to access auth state
 * @returns {object} - Current auth state
 */
export function useAuthState() {
  const context = useContext(AuthStateContext);
  if (!context) {
    throw new Error("useAuthState must be used within an AuthProvider");
  }
  return context;
}

/**
 * Hook to access auth dispatch function
 * @returns {function} - Auth dispatch function
 */
export function useAuthDispatch() {
  const context = useContext(AuthDispatchContext);
  if (!context) {
    throw new Error("useAuthDispatch must be used within an AuthProvider");
  }
  return context;
}
