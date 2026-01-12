import * as yup from "yup";
import { VALIDATION_MESSAGES } from "../utils/constants";
import {
  baseEmailSchema,
  basePasswordSchema,
  baseNameSchema,
  basePhoneSchema,
  baseConfirmPasswordSchema,
} from "./commonSchemas";

const {
  EMAIL_REQUIRED,
  EMAIL_TOO_LONG,
  PASSWORD_REQUIRED,
  PASSWORD_TOO_SHORT,
  PASSWORD_TOO_LONG,
  NAME_REQUIRED,
  NAME_TOO_SHORT,
  NAME_TOO_LONG,
  PHONE_REQUIRED,
  CONFIRM_PASSWORD_REQUIRED,
} = VALIDATION_MESSAGES;

/**
 * Sign In Form Validation Schema
 */
export const signinSchema = yup.object({
  email: baseEmailSchema.required(EMAIL_REQUIRED),
  password: basePasswordSchema
    .required(PASSWORD_REQUIRED)
    .min(8, PASSWORD_TOO_SHORT),
});

/**
 * Sign Up Form Validation Schema
 */
export const signupSchema = yup.object({
  name: baseNameSchema
    .required(NAME_REQUIRED)
    .min(2, NAME_TOO_SHORT)
    .max(50, NAME_TOO_LONG),
  phone: basePhoneSchema.required(PHONE_REQUIRED),
  email: baseEmailSchema.required(EMAIL_REQUIRED),
  password: basePasswordSchema
    .required(PASSWORD_REQUIRED)
    .min(8, PASSWORD_TOO_SHORT)
    .max(128, PASSWORD_TOO_LONG),
  confirmPassword: baseConfirmPasswordSchema("password").required(
    CONFIRM_PASSWORD_REQUIRED,
  ),
});

/**
 * Forgot Password Form Validation Schema
 */
export const forgotPasswordSchema = yup.object({
  email: baseEmailSchema.required(EMAIL_REQUIRED).max(254, EMAIL_TOO_LONG),
});

/**
 * Reset Password Form Validation Schema
 */
export const resetPasswordSchema = yup.object({
  newPassword: basePasswordSchema
    .required(PASSWORD_REQUIRED)
    .min(8, PASSWORD_TOO_SHORT)
    .max(128, PASSWORD_TOO_LONG),
  confirmPassword: baseConfirmPasswordSchema("newPassword").required(
    CONFIRM_PASSWORD_REQUIRED,
  ),
});
