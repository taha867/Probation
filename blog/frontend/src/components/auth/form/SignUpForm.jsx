import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormField } from "../../custom";
import { signupSchema } from "../../../validations/authSchemas";
import { useAuth } from "../../../hooks/authHooks/authHooks";
import { createSubmitHandlerWithToast } from "../../../utils/formSubmitWithToast";

const SignUpForm = () => {
  const { signup, isLoading } = useAuth();

  const form = useForm({
    resolver: yupResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await signup(data);
      // Note: onSwitchToSignIn function was referenced but not defined
      // You may need to add navigation logic here
    } catch (error) {
      // Error message is handled by axios interceptor
    }
  };

  const handleSubmit = createSubmitHandlerWithToast(form, onSubmit);

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            type="text"
            label="Full name"
            placeholder="Alex Smith"
            showIcon
            className="h-11"
          />

          <FormField
            control={form.control}
            name="email"
            type="email"
            label="Email"
            showIcon
            className="h-11"
          />

          <FormField
            control={form.control}
            name="phone"
            type="tel"
            label="Phone"
            showIcon
            className="h-11"
          />

          <FormField
            control={form.control}
            name="password"
            type="password"
            label="Password"
            placeholder="Create a password"
            showToggle
            autoComplete="new-password"
            className="h-11"
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            type="password"
            label="Confirm password"
            placeholder="Re-enter password"
            showToggle
            autoComplete="new-password"
            className="h-11"
          />

          <Button
            type="submit"
            variant="success"
            className="w-full h-11 font-medium"
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Create account"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SignUpForm;
