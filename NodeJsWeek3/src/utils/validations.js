import { HTTP_STATUS } from "./constants.js";
import Joi from "joi";

/**
 * Validates arbitrary request data using a Joi schema.
 * Controllers can call this helper directly
 * @param {Joi.Schema} schema
 * @param {Object} payload
 * @param {Object} res - Express response (used to send validation errors)
 * @returns {Object|null} - Sanitized values or null when validation fails
 */
export const validateRequest = (schema, payload, res, options = {}) => {
  const { error, value } = schema.validate(payload, {
    abortEarly: false, // Return all errors, not just the first one
    stripUnknown: false, // Do NOT silently drop unknown properties
    allowUnknown: false, // Treat any extra fields as validation errors
    convert: options.convert ?? false, // Default false; can be enabled per call
  });

  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.path.join("."),
      message: detail.message,
    }));

    res.status(HTTP_STATUS.BAD_REQUEST).send({
      data: {
        message: "Validation error",
        errors,
      },
    });
    return null;
  }

  return value;
};


