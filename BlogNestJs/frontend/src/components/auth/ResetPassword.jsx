import { useSearchParams } from "react-router-dom";
import ResetPasswordForm from "./form/ResetPasswordForm.jsx";
import AuthLayout from "./AuthLayout";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  return (
    <AuthLayout
      title="Set new password"
      subtitle="Enter your new password below"
    >
      <div className="space-y-4">
        <ResetPasswordForm token={token} />
      </div>
    </AuthLayout>
  );
};

export default ResetPassword;
