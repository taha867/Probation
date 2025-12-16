/**
 * SignUpContainer - Container for sign up functionality
 * Contains business logic and layout for sign up page
 */
import { Link } from "react-router-dom";
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
import SignUpForm from "../components/auth/SignUpForm";

const SignUpContainer = () => {
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
                Create an account
              </CardTitle>
              <CardDescription className="text-slate-600">
                Enter your email below to create your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <SignUpForm />

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

              <p className="text-sm text-center text-slate-600">
                Already have an account?{" "}
                <Link
                  to="/signin"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Sign in
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SignUpContainer;
