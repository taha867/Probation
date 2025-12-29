
import * as yup from "yup";
import { VALIDATION_MESSAGES } from "../utils/constants";

/**
 * Sign In Form Validation Schema
 */
export const signinSchema = yup.object({
  email: yup
    .string()
    .required(VALIDATION_MESSAGES.EMAIL_REQUIRED)
    .email(VALIDATION_MESSAGES.INVALID_EMAIL) // Yup's built-in email validation
    .trim(),

  password: yup
    .string()
    .required(VALIDATION_MESSAGES.PASSWORD_REQUIRED)
    .min(8, VALIDATION_MESSAGES.PASSWORD_TOO_SHORT), // Keep it simple for signin
});

/**
 * Sign Up Form Validation Schema
 */
export const signupSchema = yup.object({
  name: yup
    .string()
    .required(VALIDATION_MESSAGES.NAME_REQUIRED)
    .min(2, VALIDATION_MESSAGES.NAME_TOO_SHORT)
    .max(50, VALIDATION_MESSAGES.NAME_TOO_LONG)
    .trim(),

  phone: yup
    .string()
    .required(VALIDATION_MESSAGES.PHONE_REQUIRED)
    .min(10, VALIDATION_MESSAGES.PHONE_TOO_SHORT)
    .max(15, VALIDATION_MESSAGES.PHONE_TOO_LONG),

  email: yup
    .string()
    .required(VALIDATION_MESSAGES.EMAIL_REQUIRED)
    .email(VALIDATION_MESSAGES.INVALID_EMAIL) // Yup's built-in email validation
    .trim(),

  password: yup
    .string()
    .required(VALIDATION_MESSAGES.PASSWORD_REQUIRED)
    .min(8, VALIDATION_MESSAGES.PASSWORD_TOO_SHORT)
    .max(128, VALIDATION_MESSAGES.PASSWORD_TOO_LONG),

  confirmPassword: yup
    .string()
    .required(VALIDATION_MESSAGES.CONFIRM_PASSWORD_REQUIRED)
    .oneOf([yup.ref("password")], VALIDATION_MESSAGES.PASSWORDS_DONT_MATCH),
});

/**
 * Forgot Password Form Validation Schema
 */
export const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .required(VALIDATION_MESSAGES.EMAIL_REQUIRED)
    .max(254, VALIDATION_MESSAGES.EMAIL_TOO_LONG)
    .email(VALIDATION_MESSAGES.INVALID_EMAIL)
    .trim(),
});

/**
 * Reset Password Form Validation Schema
 */
export const resetPasswordSchema = yup.object({
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

/**
 * Export individual field schemas for reuse if needed
 */
export const fieldSchemas = {
  email: yup
    .string()
    .required(VALIDATION_MESSAGES.EMAIL_REQUIRED)
    .email(VALIDATION_MESSAGES.INVALID_EMAIL)
    .trim(),

  password: yup
    .string()
    .required(VALIDATION_MESSAGES.PASSWORD_REQUIRED)
    .min(8, VALIDATION_MESSAGES.PASSWORD_TOO_SHORT),

  name: yup
    .string()
    .required(VALIDATION_MESSAGES.NAME_REQUIRED)
    .min(2, VALIDATION_MESSAGES.NAME_TOO_SHORT)
    .max(50, VALIDATION_MESSAGES.NAME_TOO_LONG)
    .trim(),

  phone: yup
    .string()
    .required(VALIDATION_MESSAGES.PHONE_REQUIRED)
    .min(10, VALIDATION_MESSAGES.PHONE_TOO_SHORT)
    .max(15, VALIDATION_MESSAGES.PHONE_TOO_LONG),
};
