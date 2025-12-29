
import * as yup from "yup";
import { POST_STATUS } from "../utils/constants";

/**
 * Create/Update Post Form Validation Schema
 */
export const postSchema = yup.object({
  title: yup
    .string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must not exceed 200 characters")
    .trim(),

  body: yup
    .string()
    .required("Content is required")
    .min(10, "Content must be at least 10 characters")
    .max(10000, "Content must not exceed 10,000 characters")
    .trim(),

  status: yup
    .string()
    .oneOf(
      [POST_STATUS.DRAFT, POST_STATUS.PUBLISHED],
      "Status must be either draft or published",
    )
    .default(POST_STATUS.DRAFT),

  // Image can be an object with {image: url, imagePublicId: id} (Cloudinary upload result)
  // or string (existing URL) or null
  image: yup
    .mixed()
    .nullable()
    .optional()
    .test(
      "image-format",
      "Image must be a valid Cloudinary upload result or URL",
      (value) => {
        if (!value) return true; // Optional field
        if (typeof value === "object" && value.image && value.imagePublicId) {
          // Cloudinary upload result - validate URL format
          return typeof value.image === "string" && value.image.length > 0;
        }
        if (typeof value === "string") {
          // Existing image URL - just validate it's not empty
          return value.length > 0;
        }
        return false;
      }
    ),
});

/**
 * Search Posts Form Validation Schema
 */
export const searchPostsSchema = yup.object({
  search: yup
    .string()
    .max(100, "Search query must not exceed 100 characters")
    .trim(),

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
