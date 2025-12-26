/**
 * FormField - Unified form field component for all input types
 * Handles text, email, password, tel, textarea inputs with smart type-based behavior
 * Replaces separate FormInput and FormTextarea components
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FormControl,
  FormField as ShadcnFormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Eye, EyeOff, Mail, User, Phone } from "lucide-react";

export const FormField = ({
  control,
  name,
  type = "text",
  label,
  placeholder,
  showIcon = false,
  showToggle = false,
  showForgotLink = false,
  className = "",
  disabled = false,
  autoComplete,
  rows = 4, // For textarea type
  helperText,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Auto-determine properties based on type
  const getTypeConfig = () => {
    switch (type) {
      case "email":
        return {
          inputType: "email",
          autoComplete: autoComplete || "email",
          icon: showIcon ? Mail : null,
          placeholder: placeholder || "name@example.com",
          isTextarea: false,
        };
      case "password":
        return {
          inputType: showPassword ? "text" : "password",
          autoComplete: autoComplete || "current-password",
          icon: null, // Password uses toggle button instead
          placeholder: placeholder || "enter your password",
          isTextarea: false,
        };
      case "tel":
        return {
          inputType: "tel",
          autoComplete: autoComplete || "tel",
          icon: showIcon ? Phone : null,
          placeholder: placeholder || "+1 555 123 4567",
          isTextarea: false,
        };
      case "textarea":
        return {
          inputType: "text", // Not used for textarea
          autoComplete: autoComplete || "off",
          icon: null, // Textarea doesn't support icons
          placeholder: placeholder || "",
          isTextarea: true,
        };
      case "text":
      default:
        return {
          inputType: "text",
          autoComplete: autoComplete || "name",
          icon: showIcon ? User : null,
          placeholder: placeholder || "",
          isTextarea: false,
        };
    }
  };

  const config = getTypeConfig();

  // Generate unique ID for accessibility
  const fieldId = `${name}-${type}`;

  // Handle forgot password link
  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <ShadcnFormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {/* Label with optional forgot password link */}
          <div className="flex items-center justify-between">
            <FormLabel
              htmlFor={fieldId}
              className="text-sm font-medium text-slate-700"
            >
              {label}
            </FormLabel>
            {showForgotLink && type === "password" && (
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                Forgot password?
              </button>
            )}
          </div>

          <FormControl>
            {config.isTextarea ? (
              // Textarea for multi-line input
              <Textarea
                id={fieldId}
                name={name}
                placeholder={config.placeholder}
                disabled={disabled}
                rows={rows}
                className={`resize-none ${className}`}
                {...field}
                {...props}
              />
            ) : (
              // Input for single-line input
              <div className="relative">
                <Input
                  id={fieldId}
                  name={name}
                  type={config.inputType}
                  placeholder={config.placeholder}
                  autoComplete={config.autoComplete}
                  disabled={disabled}
                  className={`${className} ${
                    config.icon ? "pl-10" : ""
                  } ${showToggle && type === "password" ? "pr-20" : ""}`}
                  {...field}
                  {...props}
                />

                {/* Left icon */}
                {config.icon && (
                  <config.icon className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                )}

                {/* Password toggle button */}
                {showToggle && type === "password" && (
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center gap-1.5 text-gray-500 hover:text-gray-700 text-sm"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <>
                        <EyeOff className="h-4 w-4" />
                        <span>Hide</span>
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4" />
                        <span>Show</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </FormControl>

          {helperText && (
            <FormDescription className="text-xs text-gray-500">
              {helperText}
            </FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormField;
