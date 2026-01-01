/**
 * Auth Mutations - React Query hooks for authentication operations
 */
import { useMutation } from "@tanstack/react-query";
import { useAuthContext } from "../../contexts/authContext";
import { authActions } from "../../reducers/authReducer";
import {
  loginUser,
  registerUser,
  logoutUser,
  forgotPassword,
  resetPassword,
} from "../../services/authService";
import { updateUserProfile } from "../../services/userService";
import {
  storeTokens,
  removeTokens,
  decodeAndValidateToken,
} from "../../utils/tokenUtils";
import { invalidateAuthPromise, updateAuthPromise } from "../../utils/authPromise";

/**
 * Hook for user login
 */
export const useLogin = () => {
  const { dispatch } = useAuthContext();
  const { loginSuccess, authError } = authActions;

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (response) => {
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
      } else {
        throw new Error("Invalid token received");
      }
    },
    onError: () => {
      dispatch(authError());
    },
  });
};

/**
 * Hook for user registration
 */
export const useSignup = () => {
  const { dispatch } = useAuthContext();
  const { signupSuccess, authError } = authActions;

  return useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      dispatch(signupSuccess());
    },
    onError: () => {
      dispatch(authError());
    },
  });
};

/**
 * Hook for user logout
 */
export const useLogout = () => {
  const { dispatch } = useAuthContext();
  const { logout } = authActions;

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      removeTokens();
      dispatch(logout());
      invalidateAuthPromise();
    },
    onError: () => {
      // Even if backend logout fails, we still want to clear local state
      removeTokens();
      dispatch(logout());
      invalidateAuthPromise();
    },
  });
};

/**
 * Hook for forgot password
 */
export const useForgotPassword = () => {
  const { dispatch } = useAuthContext();
  const { forgotPasswordSuccess, authError } = authActions;

  return useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      dispatch(forgotPasswordSuccess());
    },
    onError: () => {
      dispatch(authError());
    },
  });
};

/**
 * Hook for reset password
 */
export const useResetPassword = () => {
  const { dispatch } = useAuthContext();
  const { resetPasswordSuccess, authError } = authActions;

  return useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      dispatch(resetPasswordSuccess());
    },
    onError: () => {
      dispatch(authError());
    },
  });
};

/**
 * Hook for updating profile image
 */
export const useUpdateProfileImage = () => {
  const { dispatch, state } = useAuthContext();
  const { setUserFromToken, authError } = authActions;
  const { user } = state;

  return useMutation({
    mutationFn: async (formData) => {
      if (!user?.id) {
        throw new Error("User not authenticated");
      }
      const response = await updateUserProfile(user.id, formData);
      return response.data;
    },
    onSuccess: (data) => {
      const updatedUser = data.user;
      // Update auth state with new user data
      dispatch(setUserFromToken(updatedUser));
      // Update the auth promise cache with new user
      updateAuthPromise(updatedUser);
    },
    onError: () => {
      dispatch(authError());
    },
  });
};

/**
 * Hook for changing password
 */
export const useChangePassword = () => {
  const { dispatch, state } = useAuthContext();
  const { authError } = authActions;
  const { user } = state;

  return useMutation({
    mutationFn: async (newPassword) => {
      if (!user?.id) {
        throw new Error("User not authenticated");
      }
      const payload = {
        password: newPassword,
      };
      return await updateUserProfile(user.id, payload);
    },
    onError: () => {
      dispatch(authError());
    },
  });
};

