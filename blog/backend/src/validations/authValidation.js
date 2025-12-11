import Joi from "joi";
import {
  baseEmailSchema,
  basePasswordSchema,
  basePhoneSchema,
  baseNameSchema,
} from "./commonSchemas.js";

// Common validation patterns using shared base schemas
const emailSchema = baseEmailSchema.required();

const passwordSchema = basePasswordSchema.required();

const phoneSchema = basePhoneSchema.required().messages({
  "string.pattern.base": "Phone number must be 10 to 15 digits",
});

// For login, phone should be optional (either email OR phone)
const loginPhoneSchema = basePhoneSchema.optional().messages({
  "string.pattern.base": "Phone number must be 10 to 15 digits",
});

// Name validation: only letters (a-z, A-Z) and spaces
const nameSchema = baseNameSchema.required().messages({
  "string.pattern.base": "Name must contain only letters and spaces",
});

// Auth validation schemas
export const signUpSchema = Joi.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema,
});

export const signInSchema = Joi.object({
  email: baseEmailSchema.optional(),
  phone: loginPhoneSchema,
  password: passwordSchema,
}).or("email", "phone");

export const forgotPasswordSchema = Joi.object({
  email: emailSchema,
});

export const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  newPassword: passwordSchema,
  confirmPassword: Joi.string().valid(Joi.ref("newPassword")).required(),
});

export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});
