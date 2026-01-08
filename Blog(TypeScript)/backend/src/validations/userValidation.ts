import Joi, { ObjectSchema, CustomHelpers } from "joi";
import {
  idParamSchema,
  paginationQuerySchema,
  baseEmailSchema,
  basePasswordSchema,
  basePhoneSchema,
  baseNameSchema,
} from "./commonSchemas.js";
import type {
  UpdateUserInput,
  ListUsersQuery,
  GetUserPostsQuery,
} from "../interfaces/userInterface.js";
import type { Request } from "express";

/**
 * Extended Express Request interface for validation context
 * Used to access request object in custom validation functions
 */
interface ValidationContext {
  req?: Request;
}

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
export const getUserPostsQuerySchema: ObjectSchema<GetUserPostsQuery> =
  basePaginationQuerySchema
    .keys({
      search: Joi.string().optional().messages({
        "string.base": "Search must be a string",
      }),
    } as any) as ObjectSchema<GetUserPostsQuery>;

/**
 * List users query schema
 * Pagination parameters for listing users
 */
export const listUsersQuerySchema: ObjectSchema<ListUsersQuery> =
  basePaginationQuerySchema;

/**
 * Update user schema
 * Validates data for updating an existing user
 * All fields are optional (partial update)
 * Includes custom validation logic for handling file uploads and image removal
 */
export const updateUserSchema: ObjectSchema<UpdateUserInput> = Joi.object({
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
  // Image field from FormData (string filename or empty string for removal)
  // Actual file is in req.file (handled by multer)
  image: Joi.string().optional().allow("", null),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided to update",
  })
  .custom((value: UpdateUserInput, helpers: CustomHelpers) => {
    // Access request object through context passed to validate()
    const context = helpers.prefs.context as ValidationContext | undefined;
    const req = context?.req;
    const hasFileUpload = req?.file !== undefined;

    // Filter out undefined values and empty strings (but keep null and empty string for image removal)
    // This ensures we only include fields that were actually provided
    const filtered = Object.entries(value).reduce(
      (acc: Record<string, any>, [key, val]) => {
        if (key === "image") {
          // Keep image field if explicitly provided (empty string = removal, string = filename/placeholder)
          // If it's a placeholder from file upload, we'll remove it after validation
          if (val !== undefined) {
            acc[key] = val;
          }
        } else if (val !== "" && val !== undefined) {
          // For other fields, only include if not empty string and not undefined
          acc[key] = val;
        }
        return acc;
      },
      {}
    );

    // Validation passes if:
    // 1. A file was uploaded (hasFileUpload), OR
    // 2. Image field exists (even as empty string for removal), OR
    // 3. There are other valid fields to update
    if (
      hasFileUpload ||
      value.image !== undefined ||
      Object.keys(filtered).length > 0
    ) {
      // If file was uploaded but image field is a placeholder (matches filename), remove it
      // The actual file will be handled by the service layer
      if (hasFileUpload && filtered.image === req?.file?.originalname) {
        delete filtered.image;
      }
      // Return filtered object (may be empty if only file uploaded, but that's OK - service handles it)
      return filtered as UpdateUserInput;
    }

    // No valid fields found
    return helpers.error("any.custom", {
      message: "At least one field must be provided to update",
    });
  })
  .messages({
    "any.custom": "At least one field must be provided to update",
  });

/**
 * User ID parameter schema
 * Validates user ID parameter in route
 */
export const userIdParamSchema = userIdSchema;

// Re-export interfaces for backward compatibility
export type {
  UpdateUserInput,
  ListUsersQuery,
  GetUserPostsQuery,
};

