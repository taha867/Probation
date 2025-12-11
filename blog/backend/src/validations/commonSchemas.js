import Joi from "joi";

// Shared building blocks for many schemas

export const idParamSchema = (entityName = "ID") =>
  Joi.object({
    id: Joi.number().integer().positive().required().messages({
      "number.base": `${entityName} must be a number`,
      "number.integer": `${entityName} must be an integer`,
      "number.positive": `${entityName} must be a positive number`,
      "any.required": `${entityName} is required`,
    }),
  });

export const paginationQuerySchema = ({
  defaultLimit = 10,
  maxLimit = 100,
} = {}) =>
  Joi.object({
    page: Joi.number().integer().min(1).optional().default(1).messages({
      "number.base": "Page must be a number",
      "number.integer": "Page must be an integer",
      "number.min": "Page must be at least 1",
    }),
    limit: Joi.number()
      .integer()
      .min(1)
      .max(maxLimit)
      .optional()
      .default(defaultLimit)
      .messages({
        "number.base": "Limit must be a number",
        "number.integer": "Limit must be an integer",
        "number.min": "Limit must be at least 1",
        "number.max": `Limit must not exceed ${maxLimit}`,
      }),
  });

// Common field schemas (as in authValidation)
export const baseEmailSchema = Joi.string().email();

export const basePasswordSchema = Joi.string().min(8);

export const basePhoneSchema = Joi.string().pattern(/^\+?[0-9]{10,15}$/);

// Name: only letters and spaces, 2–100 chars
export const baseNameSchema = Joi.string()
  .min(2)
  .max(100)
  .pattern(/^[A-Za-z\s]+$/);

