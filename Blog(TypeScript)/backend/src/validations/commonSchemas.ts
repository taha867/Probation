import Joi, { ObjectSchema, StringSchema } from "joi";

/**
 * Pagination query schema options
 * Configuration for pagination query schema generation
 */
export interface PaginationQueryOptions {
  defaultLimit?: number;
  maxLimit?: number;
}

/**
 * ID parameter schema
 * Generates a Joi schema for validating ID parameters in routes
 * 
 * @param entityName - Name of the entity (e.g., "User ID", "Post ID")
 * @returns Joi schema for ID parameter validation
 */
export const idParamSchema = (entityName: string = "ID"): ObjectSchema<{ id: number }> =>
  Joi.object({
    id: Joi.number().integer().positive().required().messages({
      "number.base": `${entityName} must be a number`,
      "number.integer": `${entityName} must be an integer`,
      "number.positive": `${entityName} must be a positive number`,
      "any.required": `${entityName} is required`,
    }),
  });

/**
 * Pagination query schema
 * Generates a Joi schema for validating pagination query parameters
 * 
 * @param options - Configuration options for pagination schema
 * @param options.defaultLimit - Default limit value (default: 10)
 * @param options.maxLimit - Maximum allowed limit value (default: 100)
 * @returns Joi schema for pagination query validation
 */
export const paginationQuerySchema = ({
  defaultLimit = 10,
  maxLimit = 100,
}: PaginationQueryOptions = {}): ObjectSchema<{ page?: number; limit?: number }> =>
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

/**
 * Base email schema
 * Reusable Joi schema for email validation
 * Used as a base for email fields across different validation schemas
 */
export const baseEmailSchema: StringSchema = Joi.string().email();

/**
 * Base password schema
 * Reusable Joi schema for password validation
 * Minimum 8 characters
 * Used as a base for password fields across different validation schemas
 */
export const basePasswordSchema: StringSchema = Joi.string().min(8);

/**
 * Base phone schema
 * Reusable Joi schema for phone number validation
 * Pattern: optional + prefix, followed by 10-15 digits
 * Used as a base for phone fields across different validation schemas
 */
export const basePhoneSchema: StringSchema = Joi.string().pattern(/^\+?[0-9]{10,15}$/);

/**
 * Base name schema
 * Reusable Joi schema for name validation
 * Only letters and spaces, 2-100 characters
 * Used as a base for name fields across different validation schemas
 */
export const baseNameSchema: StringSchema = Joi.string()
  .min(2)
  .max(100)
  .pattern(/^[A-Za-z\s]+$/);

