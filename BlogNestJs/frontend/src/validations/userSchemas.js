import * as yup from "yup";
import { VALIDATION_MESSAGES } from "../utils/constants";
import {
  basePasswordSchema,
  baseConfirmPasswordSchema,
  imageFileSchema,
  baseNameSchema,
  basePhoneSchema,
  baseEmailSchema
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

/**
 * Update Profile Validation Schema
 * Validates name, phone, email, and optional image
 */
export const updateProfileSchema = yup.object({
  name: baseNameSchema.required(VALIDATION_MESSAGES.NAME_REQUIRED).min(2, VALIDATION_MESSAGES.NAME_TOO_SHORT).max(50, VALIDATION_MESSAGES.NAME_TOO_LONG),
  phone: basePhoneSchema.required(VALIDATION_MESSAGES.PHONE_REQUIRED),
  email: baseEmailSchema.required(VALIDATION_MESSAGES.EMAIL_REQUIRED),
  image: imageFileSchema.nullable(),
});
