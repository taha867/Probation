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
import { TOAST_MESSAGES } from "../../utils/constants";
import SignUpForm from "./form/SignUpForm.jsx";

const SignUp = () => {
  return (
    <div className="min-h-[calc(100vh-4rem-5rem)] lg:h-[calc(100vh-4rem-5rem)] overflow-hidden flex">
      {/* Left brand/story panel with blog image - Compact version (40% width) */}
      <div className="hidden lg:flex lg:w-2/5 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("/blogImg.jpeg")' }}
        />
        {/* Subtle gradient overlay for visual appeal */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-transparent" />
      </div>
      {/* Right auth panel - Takes remaining space (60% width) */}
      <div className="flex-1 flex items-center justify-center px-4 py-4 overflow-y-auto">
        <div className="w-full max-w-md">
          <Card className="shadow-lg border border-slate-200/60">
            <CardHeader className="space-y-1 pb-2">
              <CardTitle className="text-lg font-semibold text-slate-900">
                Create an account
              </CardTitle>

              <CardDescription className="text-xs text-slate-600">
                Enter your email below to create your account
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
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

export default SignUp;
