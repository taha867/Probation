import toast from "react-hot-toast";

/**
 * Wraps react-hook-form handleSubmit to show toast messages for:
 * - client-side validation errors (red error toast)
 * - optional success message (green success toast)
 *
 * This does NOT replace axios interceptors; those still handle
 * server-side success/error toasts.
 *
 * @param {import("react-hook-form").UseFormReturn} form - useForm() return object
 * @param {Function} onValid - called when form is valid
 * @param {Object} [options]
 * @param {string} [options.successMessage] - optional success toast message
 */
export const createSubmitHandlerWithToast = (form, onValid, options = {}) => {
  const { successMessage } = options;

  return form.handleSubmit(
    async (data, event) => {
      const result = await onValid(data, event);

      if (successMessage) {
        toast.success(successMessage);
      }

      return result;
    },
    (errors) => {
      const firstError = Object.values(errors || {})[0];
      const message =
        firstError?.message ||
        "Please fix the errors highlighted in the form before submitting.";

      toast.error(message);
    },
  );
};


