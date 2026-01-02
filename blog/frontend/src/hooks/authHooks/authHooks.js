import { useAuthContext } from "../../contexts/authContext";
import {
  useLogin,
  useSignup,
  useLogout,
  useForgotPassword,
  useResetPassword,
  useUpdateProfileImage,
  useChangePassword,
} from "./authMutations";

/**
 * Custom hook for authentication operations
 * Wraps React Query mutations for easy use in components
 */
export const useAuth = () => {
  const { state } = useAuthContext();

  // React Query mutations
  const loginMutation = useLogin();
  const signupMutation = useSignup();
  const logoutMutation = useLogout();
  const forgotPasswordMutation = useForgotPassword();
  const resetPasswordMutation = useResetPassword();
  const updateProfileImageMutation = useUpdateProfileImage();
  const changePasswordMutation = useChangePassword();

  const { user, isInitializing } = state;

  // Combine initializing state with mutation loading states
  // isInitializing: true during app startup auth check
  // mutation.isPending: true during API calls
  const isLoading =
    isInitializing ||
    loginMutation.isPending ||
    signupMutation.isPending ||
    logoutMutation.isPending ||
    forgotPasswordMutation.isPending ||
    resetPasswordMutation.isPending ||
    updateProfileImageMutation.isPending ||
    changePasswordMutation.isPending;

  return {
    // State
    user,
    isAuthenticated: !!user,
    isLoading,

    // Actions (using mutateAsync for Promise-based API compatibility)
    signin: loginMutation.mutateAsync,
    signup: signupMutation.mutateAsync,
    signout: logoutMutation.mutateAsync,
    requestPasswordReset: forgotPasswordMutation.mutateAsync,
    resetUserPassword: resetPasswordMutation.mutateAsync,
    updateProfileImage: updateProfileImageMutation.mutateAsync,
    changePassword: changePasswordMutation.mutateAsync,
  };
};
