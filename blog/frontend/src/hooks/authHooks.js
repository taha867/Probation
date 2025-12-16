import { useEffect, useTransition } from "react";
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
import { TOAST_MESSAGES } from "../utils/constants";

// Error messages are now handled globally by axios interceptors

/**
 * Custom hook for authentication operations
 * @returns {object} - Authentication methods and state
 */
export const useAuth = () => {
  // Use single context following React 19 best practices
  const { state, dispatch } = useAuthContext();
  const [isPending, startTransition] = useTransition();

  const {
    setUserFromToken,
    loginSuccess,
    signupSuccess,
    authError,
    logout,
    forgotPasswordSuccess,
    resetPasswordSuccess,
    initializeAuth,
  } = authActions;

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const token = getToken();
    if (token) {
      const decodedUser = decodeAndValidateToken(token);
      if (decodedUser) {
        // Map JWT payload to user object format expected by components
        const user = {
          id: decodedUser.userId,
          email: decodedUser.email,
          tokenVersion: decodedUser.tokenVersion,
        };
        dispatch(setUserFromToken(user));
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
    return new Promise((resolve, reject) => {
      startTransition(async () => {
        try {
          const response = await loginUser(credentials);
          const {
            data: { accessToken, refreshToken, user },
          } = response;

          // Store both tokens and validate the access token
          storeTokens(accessToken, refreshToken);
          const decodedUser = decodeAndValidateToken(accessToken);

          if (decodedUser) {
            // Use the complete user object from the backend response
            dispatch(loginSuccess(user));
            resolve(response);
          } else {
            throw new Error("Invalid token received");
          }
        } catch (error) {
          dispatch(authError());
          reject(error);
        }
      });
    });
  };

  const signup = async (userData) => {
    return new Promise((resolve, reject) => {
      startTransition(async () => {
        try {
          const response = await registerUser(userData);
          dispatch(signupSuccess());
          resolve(response);
        } catch (error) {
          dispatch(authError());
          reject(error);
        }
      });
    });
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

  const requestPasswordReset = async (email) => {
    return new Promise((resolve, reject) => {
      startTransition(async () => {
        try {
          const response = await forgotPassword({ email });
          dispatch(forgotPasswordSuccess());
          resolve(response);
        } catch (error) {
          dispatch(authError());
          reject(error);
        }
      });
    });
  };

  const resetUserPassword = async (token, newPassword, confirmPassword) => {
    return new Promise((resolve, reject) => {
      startTransition(async () => {
        try {
          const response = await resetPassword({
            token,
            newPassword,
            confirmPassword,
          });
          dispatch(resetPasswordSuccess());
          resolve(response);
        } catch (error) {
          dispatch(authError());
          reject(error);
        }
      });
    });
  };

  const { user, isInitialized } = state;

  return {
    // State
    user,
    isAuthenticated: !!user,
    isLoading: isPending, // From useTransition
    isInitialized,

    // Actions
    signin,
    signup,
    signout,
    requestPasswordReset,
    resetUserPassword,
  };
};
