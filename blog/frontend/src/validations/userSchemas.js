
import * as yup from "yup";
import { VALIDATION_MESSAGES } from "../utils/constants";

/**
 * Profile Image Validation Schema
 * Validates Cloudinary upload result or existing image URL
 */
export const profileImageSchema = yup.object({
  image: yup
    .mixed()
    .nullable()
    .transform((value, originalValue) => {
      // Normalize empty objects to null
      if (value && typeof value === "object" && !(value.image) && Object.keys(value).length === 0) {
        return null;
      }
      return value;
    })
    .test("image-format", "Image must be a valid Cloudinary upload result or URL", (value) => {
      if (!value || value === null) return true; // Optional field
      if (typeof value === "string") return true; // Existing image URL
      if (typeof value === "object" && value.image && value.imagePublicId) {
        // Cloudinary upload result
        return typeof value.image === "string" && value.image.length > 0;
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
