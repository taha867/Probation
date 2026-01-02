import * as yup from "yup";
import { VALIDATION_MESSAGES } from "../utils/constants";
import {
  basePasswordSchema,
  baseConfirmPasswordSchema,
  imageFileSchema,
} from "./commonSchemas";

const {
  PASSWORD_REQUIRED,
  PASSWORD_TOO_SHORT,
  PASSWORD_TOO_LONG,
  CONFIRM_PASSWORD_REQUIRED,
} = VALIDATION_MESSAGES;

/**
 * Profile Image Validation Schema
 * Validates File object or existing image URL
 */
export const profileImageSchema = yup.object({
  image: imageFileSchema,
});

/**
 * Change Password Validation Schema
 * For authenticated users changing their password
 */
export const changePasswordSchema = yup.object({
  newPassword: basePasswordSchema
    .required(PASSWORD_REQUIRED)
    .min(8, PASSWORD_TOO_SHORT)
    .max(128, PASSWORD_TOO_LONG),
  confirmPassword: baseConfirmPasswordSchema("newPassword").required(
    CONFIRM_PASSWORD_REQUIRED,
  ),
});
