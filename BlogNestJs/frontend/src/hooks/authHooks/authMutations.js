
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "../../contexts/authContext";
import { authActions } from "../../reducers/authReducer";
import { userPostsKeys, homePostsKeys } from "../../utils/queryKeys";
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
        // Context state is the single source of truth for runtime auth state
        dispatch(loginSuccess(user));
      } else {
        throw new Error("Invalid token received");
      }
    },
    onError: () => {
      dispatch(authError());
    },
  });
};


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


export const useLogout = () => {
  const { dispatch } = useAuthContext();
  const { logout } = authActions;

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      removeTokens();
      // Context state is the single source of truth for runtime auth state
      dispatch(logout());
    },
    onError: () => {
      // Even if backend logout fails, we still want to clear local state
      removeTokens();
      dispatch(logout());
    },
  });
};


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


export const useUpdateProfileImage = () => {
  const { dispatch, state } = useAuthContext();
  const { setUserFromToken, authError } = authActions;
  const { user } = state;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData) => {
      if (!user?.id) {
        throw new Error("User not authenticated");
      }
      const response = await updateUserProfile(user.id, formData);
      return response.data;
    },
    onSuccess: async (data) => {
      const updatedUser = data.user;
      // Update auth state with new user data
      // Context state is the single source of truth for runtime auth state
      dispatch(setUserFromToken(updatedUser));
      
      // Invalidate queries to ensure fresh data is fetched
      // invalidateQueries marks data as stale and triggers refetch if query is active
      await queryClient.invalidateQueries({ queryKey: userPostsKeys.all });
      await queryClient.invalidateQueries({ queryKey: homePostsKeys.all });
    },
    onError: () => {
      dispatch(authError());
    },
  });
};


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

