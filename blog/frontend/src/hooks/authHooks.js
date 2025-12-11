import { useEffect } from "react";
import { useAuthState, useAuthDispatch } from "../contexts/authContext";
import { authActions } from "../reducers/authReducer";
import {
  getToken,
  storeToken,
  removeToken,
  decodeAndValidateToken,
} from "../utils/tokenUtils";
import { loginUser, registerUser } from "../services/authService";

/**
 * Custom hook for authentication operations
 * @returns {object} - Authentication methods and state
 */
export const useAuth = () => {
  const state = useAuthState();
  const dispatch = useAuthDispatch();

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const token = getToken();
    if (token) {
      const decodedUser = decodeAndValidateToken(token);
      if (decodedUser) {
        dispatch(authActions.setUserFromToken(decodedUser, token));
      }
    }
  }, [dispatch]);

  /**
   * Sign in user
   * @param {object} credentials - Login credentials
   */
  const signin = async (credentials) => {
    dispatch(authActions.loginStart());

    try {
      const response = await loginUser(credentials);
      const {
        data: { accessToken, message },
      } = response;

      // Store token and decode user
      storeToken(accessToken);
      const decodedUser = decodeAndValidateToken(accessToken);

      if (decodedUser) {
        dispatch(authActions.loginSuccess(decodedUser, accessToken, message));
      } else {
        throw new Error("Invalid token received");
      }
    } catch (error) {
      dispatch(authActions.authError(error.message));
      throw error; // Re-throw for component handling
    }
  };

  /**
   * Sign up user
   * @param {object} userData - Registration data
   */
  const signup = async (userData) => {
    dispatch(authActions.signupStart());

    try {
      const response = await registerUser(userData);
      const {
        data: { message },
      } = response;

      dispatch(authActions.signupSuccess(message));
    } catch (error) {
      dispatch(authActions.authError(error.message));
      throw error; // Re-throw for component handling
    }
  };

  /**
   * Sign out user
   */
  const signout = () => {
    removeToken();
    dispatch(authActions.logout());
  };

  /**
   * Clear error and success messages
   */
  const clearMessages = () => {
    dispatch(authActions.clearMessages());
  };

  return {
    // State
    user: state.user,
    token: state.token,
    status: state.status,
    error: state.error,
    message: state.message,
    isAuthenticated: !!state.user,
    isLoading: state.status === "busy",

    // Actions
    signin,
    signup,
    signout,
    clearMessages,
  };
};
