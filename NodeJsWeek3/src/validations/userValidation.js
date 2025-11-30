import Joi from "joi";

// Common patterns
const emailSchema = Joi.string().email().optional().messages({
  "string.email": "Please provide a valid email address",
});

const phoneSchema = Joi.string().pattern(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/).optional().messages({
  "string.pattern.base": "Please provide a valid phone number",
});

const passwordSchema = Joi.string().min(8).optional().messages({
  "string.min": "Password must be at least 8 characters long",
});

const idParamSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    "number.base": "User ID must be a number",
    "number.integer": "User ID must be an integer",
    "number.positive": "User ID must be a positive number",
    "any.required": "User ID is required",
  }),
});

const paginationQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).optional().default(1).messages({
    "number.base": "Page must be a number",
    "number.integer": "Page must be an integer",
    "number.min": "Page must be at least 1",
  }),
  limit: Joi.number().integer().min(1).max(100).optional().default(20).messages({
    "number.base": "Limit must be a number",
    "number.integer": "Limit must be an integer",
    "number.min": "Limit must be at least 1",
    "number.max": "Limit must not exceed 100",
  }),
});

export const getUserPostsQuerySchema = paginationQuerySchema;

export const listUsersQuerySchema = paginationQuerySchema;

export const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional().messages({
    "string.min": "Name must be at least 2 characters long",
    "string.max": "Name must not exceed 100 characters",
  }),
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema,
}).min(1).messages({
  "object.min": "At least one field must be provided to update",
});

export const userIdParamSchema = idParamSchema;

