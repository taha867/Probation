/**
 * ResetPasswordForm component
 * Form for resetting password with token from email
 */
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPasswordSchema } from "../validations/authSchemas";

export default function ResetPasswordForm({ onSubmit, loading, token }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange", // Validate on change for better UX
  });

  const onFormSubmit = async (data) => {
    await onSubmit(token, data.newPassword, data.confirmPassword);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div className="text-center space-y-2 mb-6">
        <h2 className="text-xl font-semibold">Reset Your Password</h2>
        <p className="text-muted-foreground text-sm">
          Enter your new password below.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="newPassword">New Password</Label>
        <Input
          id="newPassword"
          type="password"
          autoComplete="new-password"
          placeholder="Enter your new password"
          {...register("newPassword")}
          className={errors.newPassword ? "border-destructive" : ""}
        />
        {errors.newPassword && (
          <p className="text-sm text-destructive">
            {errors.newPassword.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm New Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="Confirm your new password"
          {...register("confirmPassword")}
          className={errors.confirmPassword ? "border-destructive" : ""}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-destructive">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={loading || isSubmitting}
        size="lg"
        className="w-full"
      >
        {loading || isSubmitting ? "Resetting..." : "Reset Password"}
      </Button>
    </form>
  );
}
