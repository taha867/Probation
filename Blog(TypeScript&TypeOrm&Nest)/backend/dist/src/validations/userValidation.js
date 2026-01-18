import Joi from "joi";
import { idParamSchema, paginationQuerySchema, baseEmailSchema, basePasswordSchema, basePhoneSchema, baseNameSchema, } from "./commonSchemas.js";
/**
 * Common patterns (user-specific variants)
 * Reusable schemas for user validation fields
 */
const emailSchema = baseEmailSchema.optional().messages({
    "string.email": "Please provide a valid email address",
});
const phoneSchema = basePhoneSchema.optional().messages({
    "string.pattern.base": "Phone number must be 10 to 15 digits",
});
const passwordSchema = basePasswordSchema.optional().messages({
    "string.min": "Password must be at least 8 characters long",
});
/**
 * User ID parameter schema
 * Validates user ID parameter in route
 */
const userIdSchema = idParamSchema("User ID");
/**
 * Base pagination query schema for users
 * Default limit: 20, Max limit: 100
 */
const basePaginationQuerySchema = paginationQuerySchema({
    defaultLimit: 20,
    maxLimit: 100,
});
/**
 * Get user posts query schema
 * Pagination with optional search functionality
 * Used for fetching a user's posts with search capability
 */
export const getUserPostsQuerySchema = basePaginationQuerySchema
    .concat(Joi.object({
    search: Joi.string().optional().messages({
        "string.base": "Search must be a string",
    }),
}));
/**
 * List users query schema
 * Pagination parameters for listing users
 */
export const listUsersQuerySchema = basePaginationQuerySchema;
/**
 * Update user schema
 * Validates data for updating an existing user
 * All fields are optional (partial update)
 * Simplified validation - "at least one field" check handled in controller
 */
export const updateUserSchema = Joi.object({
    name: Joi.string()
        // Use shared base name rules (letters and spaces only, 2–100)
        .concat(baseNameSchema)
        .optional()
        .messages({
        "string.min": "Name must be at least 2 characters long",
        "string.max": "Name must not exceed 100 characters",
        "string.pattern.base": "Name must contain only letters and spaces",
    }),
    email: emailSchema,
    phone: phoneSchema,
    password: passwordSchema,
    // Image field from FormData (empty string for removal, or omitted if file uploaded)
    // Actual file is in req.file (handled by multer middleware)
    image: Joi.string().optional().allow("", null),
});
/**
 * User ID parameter schema
 * Validates user ID parameter in route
 */
export const userIdParamSchema = userIdSchema;
//# sourceMappingURL=userValidation.js.map