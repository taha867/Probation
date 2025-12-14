/**
 * ResetPasswordPage - Reset password page route handler
 * Handles password reset via email link with token
 * URL format: /reset-password?token=xyz123
 */
import ResetPasswordContainer from "../containers/ResetPasswordContainer";

function ResetPasswordPage() {
  return <ResetPasswordContainer />;
}

export default ResetPasswordPage;
