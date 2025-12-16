import { createContext, useReducer, useContext, useMemo } from "react";
import { authReducer, initialAuthState } from "../reducers/authReducer";

// Single context for both state and dispatch
const AuthContext = createContext(null);

/**
 * Auth Provider component that wraps the app with authentication context
 * single context and memoization
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const AuthProvider = ({ children }) => {
  // useReducer returns current state and a dispatch function
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  // Memoize the context value to prevent unnecessary re-renders
  // Only re-creates when state or dispatch changes
  const contextValue = useMemo(
    () => ({
      state,
      dispatch,
    }),
    [state, dispatch],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

/**
 * Hook to access the complete auth context (state + dispatch)
 * @returns {object} - Auth context with state and dispatch
 */
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
