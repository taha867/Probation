/**
 * ForgotPasswordForm component
 * Form for requesting password reset email
 */
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgotPasswordSchema } from "../validations/authSchemas";

export default function ForgotPasswordForm({ onSubmit, loading }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
    mode: "onChange", // Validate on change for better UX
  });

  const onFormSubmit = async (data) => {
    await onSubmit(data.email);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="Enter your email address"
          {...register("email")}
          className={errors.email ? "border-destructive" : ""}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={loading || isSubmitting}
        size="lg"
        className="w-full"
      >
        {loading || isSubmitting ? "Sending..." : "Send Reset Link"}
      </Button>
    </form>
  );
}
