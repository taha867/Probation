import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormField } from "../../custom";
import { changePasswordSchema } from "../../../validations/userSchemas";
import { useAuth } from "../../../hooks/authHooks/authHooks";
import { createSubmitHandlerWithToast } from "../../../utils/formSubmitWithToast";

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
      // Success message is shown automatically by axios interceptor from backend message
      // Optionally navigate back to dashboard after a delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      // Error message is handled by axios interceptor
    }
  };

  const handleSubmit = createSubmitHandlerWithToast(form, onSubmit);

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <FormField
          control={form.control}
          name="newPassword"
          type="password"
          label="Type new password"
          placeholder="Enter your new password"
          autoComplete="new-password"
          showToggle
          helperText="Use 8 or more characters with a mix of letters, numbers & symbols."
          className="h-11"
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
          className="h-11"
        />

        <Button
          type="submit"
          variant="success"
          disabled={isLoading}
          className="w-full h-11 font-medium"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
};

export default ChangePasswordForm;

