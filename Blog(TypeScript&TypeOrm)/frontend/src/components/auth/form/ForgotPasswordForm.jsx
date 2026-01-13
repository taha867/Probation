import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormField } from "../../custom";
import { forgotPasswordSchema } from "../../../validations/authSchemas";
import { useAuth } from "../../../hooks/authHooks/authHooks";
import { createSubmitHandlerWithToast } from "../../../utils/formSubmitWithToast";

const ForgotPasswordForm = () => {
  const { requestPasswordReset, isLoading } = useAuth();

  const form = useForm({
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await requestPasswordReset({ email: data.email });
      form.reset();
    } catch (error) {
      // Error message is handled by axios interceptor
    }
  };

  const handleSubmit = createSubmitHandlerWithToast(form, onSubmit);

  const onBackToSignIn = () => {
    // This function was referenced but not defined - adding placeholder
    // You may need to implement navigation logic here
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            type="email"
            label="Email"
            showIcon
            className="h-11"
          />

          <Button
            type="submit"
            variant="success"
            className="w-full h-11 font-medium"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send reset link"}
          </Button>
        </form>
      </Form>
  );
};

export default ForgotPasswordForm;
