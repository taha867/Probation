import { ObjectSchema, StringSchema } from "joi";
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
export declare const idParamSchema: (entityName?: string) => ObjectSchema<{
    id: number;
}>;
/**
 * Pagination query schema
 * Generates a Joi schema for validating pagination query parameters
 *
 * @param options - Configuration options for pagination schema
 * @param options.defaultLimit - Default limit value (default: 10)
 * @param options.maxLimit - Maximum allowed limit value (default: 100)
 * @returns Joi schema for pagination query validation
 */
export declare const paginationQuerySchema: ({ defaultLimit, maxLimit, }?: PaginationQueryOptions) => ObjectSchema<{
    page?: number;
    limit?: number;
}>;
/**
 * Base email schema
 * Reusable Joi schema for email validation
 * Used as a base for email fields across different validation schemas
 */
export declare const baseEmailSchema: StringSchema;
/**
 * Base password schema
 * Reusable Joi schema for password validation
 * Minimum 8 characters
 * Used as a base for password fields across different validation schemas
 */
export declare const basePasswordSchema: StringSchema;
/**
 * Base phone schema
 * Reusable Joi schema for phone number validation
 * Pattern: optional + prefix, followed by 10-15 digits
 * Used as a base for phone fields across different validation schemas
 */
export declare const basePhoneSchema: StringSchema;
/**
 * Base name schema
 * Reusable Joi schema for name validation
 * Only letters and spaces, 2-100 characters
 * Used as a base for name fields across different validation schemas
 */
export declare const baseNameSchema: StringSchema;
//# sourceMappingURL=commonSchemas.d.ts.map