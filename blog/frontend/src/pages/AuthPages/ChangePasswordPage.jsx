/**
 * ChangePasswordPage - Page component for changing user password
 * Follows React 19 best practices with proper separation of concerns
 */
import ChangePasswordForm from "../../components/auth/form/ChangePasswordForm";

const ChangePasswordPage = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Setting</h1>
          <h2 className="text-xl font-semibold text-gray-900">Change Password</h2>
        </div>
        <ChangePasswordForm />
      </div>
    </div>
  );
};

export default ChangePasswordPage;

