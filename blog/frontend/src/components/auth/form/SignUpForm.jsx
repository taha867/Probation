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
import { signupSchema } from "../../../validations/authSchemas";
import { useAuth } from "../../../hooks/authHooks";
import { Eye, EyeOff, User, Mail, Phone } from "lucide-react";
import { useState } from "react";

const SignUpForm = () => {
  const { signup, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
      onSwitchToSignIn();
    } catch (error) {
      // Error message is handled by axios interceptor
    }
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  htmlFor="signup-name"
                  className="text-sm font-medium text-slate-700"
                >
                  Full name
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      id="signup-name"
                      placeholder="Alex Smith"
                      autoComplete="name"
                      className="h-11 pl-10"
                      {...field}
                    />
                    <User className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  htmlFor="signup-email"
                  className="text-sm font-medium text-slate-700"
                >
                  Email
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      id="signup-email"
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

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  htmlFor="signup-phone"
                  className="text-sm font-medium text-slate-700"
                >
                  Phone
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      id="signup-phone"
                      placeholder="+1 555 123 4567"
                      type="tel"
                      autoComplete="tel"
                      className="h-11 pl-10"
                      {...field}
                    />
                    <Phone className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  htmlFor="signup-password"
                  className="text-sm font-medium text-slate-700"
                >
                  Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      placeholder="Create a password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      className="h-11 pr-10"
                      {...field}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
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
                <FormLabel
                  htmlFor="signup-confirm-password"
                  className="text-sm font-medium text-slate-700"
                >
                  Confirm password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      id="signup-confirm-password"
                      placeholder="Re-enter password"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      className="h-11 pr-10"
                      {...field}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
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
            {isLoading ? "Creating account..." : "Create account"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SignUpForm;
