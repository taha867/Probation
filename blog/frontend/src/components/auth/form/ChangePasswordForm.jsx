/**
 * ChangePasswordForm - Form component for changing user password
 * Follows React 19 best practices with proper form handling
 */
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormField } from "../../custom";
import { changePasswordSchema } from "../../../validations/userSchemas";
import { useAuth } from "../../../hooks/authHooks/authHooks";
import { createSubmitHandlerWithToast } from "../../../utils/formSubmitWithToast";
import { TOAST_MESSAGES } from "../../../utils/constants";

const ChangePasswordForm = () => {
  const { user, changePassword, isLoading } = useAuth();
  const navigate = useNavigate();

  const form = useForm({
    resolver: yupResolver(changePasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    try {
      await changePassword(data.newPassword);
      // Success message is handled by createSubmitHandlerWithToast
      // Optionally navigate back to dashboard after a delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      // Error message is handled by axios interceptor
    }
  };

  const handleSubmit = createSubmitHandlerWithToast(form, onSubmit, {
    successMessage: TOAST_MESSAGES.PASSWORD_CHANGED_SUCCESS,
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          control={form.control}
          name="newPassword"
          type="password"
          label="Type new password"
          placeholder="Enter your new password"
          autoComplete="new-password"
          showToggle
          helperText="Use 8 or more characters with a mix of letters, numbers & symbols."
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          type="password"
          label="Type new password again"
          placeholder="Re-enter your new password"
          autoComplete="new-password"
          showToggle
          helperText="Use 8 or more characters with a mix of letters, numbers & symbols."
        />

        <Button
          type="submit"
          variant="success"
          disabled={isLoading}
          size="lg"
          className="w-full"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
};

export default ChangePasswordForm;

