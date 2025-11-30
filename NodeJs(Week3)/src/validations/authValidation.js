import Joi from "joi";

// Common validation patterns
const emailSchema = Joi.string().email().required().messages({
  "string.email": "Please provide a valid email address",
  "any.required": "Email is required",
});

const passwordSchema = Joi.string().min(8).required().messages({
  "string.min": "Password must be at least 8 characters long",
  "any.required": "Password is required",
});

const phoneSchema = Joi.string().pattern(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/).optional().messages({
  "string.pattern.base": "Please provide a valid phone number",
});

// Auth validation schemas
export const signUpSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    "string.min": "Name must be at least 2 characters long",
    "string.max": "Name must not exceed 100 characters",
    "any.required": "Name is required",
  }),
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema,
});

export const signInSchema = Joi.object({
  email: Joi.string().email().optional(),
  phone: phoneSchema,
  password: passwordSchema,
}).or("email", "phone").messages({
  "object.missing": "Either email or phone is required",
});

export const forgotPasswordSchema = Joi.object({
  email: emailSchema,
});

export const resetPasswordSchema = Joi.object({
  token: Joi.string().required().messages({
    "any.required": "Reset token is required",
  }),
  newPassword: passwordSchema,
  confirmPassword: Joi.string().valid(Joi.ref("newPassword")).required().messages({
    "any.only": "Passwords do not match",
    "any.required": "Confirm password is required",
  }),
});

export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    "any.required": "Refresh token is required",
  }),
});

