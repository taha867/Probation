import { Response } from "express";
import { ObjectSchema } from "joi";
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
export declare const validateRequest: <T = unknown>(schema: ObjectSchema<T>, payload: unknown, res: Response, options?: ValidationOptions) => T | null;
//# sourceMappingURL=validations.d.ts.map