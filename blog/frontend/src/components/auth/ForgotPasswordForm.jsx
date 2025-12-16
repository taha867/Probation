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
import { forgotPasswordSchema } from "../../validations/authSchemas";
import { useAuth } from "../../hooks/authHooks";
import { Mail, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { TOAST_MESSAGES } from "../../utils/constants";

const ForgotPasswordForm = () => {
  const { requestPasswordReset, isLoading, error } = useAuth();

  const form = useForm({
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data) => {
    const loadingToast = toast.loading(TOAST_MESSAGES.SENDING_RESET_LINK);

    try {
      await requestPasswordReset(data.email);
      toast.dismiss(loadingToast);
      toast.success(TOAST_MESSAGES.RESET_LINK_SENT);
      form.reset();
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error.message || TOAST_MESSAGES.RESET_EMAIL_FAILED);
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

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

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
