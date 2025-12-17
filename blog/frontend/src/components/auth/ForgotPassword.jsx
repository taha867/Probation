/**
 * ForgotPasswordContainer - Container for forgot password functionality
 * Contains business logic and layout for forgot password page
 */
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ForgotPasswordForm from "./form/ForgotPasswordForm.jsx";

const ForgotPassword = () => {
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
                Reset password
              </CardTitle>
              <CardDescription className="text-slate-600">
                We'll email you a reset link
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ForgotPasswordForm />

              <p className="text-sm text-center text-slate-600">
                Remembered it?{" "}
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

export default ForgotPassword;
