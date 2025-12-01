import Joi from "joi";
import { idParamSchema, paginationQuerySchema } from "./commonSchemas.js";

// Common patterns
const emailSchema = Joi.string()
  .trim()
  .lowercase()
  .email()
  .max(255)
  .optional()
  .messages({
    "string.email": "Please provide a valid email address",
    "string.max": "Email must not exceed 255 characters",
  });

const phoneSchema = Joi.string()
  .trim()
  .max(20)
  .pattern(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/)
  .optional()
  .messages({
    "string.max": "Phone number must not exceed 20 characters",
    "string.pattern.base": "Please provide a valid phone number",
  });

const passwordSchema = Joi.string()
  .min(8)
  .max(128)
  .optional()
  .messages({
    "string.min": "Password must be at least 8 characters long",
    "string.max": "Password must not exceed 128 characters",
  });

const userIdSchema = idParamSchema("User ID");

const basePaginationQuerySchema = paginationQuerySchema({
  defaultLimit: 20,
  maxLimit: 100,
});

export const getUserPostsQuerySchema = basePaginationQuerySchema;

export const listUsersQuerySchema = basePaginationQuerySchema;

export const updateUserSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .pattern(/^[\p{L}\p{N}\s'.-]+$/u)
    .optional()
    .messages({
      "string.min": "Name must be at least 2 characters long",
      "string.max": "Name must not exceed 100 characters",
      "string.pattern.base": "Name contains invalid characters",
    }),
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema,
}).min(1).messages({
  "object.min": "At least one field must be provided to update",
});

export const userIdParamSchema = userIdSchema;

