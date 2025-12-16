/**
 * Yup validation schemas for post forms
 */
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
