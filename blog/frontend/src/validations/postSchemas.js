import * as yup from "yup";
import { POST_STATUS } from "../utils/constants";
import { VALIDATION_MESSAGES } from "../utils/constants";
import { imageFileSchema, baseTextSchema } from "./commonSchemas";

const { DRAFT, PUBLISHED } = POST_STATUS;
const {
  TITLE_REQUIRED,
  TITLE_TOO_SHORT,
  TITLE_TOO_LONG,
  CONTENT_REQUIRED,
  CONTENT_TOO_SHORT,
  CONTENT_TOO_LONG,
  STATUS_INVALID,
  SEARCH_TOO_LONG,
} = VALIDATION_MESSAGES;

/**
 * Create/Update Post Form Validation Schema
 */
export const postSchema = yup.object({
  title: baseTextSchema
    .required(TITLE_REQUIRED)
    .min(3, TITLE_TOO_SHORT)
    .max(200, TITLE_TOO_LONG),

  body: baseTextSchema
    .required(CONTENT_REQUIRED)
    .min(10, CONTENT_TOO_SHORT)
    .max(10000, CONTENT_TOO_LONG),

  status: yup
    .string()
    .oneOf([DRAFT, PUBLISHED], STATUS_INVALID)
    .default(DRAFT),

  // Image can be a File object (new upload) or string (existing URL) or null
  image: imageFileSchema,
});

/**
 * Search Posts Form Validation Schema
 */
export const searchPostsSchema = yup.object({
  search: baseTextSchema.max(100, SEARCH_TOO_LONG),

  page: yup
    .number()
    .positive("Page must be a positive number")
    .integer("Page must be an integer")
    .default(1),

  limit: yup
    .number()
    .positive("Limit must be a positive number")
    .integer("Limit must be an integer")
    .max(100, "Limit must not exceed 100")
    .default(10),
});

/**
 * Validates and transforms the route parameter to a valid positive integer
 * The .transform() ensures proper integer parsing from string
 */
export const postIdParamSchema = yup
  .number()
  .required("Post ID is required")
  .transform((value, originalValue) => {
    // Transform string to number if valid
    if (typeof originalValue === "string") {
      const num = parseInt(originalValue, 10);
      return !isNaN(num) ? num : NaN;
    }
    return originalValue;
  })
  .integer("Post ID must be an integer")
  .positive("Post ID must be a positive number")
  .typeError("Post ID must be a valid number");
