/**
 * ResetPasswordForm component
 * Form for resetting password with token from email
 */
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { resetPasswordSchema } from "../../validations/authSchemas";
import { useAuth } from "../../hooks/authHooks";

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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your new password"
                  autoComplete="new-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm New Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Confirm your new password"
                  autoComplete="new-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
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
