import Joi from "joi";
import { httpStatus, errorMessages } from "../utils/constants.js";

/**
 * Validation middleware factory
 * @param {Joi.Schema} schema - Joi validation schema
 * @param {string} property - Property to validate (body, query, params)
 * @returns {Function} Express middleware function
 */
//You can validate:  body, query, params, property defaults to "body"
export const validate = (schema, property = "body") => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false, // Return all errors, not just the first one
      stripUnknown: true, // Remove unknown properties
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
    req[property] = value;
    next();
  };
};
