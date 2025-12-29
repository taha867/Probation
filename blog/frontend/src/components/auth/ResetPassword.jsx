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
                Set new password
              </CardTitle>

              <CardDescription className="text-xs text-slate-600">
                Enter your new password below
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              <ResetPasswordForm token={token} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
