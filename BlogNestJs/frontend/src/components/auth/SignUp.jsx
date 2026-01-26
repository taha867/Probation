import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Github } from "lucide-react";
import toast from "react-hot-toast";
import { TOAST_MESSAGES } from "../../utils/constants";
import SignUpForm from "./form/SignUpForm.jsx";
import AuthLayout from "./AuthLayout";

const SignUp = () => {
  return (
    <AuthLayout
      title="Create an account"
      subtitle="Join our community of writers and readers"
    >
      <div className="space-y-4">
        <SignUpForm />
        <Separator className="bg-slate-200" />

        <Button
          type="button"
          variant="outline"
          className="w-full h-11 bg-white hover:bg-slate-50 border-slate-200"
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

        <div className="space-y-4 mt-4">
          <p className="text-xs text-center text-slate-500">
            By clicking continue, you agree to our{" "}
            <a className="text-blue-600 hover:text-blue-700 hover:underline" href="#">
              Terms of Service
            </a>{" "}
            and{" "}
            <a className="text-blue-600 hover:text-blue-700 hover:underline" href="#">
              Privacy Policy
            </a>
            .
          </p>

          <p className="text-sm text-center text-slate-600">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
