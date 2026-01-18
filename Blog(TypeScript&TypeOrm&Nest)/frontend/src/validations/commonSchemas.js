import * as yup from "yup";
import { VALIDATION_MESSAGES } from "../utils/constants";

const {
  INVALID_EMAIL,
  PASSWORDS_DONT_MATCH,
  PHONE_TOO_SHORT,
  PHONE_TOO_LONG,
} = VALIDATION_MESSAGES;


export const baseEmailSchema = yup.string().email(INVALID_EMAIL).trim();

export const basePasswordSchema = yup.string();

export const baseNameSchema = yup.string().trim();

export const basePhoneSchema = yup
  .string()
  .min(10, PHONE_TOO_SHORT)
  .max(15, PHONE_TOO_LONG);

export const baseTextSchema = yup.string().trim();

/**
 * Base password confirmation schema factory
 * Creates a base schema that matches a password field
 * Extend with: .required() as needed
 * @param {string} passwordFieldName - Name of the password field to match (default: "password")
 * @returns {yup.StringSchema}
 */
export const baseConfirmPasswordSchema = (passwordFieldName = "password") =>
  yup.string().oneOf([yup.ref(passwordFieldName)], PASSWORDS_DONT_MATCH);

/**
 * Image file validation schema
 * Validates File object or existing image URL
 * Used in: post image, profile image
 */
export const imageFileSchema = yup
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
  });

