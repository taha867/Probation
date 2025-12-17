/**
 * ResetPasswordContainer - Container for reset password functionality
 * Contains business logic and layout for reset password page
 */
import { useSearchParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ResetPasswordForm from "./form/ResetPasswordForm.jsx";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

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
                Set new password
              </CardTitle>

              <CardDescription className="text-slate-600">
                Enter your new password below
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <ResetPasswordForm token={token} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
