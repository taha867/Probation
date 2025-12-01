import Joi from "joi";

// Common validation patterns using Joi defaults
const emailSchema = Joi.string().email().required();

const passwordSchema = Joi.string().min(8).required();

const phoneSchema = Joi.string()
  .pattern(/^\+?[0-9]{10,15}$/)
  .required()
  .messages({
    "string.pattern.base": "Phone number must be 10 to 15 digits",
  });

// For login, phone should be optional (either email OR phone)
const loginPhoneSchema = Joi.string()
  .pattern(/^\+?[0-9]{10,15}$/)
  .optional()
  .messages({
    "string.pattern.base": "Phone number must be 10 to 15 digits",
  });

// Name validation: only letters (a-z, A-Z) and spaces
const nameSchema = Joi.string()
  .min(2)
  .max(100)
  .pattern(/^[A-Za-z\s]+$/)
  .required()
  .messages({
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
  email: Joi.string().email().optional(),
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
