import Joi from "joi";
import {
  idParamSchema,
  paginationQuerySchema,
  baseEmailSchema,
  basePasswordSchema,
  basePhoneSchema,
  baseNameSchema,
} from "./commonSchemas.js";

// Common patterns (user-specific variants)
const emailSchema = baseEmailSchema.optional().messages({
  "string.email": "Please provide a valid email address",
});

const phoneSchema = basePhoneSchema.optional().messages({
  "string.pattern.base": "Phone number must be 10 to 15 digits",
});

const passwordSchema = basePasswordSchema.optional().messages({
  "string.min": "Password must be at least 8 characters long",
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
    // Use shared base name rules (letters and spaces only, 2–100)
    .concat(baseNameSchema)
    .optional()
    .messages({
    "string.min": "Name must be at least 2 characters long",
    "string.max": "Name must not exceed 100 characters",
      "string.pattern.base": "Name must contain only letters and spaces",
  }),
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema,
}).min(1).messages({
  "object.min": "At least one field must be provided to update",
});

export const userIdParamSchema = userIdSchema;

