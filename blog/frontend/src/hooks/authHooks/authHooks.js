import { useTransition } from "react";
import { useAuthContext } from "../../contexts/authContext";
import { authActions } from "../../reducers/authReducer";
import {
  storeTokens,
  removeTokens,
  decodeAndValidateToken,
} from "../../utils/tokenUtils";
import {
  loginUser,
  registerUser,
  logoutUser,
  forgotPassword,
  resetPassword,
} from "../../services/authService";
import { updateUserProfile } from "../../services/userService";
import { TOAST_MESSAGES } from "../../utils/constants";
import { invalidateAuthPromise, updateAuthPromise } from "../../utils/authPromise";

/**
 * Custom hook for authentication operations
 * @returns {object} - Authentication methods and state
 */
export const useAuth = () => {
  const { state, dispatch } = useAuthContext();
  const [isPending, startTransition] = useTransition();

  const {
    loginSuccess,
    signupSuccess,
    authError,
    logout,
    forgotPasswordSuccess,
    resetPasswordSuccess,
    setUserFromToken,
  } = authActions;

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
            // Update the auth promise cache with new user
            updateAuthPromise(user);
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
      // Invalidate auth promise cache for next login
      invalidateAuthPromise();
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

  const updateProfileImage = async (imageData) => {
    return new Promise((resolve, reject) => {
      startTransition(async () => {
        try {
          if (!user?.id) {
            throw new Error("User not authenticated");
          }

          // Prepare JSON payload (image already uploaded to Cloudinary)
          const payload = {
            image: imageData.image,
            imagePublicId: imageData.imagePublicId,
          };

          // Call API to update profile image
          const response = await updateUserProfile(user.id, payload);
          const updatedUser = response.data.user;

          // Update auth state with new user data
          dispatch(setUserFromToken(updatedUser));
          // Update the auth promise cache with new user
          updateAuthPromise(updatedUser);

          resolve(response);
        } catch (error) {
          dispatch(authError());
          reject(error);
        }
      });
    });
  };

  const changePassword = async (newPassword) => {
    return new Promise((resolve, reject) => {
      startTransition(async () => {
        try {
          if (!user?.id) {
            throw new Error("User not authenticated");
          }

          // Prepare payload with new password
          const payload = {
            password: newPassword,
          };

          // Call API to update password
          const response = await updateUserProfile(user.id, payload);
          resolve(response);
        } catch (error) {
          dispatch(authError());
          reject(error);
        }
      });
    });
  };

  const { user } = state;

  return {
    // State
    user,
    isAuthenticated: !!user,
    isLoading: isPending, // From useTransition

    // Actions
    signin,
    signup,
    signout,
    requestPasswordReset,
    resetUserPassword,
    updateProfileImage,
    changePassword,
  };
};
