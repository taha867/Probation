import { useEffect } from "react";
import { useAuthState, useAuthDispatch } from "../contexts/authContext";
import { authActions } from "../reducers/authReducer";
import {
  getToken,
  storeTokens,
  removeTokens,
  decodeAndValidateToken,
} from "../utils/tokenUtils";
import {
  loginUser,
  registerUser,
  logoutUser,
  forgotPassword,
  resetPassword,
} from "../services/authService";
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
    forgotPasswordStart,
    forgotPasswordSuccess,
    resetPasswordStart,
    resetPasswordSuccess,
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
        data: { accessToken, refreshToken, message },
      } = response;

      // Store both tokens and decode user
      storeTokens(accessToken, refreshToken);
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

  const signout = async () => {
    try {
      // Call backend logout API to invalidate session
      await logoutUser();
    } catch (error) {
      // Even if backend logout fails, we still want to clear local state
      console.warn("Backend logout failed:", error.message);
    } finally {
      // Always clear both tokens and state
      removeTokens();
      dispatch(logout());
    }
  };

  const clearMsg = () => {
    dispatch(clearMessages());
  };

  const requestPasswordReset = async (email) => {
    dispatch(forgotPasswordStart());

    try {
      const response = await forgotPassword({ email });
      const {
        data: { message },
      } = response;

      dispatch(forgotPasswordSuccess(message));
    } catch (error) {
      dispatch(authError(error.message));
      throw error; // Re-throw for component handling
    }
  };

  const resetUserPassword = async (token, newPassword, confirmPassword) => {
    dispatch(resetPasswordStart());

    try {
      const response = await resetPassword({
        token,
        newPassword,
        confirmPassword,
      });
      const {
        data: { message },
      } = response;

      dispatch(resetPasswordSuccess(message));
    } catch (error) {
      dispatch(authError(error.message));
      throw error; // Re-throw for component handling
    }
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
    requestPasswordReset,
    resetUserPassword,
    clearMessages: clearMsg,
  };
};
