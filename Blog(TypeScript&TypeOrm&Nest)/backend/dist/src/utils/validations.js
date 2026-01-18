import { HTTP_STATUS, ERROR_MESSAGES } from "./constants.js";
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
export const validateRequest = (schema, payload, res, options = {}) => {
    const { error, value } = schema.validate(payload, {
        abortEarly: false, // Return all errors, not just the first one
        stripUnknown: false, // Do NOT silently drop unknown properties
        allowUnknown: false, // Treat any extra fields as validation errors
        convert: options.convert ?? false, // Default false; can be enabled per call
        context: options.context, // Lets you pass extra data into custom validation functions
    });
    if (error) {
        const errors = error.details.map((detail) => ({
            field: detail.path.join("."),
            message: detail.message,
        }));
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
//# sourceMappingURL=validations.js.map