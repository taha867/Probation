/**
 * AuthContainer - full-page auth experience inspired by the reference mock
 * Two-column layout: left brand/story panel, right auth card with views
 */
import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Github } from "lucide-react";
import toast from "react-hot-toast";
import { TOAST_MESSAGES } from "../utils/constants";
import SignInForm from "../components/auth/SignInForm";
import SignUpForm from "../components/auth/SignUpForm";
import ForgotPasswordForm from "../components/auth/ForgotPasswordForm";
import ResetPasswordForm from "../components/auth/ResetPasswordForm";

export default function AuthContainer() {
  const [searchParams] = useSearchParams();
  const [currentView, setCurrentView] = useState("signin"); // signin | signup | forgot-password | reset-password
  const [resetToken, setResetToken] = useState(null);

  // Set initial view based on URL parameters
  useEffect(() => {
    const mode = searchParams.get("mode");
    const token = searchParams.get("token");

    if (token) {
      // If there's a token, show reset password form
      setCurrentView("reset-password");
      setResetToken(token);
    } else if (mode === "signup") {
      setCurrentView("signup");
    } else if (mode === "signin") {
      setCurrentView("signin");
    } else {
      // Default to signin if no mode specified
      setCurrentView("signin");
    }
  }, [searchParams]);

  const { title, description, actionLabel } = useMemo(() => {
    switch (currentView) {
      case "signin":
        return {
          title: "Welcome back",
          description: "Sign in to access your account",
          actionLabel: "Need an account?",
        };
      case "forgot-password":
        return {
          title: "Reset password",
          description: "We’ll email you a reset link",
          actionLabel: "Remembered it?",
        };
      case "reset-password":
        return {
          title: "Set new password",
          description: "Enter your new password below",
          actionLabel: null, // No action label for reset password
        };
      default:
        return {
          title: "Create an account",
          description: "Enter your email below to create your account",
          actionLabel: "Already have an account?",
        };
    }
  }, [currentView]);

  const renderForm = () => {
    switch (currentView) {
      case "signin":
        return (
          <SignInForm
            onSwitchToSignUp={() => setCurrentView("signup")}
            onForgotPassword={() => setCurrentView("forgot-password")}
          />
        );
      case "forgot-password":
        return (
          <ForgotPasswordForm onBackToSignIn={() => setCurrentView("signin")} />
        );
      case "reset-password":
        return (
          <ResetPasswordForm
            token={resetToken}
            onBackToSignIn={() => setCurrentView("signin")}
          />
        );
      default:
        return <SignUpForm onSwitchToSignIn={() => setCurrentView("signin")} />;
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left brand/story panel with blog image */}
      <div className="relative hidden overflow-hidden lg:flex">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("/blogImg.jpeg")' }}
        />
      </div>

      {/* Right auth panel */}
      <div className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md space-y-6">
          <Card className="shadow-md border border-slate-200/60">
            <CardHeader className="space-y-2 pb-4">
              <CardTitle className="text-2xl font-semibold text-slate-900">
                {title}
              </CardTitle>
              <CardDescription className="text-slate-600">
                {description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {renderForm()}

              {currentView !== "reset-password" && (
                <>
                  <Separator />

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-11"
                    onClick={() =>
                      toast(TOAST_MESSAGES.GITHUB_OAUTH_COMING_SOON, {
                        icon: "🔗",
                        duration: 3000,
                      })
                    }
                  >
                    <Github className="h-4 w-4 mr-2" />
                    Continue with GitHub
                  </Button>

                  <p className="text-xs text-center text-slate-500">
                    By clicking continue, you agree to our{" "}
                    <a className="text-blue-600 hover:text-blue-700" href="#">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a className="text-blue-600 hover:text-blue-700" href="#">
                      Privacy Policy
                    </a>
                    .
                  </p>
                </>
              )}

              {currentView !== "forgot-password" &&
                currentView !== "reset-password" &&
                actionLabel && (
                  <p className="text-sm text-center text-slate-600">
                    {actionLabel}{" "}
                    <button
                      type="button"
                      className="text-blue-600 hover:text-blue-700 font-medium"
                      onClick={() =>
                        setCurrentView(
                          currentView === "signin" ? "signup" : "signin",
                        )
                      }
                    >
                      {currentView === "signin" ? "Sign up" : "Sign in"}
                    </button>
                  </p>
                )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
