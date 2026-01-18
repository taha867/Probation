import Joi, { ObjectSchema } from "joi";
import {
  baseEmailSchema,
  basePasswordSchema,
  basePhoneSchema,
  baseNameSchema,
} from "./commonSchemas.js";
import {
  SignUpInput,
  SignInInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  RefreshTokenInput,
} from "../interfaces";


export type {
  SignUpInput,
  SignInInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  RefreshTokenInput,
};

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
export const signUpSchema: ObjectSchema<SignUpInput> = Joi.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema,
  image: Joi.string()
    .uri()
    .optional()
    .allow("", null)
    .messages({
      "string.uri": "Image must be a valid URL",
    }),
});

export const signInSchema: ObjectSchema<SignInInput> = Joi.object({
  email: baseEmailSchema.optional(),
  phone: loginPhoneSchema,
  password: passwordSchema,
}).or("email", "phone");

export const forgotPasswordSchema: ObjectSchema<ForgotPasswordInput> =
  Joi.object({
    email: emailSchema,
  });

export const resetPasswordSchema: ObjectSchema<ResetPasswordInput> =
  Joi.object({
    token: Joi.string().required(),
    newPassword: passwordSchema,
    confirmPassword: Joi.string().valid(Joi.ref("newPassword")).required(),
  });

export const refreshTokenSchema: ObjectSchema<RefreshTokenInput> =
  Joi.object({
    refreshToken: Joi.string().required(),
  });

