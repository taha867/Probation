import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormField } from "../../custom";
import { signinSchema } from "../../../validations/authSchemas";
import { useAuth } from "../../../hooks/authHooks/authHooks";
import { createSubmitHandlerWithToast } from "../../../utils/formSubmitWithToast";

const SignInForm = () => {
  const { signin, isLoading } = useAuth();
  const navigate = useNavigate();

  const form = useForm({
    resolver: yupResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await signin(data);
      navigate("/dashboard");
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
            name="email"
            type="email"
            label="Email"
            className="h-11"
          />

          <FormField
            control={form.control}
            name="password"
            type="password"
            label="Password"
            showToggle
            showForgotLink
            className="h-11"
          />

          <Button
            type="submit"
            variant="success"
            className="w-full h-11 font-medium"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in with Email"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SignInForm;
