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
import { AUTH_STATUS } from "../utils/constants";

/**
 * Custom hook for authentication operations
 * @returns {object} - Authentication methods and state
 */
export const useAuth = () => {
  const state = useAuthState(); //gives the current auth state (user, token, status, error, message).
  const dispatch = useAuthDispatch(); // gives the dispatch function that lets you send actions to the reducer.
  const {
    setUserFromToken,
    loginSuccess,
    signupSuccess,
    authError,
    loginStart,
    signupStart,
    logout,
    clearMessages,
  } = authActions;

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const token = getToken();
    if (token) {
      const decodedUser = decodeAndValidateToken(token);
      if (decodedUser) {
        dispatch(setUserFromToken(decodedUser, token));
      }
    }
  }, [dispatch]);

  const signin = async (credentials) => {
    dispatch(loginStart());

    try {
      const response = await loginUser(credentials);
      const {
        data: { accessToken, message },
      } = response;

      // Store token and decode user
      storeToken(accessToken);
      const decodedUser = decodeAndValidateToken(accessToken);

      if (decodedUser) {
        dispatch(loginSuccess(decodedUser, accessToken, message));
      } else {
        throw new Error("Invalid token received");
      }
    } catch (error) {
      dispatch(authError(error.message));
      throw error; // Re-throw for component handling
    }
  };

  const signup = async (userData) => {
    dispatch(signupStart());

    try {
      const response = await registerUser(userData);
      const {
        data: { message },
      } = response;

      dispatch(signupSuccess(message));
    } catch (error) {
      dispatch(authError(error.message));
      throw error; // Re-throw for component handling
    }
  };

  const signout = () => {
    removeToken();
    dispatch(logout());
  };

  const clearMsg = () => {
    dispatch(clearMessages());
  };

  const { user, token, status, error, message } = state;

  return {
    // State
    user,
    token,
    status,
    error,
    message,
    isAuthenticated: !!user,
    isLoading: status === AUTH_STATUS.BUSY,

    // Actions
    signin,
    signup,
    signout,
    clearMessages: clearMsg,
  };
};
