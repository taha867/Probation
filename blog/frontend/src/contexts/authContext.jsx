import { createContext, useReducer, useContext, useMemo, use } from "react";
import { authReducer, initialAuthState } from "../reducers/authReducer";
import { createInitialAuthPromise } from "../utils/authPromise";

// Single context for both state and dispatch
const AuthContext = createContext(null);

/**
 * Auth Provider component that wraps the app with authentication context
 * Integrates React 19's use() hook for auth initialization with Suspense
 */
export const AuthProvider = ({ children }) => {
  // This will suspend the component until auth state is resolved
  const { user } = use(createInitialAuthPromise());

  // Create initial state with resolved user
  const initialStateWithUser = {
    ...initialAuthState,
    user,
  };

  // useReducer returns current state and a dispatch function
  const [state, dispatch] = useReducer(authReducer, initialStateWithUser);

  // Memoize the context value to prevent unnecessary re-renders
  // Only re-creates when state or dispatch changes
  const contextValue = useMemo(
    () => ({
      state,
      dispatch,
    }),
    [state, dispatch]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

//Hook to access the complete auth context (state + dispatch)
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
