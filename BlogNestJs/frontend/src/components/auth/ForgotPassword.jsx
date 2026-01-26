import { Link } from "react-router-dom";
import ForgotPasswordForm from "./form/ForgotPasswordForm.jsx";
import AuthLayout from "./AuthLayout";

const ForgotPassword = () => {
  return (
    <AuthLayout
      title="Reset password"
      subtitle="We'll email you a reset link"
    >
      <div className="space-y-4">
        <ForgotPasswordForm />

        <p className="text-sm text-center text-slate-600 mt-4">
          Remembered it?{" "}
          <Link
            to="/signin"
            className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
