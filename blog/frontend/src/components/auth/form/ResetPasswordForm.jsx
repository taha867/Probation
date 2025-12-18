/**
 * ResetPasswordForm component
 * Form for resetting password with token from email
 */
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormField } from "../../custom";
import { resetPasswordSchema } from "../../../validations/authSchemas";
import { useAuth } from "../../../hooks/authHooks";
import { createSubmitHandlerWithToast } from "../../../utils/formSubmitWithToast";

const ResetPasswordForm = ({ token }) => {
  const { resetUserPassword, isLoading } = useAuth();
  const navigate = useNavigate();

  const form = useForm({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    try {
      await resetUserPassword(token, data.newPassword, data.confirmPassword);

      // Redirect to signin after successful reset
      setTimeout(() => {
        navigate("/signin");
      }, 1500);
    } catch (error) {
      // Error message is handled by axios interceptor
    }
  };

  const handleSubmit = createSubmitHandlerWithToast(form, onSubmit);

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          control={form.control}
          name="newPassword"
          type="password"
          label="New Password"
          placeholder="Enter your new password"
          autoComplete="new-password"
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          type="password"
          label="Confirm New Password"
          placeholder="Confirm your new password"
          autoComplete="new-password"
        />

        <Button type="submit" disabled={isLoading} size="lg" className="w-full">
          {isLoading ? "Resetting..." : "Reset Password"}
        </Button>

        <div className="text-center">
          <button
            type="button"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            onClick={() => navigate("/signin")}
          >
            Back to Sign In
          </button>
        </div>
      </form>
    </Form>
  );
};

export default ResetPasswordForm;
