import Joi from "joi";
import {
  idParamSchema,
  paginationQuerySchema,
  baseEmailSchema,
  basePasswordSchema,
  basePhoneSchema,
  baseNameSchema,
} from "./commonSchemas.js";

// Common patterns (user-specific variants)
const emailSchema = baseEmailSchema.optional().messages({
  "string.email": "Please provide a valid email address",
});

const phoneSchema = basePhoneSchema.optional().messages({
  "string.pattern.base": "Phone number must be 10 to 15 digits",
});

const passwordSchema = basePasswordSchema.optional().messages({
  "string.min": "Password must be at least 8 characters long",
});

const userIdSchema = idParamSchema("User ID");

const basePaginationQuerySchema = paginationQuerySchema({
  defaultLimit: 20,
  maxLimit: 100,
});

// Dashboard: allow search when fetching a user's posts
export const getUserPostsQuerySchema = basePaginationQuerySchema.keys({
  search: Joi.string().optional().messages({
    "string.base": "Search must be a string",
  }),
});

export const listUsersQuerySchema = basePaginationQuerySchema;

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
  image: Joi.string()
    .uri()
    .optional()
    .allow("", null)
    .messages({
      "string.uri": "Image must be a valid URL",
    }),
  imagePublicId: Joi.string().optional().allow("", null),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided to update",
  })
  .custom((value, helpers) => {
    // Filter out empty strings (but keep null values for clearing fields)
    const filtered = Object.entries(value).reduce((acc, [key, val]) => {
      if (val !== "" && val !== undefined) {
        acc[key] = val;
      }
      return acc;
    }, {});

    // Ensure at least one valid field after filtering empty strings
    if (Object.keys(filtered).length === 0) {
      return helpers.error("any.custom", {
        message: "At least one field must be provided to update",
      });
    }

    // Return filtered object (without empty strings)
    return filtered;
  })
  .messages({
    "any.custom": "At least one field must be provided to update",
  });

export const userIdParamSchema = userIdSchema;

