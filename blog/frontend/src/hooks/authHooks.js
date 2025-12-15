import { useEffect } from "react";
import { useAuthContext } from "../contexts/authContext";
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
import {
  AUTH_STATUS,
  AUTH_ERROR_MESSAGES,
  TOAST_MESSAGES,
} from "../utils/constants";

const extractErrorMessage = (error, fallback) =>
  error?.response?.data?.data?.message ||
  error?.response?.data?.message ||
  error?.message ||
  fallback;

/**
 * Custom hook for authentication operations
 * @returns {object} - Authentication methods and state
 */
export const useAuth = () => {
  // Use single context following React 19 best practices
  const { state, dispatch } = useAuthContext();
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
    initializeAuth,
  } = authActions;

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const token = getToken();
    if (token) {
      const decodedUser = decodeAndValidateToken(token);
      if (decodedUser) {
        dispatch(setUserFromToken(decodedUser, token));
      } else {
        // Token is invalid, mark as initialized
        dispatch(initializeAuth());
      }
    } else {
      // No token found, mark as initialized
      dispatch(initializeAuth());
    }
  }, [dispatch, setUserFromToken, initializeAuth]);

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
      const message = extractErrorMessage(
        error,
        AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS,
      );
      dispatch(authError(message));
      const forwarded = new Error(message);
      forwarded.response = error?.response;
      throw forwarded; // Re-throw for component handling
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
      const message = extractErrorMessage(
        error,
        AUTH_ERROR_MESSAGES.UNABLE_TO_CREATE_ACCOUNT,
      );
      dispatch(authError(message));
      const forwarded = new Error(message);
      forwarded.response = error?.response;
      throw forwarded; // Re-throw for component handling
    }
  };

  const signout = async () => {
    try {
      // Call backend logout API to invalidate session
      await logoutUser();
    } catch (error) {
      // Even if backend logout fails, we still want to clear local state
      console.warn(TOAST_MESSAGES.BACKEND_LOGOUT_FAILED, error.message);
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
      const message = extractErrorMessage(
        error,
        AUTH_ERROR_MESSAGES.FAILED_TO_SEND_RESET_EMAIL,
      );
      dispatch(authError(message));
      const forwarded = new Error(message);
      forwarded.response = error?.response;
      throw forwarded; // Re-throw for component handling
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
      const message = extractErrorMessage(
        error,
        AUTH_ERROR_MESSAGES.FAILED_TO_RESET_PASSWORD,
      );
      dispatch(authError(message));
      const forwarded = new Error(message);
      forwarded.response = error?.response;
      throw forwarded; // Re-throw for component handling
    }
  };

  const { user, token, status, error, message, isInitialized } = state;

  return {
    // State
    user,
    token,
    status,
    error,
    message,
    isAuthenticated: !!user,
    isLoading: status === AUTH_STATUS.BUSY,
    isInitialized,

    // Actions
    signin,
    signup,
    signout,
    requestPasswordReset,
    resetUserPassword,
    clearMessages: clearMsg,
  };
};
