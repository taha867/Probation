/**
 * AuthContainer - Handles authentication business logic
 * Orchestrates authentication operations and UI state
 */
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/authHooks";
import SigninForm from "../components/SigninForm";
import SignupForm from "../components/SignupForm";
import ForgotPasswordForm from "../components/ForgotPasswordForm";
import AuthTabs from "../components/AuthTabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";

export function AuthContainer() {
  const {
    user,
    error,
    message,
    isLoading,
    signin,
    signup,
    requestPasswordReset,
    clearMessages,
  } = useAuth();

  const [activeTab, setActiveTab] = useState("signin");
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  // Handle sign in
  const handleSignin = async (credentials) => {
    clearMessages();
    try {
      await signin(credentials);
      // Navigation will be handled by the useEffect above
    } catch (err) {
      // Error is already handled by the useAuth hook
      console.error("Signin error:", err);
    }
  };

  // Handle sign up
  const handleSignup = async (userData) => {
    clearMessages();
    try {
      await signup(userData);
      // Optionally switch to signin tab after successful signup
      setActiveTab("signin");
    } catch (err) {
      // Error is already handled by the useAuth hook
      console.error("Signup error:", err);
    }
  };

  // Handle forgot password
  const handleForgotPassword = async (email) => {
    clearMessages();
    try {
      await requestPasswordReset(email);
      // Success message will be shown via the message state
    } catch (err) {
      // Error is already handled by the useAuth hook
      console.error("Forgot password error:", err);
    }
  };

  // Status alert component
  const StatusAlert = ({ error, message }) => {
    if (!error && !message) return null;
    return (
      <Alert variant={error ? "destructive" : "success"} className="mt-4">
        <AlertDescription>{error || message}</AlertDescription>
      </Alert>
    );
  };

  return (
    <div className="container max-w-md mx-auto py-10 px-4">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground uppercase tracking-wide">
            React 19 Auth Demo
          </p>
          <h1 className="text-3xl font-bold">User Accounts</h1>
          <p className="text-muted-foreground">
            Sign up, sign in, sign out, and keep the session on reload.
          </p>
        </div>

        <Card className="shadow-lg">
          <CardContent className="p-6">
            <AuthTabs
              active={activeTab}
              onChange={setActiveTab}
              disableSignup={false}
            />

            {activeTab === "signup" ? (
              <SignupForm onSubmit={handleSignup} loading={isLoading} />
            ) : activeTab === "forgot-password" ? (
              <ForgotPasswordForm
                onSubmit={handleForgotPassword}
                loading={isLoading}
              />
            ) : (
              <SigninForm onSubmit={handleSignin} loading={isLoading} />
            )}

            <StatusAlert error={error} message={message} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AuthContainer;
