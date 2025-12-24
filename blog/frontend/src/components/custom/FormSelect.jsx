/**
 * FormSelect - Custom select component for dropdown selections
 * Handles status selections, categories, and other dropdown options
 */
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const FormSelect = ({
  control,
  name,
  label,
  placeholder = "Select an option",
  options = [],
  disabled = false,
  className = "",
  ...props
}) => {
  // Generate unique ID for accessibility
  const fieldId = `${name}-select`;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel htmlFor={fieldId} className="text-sm font-medium text-slate-700">
            {label}
          </FormLabel>
          <Select
            onValueChange={field.onChange}
            value={field.value}
            disabled={disabled}
            {...props}
          >
            <FormControl>
              <SelectTrigger id={fieldId} className={className}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormSelect;
