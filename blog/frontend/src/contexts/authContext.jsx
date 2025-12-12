import { createContext, useReducer, useContext } from "react";
import { authReducer, initialAuthState } from "../reducers/authReducer";

// Create separate contexts for state and dispatch (reduces unnecessary re-renders).
const AuthStateContext = createContext(null); // current data of your auth system, user info, token, loading status, error, message.
const AuthDispatchContext = createContext(null); // function you call to tell reducer to change state, dispatch({ type: "LOGIN_SUCCESS", payload: {...} })

/**
 * Auth Provider component that wraps the app with authentication context
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export function AuthProvider({ children }) {

  //useReducer returns current state and a dispatch function.
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  return (
    //Provides state and dispatch to the subtree.
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
