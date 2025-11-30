import Joi from "joi";
import { httpStatus, errorMessages } from "../utils/constants.js";

/**
 * Validation middleware factory
 * @param {Joi.Schema} schema - Joi validation schema
 * @param {string} property - Property to validate (body, query, params)
 * @returns {Function} Express middleware function
 */
export const validate = (schema, property = "body") => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false, // Return all errors, not just the first one
      stripUnknown: true, // Remove unknown properties
      convert: true, // Convert types (e.g., string to number)
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }));

      return res.status(httpStatus.badRequest).send({
        message: "Validation error",
        errors,
      });
    }

    // Replace req[property] with validated and sanitized value
    // For body, we can replace directly
    if (property === "body") {
      req[property] = value;
    } else {
      // For query and params, update properties individually
      // This works because we're modifying properties, not replacing the object
      const target = req[property];
      for (const key in value) {
        if (Object.prototype.hasOwnProperty.call(value, key)) {
          target[key] = value[key];
        }
      }
    }
    
    next();
  };
};

