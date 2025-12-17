import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { forgotPasswordSchema } from "../../../validations/authSchemas";
import { useAuth } from "../../../hooks/authHooks";
import { Mail, ArrowLeft } from "lucide-react";

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
      await requestPasswordReset(data.email);
      form.reset();
    } catch (error) {
      // Error message is handled by axios interceptor
    }
  };

  const onBackToSignIn = () => {
    // This function was referenced but not defined - adding placeholder
    // You may need to implement navigation logic here
  };

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, (errors) => {
            const firstError = Object.values(errors)[0];
            if (firstError?.message) {
              toast.error(firstError.message);
            }
          })}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  htmlFor="forgot-email"
                  className="text-sm font-medium text-slate-700"
                >
                  Email
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      id="forgot-email"
                      placeholder="name@example.com"
                      type="email"
                      autoComplete="email"
                      className="h-11 pl-10"
                      {...field}
                    />
                    <Mail className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send reset link"}
          </Button>
        </form>
      </Form>

      <div className="text-center text-sm text-slate-600">
        <button
          type="button"
          onClick={onBackToSignIn}
          className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to sign in
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
