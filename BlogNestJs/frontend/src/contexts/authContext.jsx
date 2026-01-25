import { createContext, useReducer, useContext, useMemo, use, useEffect } from "react";
import { authReducer, initialAuthState } from "../reducers/authReducer";
import { createInitialAuthPromise } from "../utils/authPromise";

// Single context for both state and dispatch
const AuthContext = createContext(null);


export const AuthProvider = ({ children }) => {
  // This will suspend the component until auth state is resolved
  const { user } = use(createInitialAuthPromise());

  // Create initial state with resolved user
  // isInitializing starts as true (from initialAuthState), will be set to false after mount
  const initialStateWithUser = {
    ...initialAuthState,
    user,
  };

  // [current state, function to trigger update] (function that decides how state change, starting state)
  const [state, dispatch] = useReducer(authReducer, initialStateWithUser);

  // Mark initialization as complete after promise resolves and component mounts
  useEffect(() => {
    if (state.isInitializing) {
      dispatch({ type: "SET_INITIALIZING", payload: { isInitializing: false } });
    }
  }, [state.isInitializing]);

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
