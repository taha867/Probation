/**
 * ResetPasswordContainer - Handles reset password business logic
 * Orchestrates password reset operations and UI state
 */
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/authHooks";
import ResetPasswordForm from "../components/ResetPasswordForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";

function ResetPasswordContainer() {
  const { user, error, message, isLoading, resetUserPassword, clearMessages } =
    useAuth();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  // Redirect to auth if no token provided
  useEffect(() => {
    if (!token) {
      navigate("/auth", { replace: true });
    }
  }, [token, navigate]);

  // Handle reset password
  const handleResetPassword = async (token, newPassword, confirmPassword) => {
    clearMessages();
    try {
      await resetUserPassword(token, newPassword, confirmPassword);
      // On success, redirect to auth page after a delay
      setTimeout(() => {
        navigate("/auth", { replace: true });
      }, 2000);
    } catch (err) {
      // Error is already handled by the useAuth hook
      console.error("Reset password error:", err);
    }
  };

  // Status alert component
  const StatusAlert = ({ error, message }) => {
    if (!error && !message) return null;
    return (
      <Alert variant={error ? "destructive" : "success"} className="mt-4">
        <AlertDescription>
          {error || message}
          {message && !error && (
            <span className="block mt-2 text-sm">
              Redirecting to sign in page...
            </span>
          )}
        </AlertDescription>
      </Alert>
    );
  };

  // Don't render if no token
  if (!token) {
    return null;
  }

  return (
    <div className="container max-w-md mx-auto py-10 px-4">
      <div className="space-y-6">
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <ResetPasswordForm
              onSubmit={handleResetPassword}
              loading={isLoading}
              token={token}
            />
            <StatusAlert error={error} message={message} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ResetPasswordContainer;
