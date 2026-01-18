import { Response } from "express";
import { ObjectSchema, ValidationError } from "joi";
import { HTTP_STATUS, ERROR_MESSAGES } from "./constants.js";


export interface ValidationOptions {
  /**
   * Convert types (e.g., string "123" to number 123)
   * Default: false
   */
  convert?: boolean;

  /**
   * Context data for custom validation functions
   * Data that isn't part of the payload but is needed for validation
   */
  context?: Record<string, unknown>;
}

/**
 * Validation error detail interface
 * Structure of individual validation errors
 */
export interface ValidationErrorDetail {
  field: string;
  message: string;
}

/**
 * Validates arbitrary request data using a Joi schema
 * Controllers can call this helper directly
 * 
 * @template T - The type of the validated data (inferred from schema)
 * @param schema - Joi object schema to validate against
 * @param payload - The data to validate (usually req.body, req.query, or req.params)
 * @param res - Express response object (used to send validation errors)
 * @param options - Validation options (convert, context)
 * @returns Sanitized values of type T, or null when validation fails
 */
export const validateRequest = <T = unknown>(
  schema: ObjectSchema<T>,
  payload: unknown,
  res: Response,
  options: ValidationOptions = {}
): T | null => {
  const { error, value } = schema.validate(payload, {
    abortEarly: false, // Return all errors, not just the first one
    stripUnknown: false, // Do NOT silently drop unknown properties
    allowUnknown: false, // Treat any extra fields as validation errors
    convert: options.convert ?? false, // Default false; can be enabled per call
    context: options.context, // Lets you pass extra data into custom validation functions
  });

  if (error) {
    const errors: ValidationErrorDetail[] = error.details.map(
      (detail: ValidationError["details"][0]) => ({
        field: detail.path.join("."),
        message: detail.message,
      })
    );

    res.status(HTTP_STATUS.BAD_REQUEST).send({
      data: {
        message: ERROR_MESSAGES.VALIDATION_ERROR,
        errors,
      },
    });
    return null;
  }

  return value;
};

