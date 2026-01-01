
import * as yup from "yup";
import { VALIDATION_MESSAGES } from "../utils/constants";

/**
 * Profile Image Validation Schema
 * Validates File object or existing image URL
 */
export const profileImageSchema = yup.object({
  image: yup
    .mixed()
    .nullable()
    .optional()
    .test("file-type", "Only image files are allowed", (value) => {
      if (!value) return true; // Optional field
      if (typeof value === "string") return true; // Existing URL
      if (value instanceof File) {
        return value.type.startsWith("image/");
      }
      return false;
    })
    .test("file-size", "File size must be less than 5MB", (value) => {
      if (!value || typeof value === "string") return true;
      if (value instanceof File) {
        return value.size <= 5 * 1024 * 1024; // 5MB
      }
      return false;
    }),
});

/**
 * Change Password Validation Schema
 * For authenticated users changing their password
 */
export const changePasswordSchema = yup.object({
  newPassword: yup
    .string()
    .required(VALIDATION_MESSAGES.PASSWORD_REQUIRED)
    .min(8, VALIDATION_MESSAGES.PASSWORD_TOO_SHORT)
    .max(128, VALIDATION_MESSAGES.PASSWORD_TOO_LONG),

  confirmPassword: yup
    .string()
    .required(VALIDATION_MESSAGES.CONFIRM_PASSWORD_REQUIRED)
    .oneOf([yup.ref("newPassword")], VALIDATION_MESSAGES.PASSWORDS_DONT_MATCH),
});
