import Joi, { ObjectSchema } from "joi";
import { idParamSchema } from "./commonSchemas.js";
import type {
  CreateCommentInput,
  UpdateCommentInput,
  ListCommentsQuery,
} from "../interfaces/commentInterface.js";

/**
 * Create comment schema
 * Validates data for creating a new comment or reply
 * Either postId or parentId must be provided
 */
export const createCommentSchema: ObjectSchema<CreateCommentInput> = Joi.object({
  body: Joi.string()
    .trim()
    .min(1)
    .max(2000)
    .pattern(/^[^<>]*$/)
    .required()
    .messages({
      "string.min": "Comment body must not be empty",
      "string.max": "Comment body must not exceed 2000 characters",
      "string.pattern.base": "Comment body contains invalid characters",
      "any.required": "Comment body is required",
    }),
  postId: Joi.number().integer().positive().optional().messages({
    "number.base": "Post ID must be a number",
    "number.integer": "Post ID must be an integer",
    "number.positive": "Post ID must be a positive number",
  }),
  parentId: Joi.number().integer().positive().optional().messages({
    "number.base": "Parent ID must be a number",
    "number.integer": "Parent ID must be an integer",
    "number.positive": "Parent ID must be a positive number",
  }),
})
  .or("postId", "parentId")
  .messages({
    "object.missing": "Either postId or parentId is required",
  });

/**
 * Update comment schema
 * Validates data for updating an existing comment
 */
export const updateCommentSchema: ObjectSchema<UpdateCommentInput> = Joi.object({
  body: Joi.string()
    .trim()
    .min(1)
    .max(2000)
    .pattern(/^[^<>]*$/)
    .required()
    .messages({
      "string.min": "Comment body must not be empty",
      "string.max": "Comment body must not exceed 2000 characters",
      "string.pattern.base": "Comment body contains invalid characters",
      "any.required": "Comment body is required",
    }),
});

/**
 * List comments query schema
 * Validates query parameters for listing comments
 */
export const listCommentsQuerySchema: ObjectSchema<ListCommentsQuery> =
  Joi.object({
    postId: Joi.number().integer().positive().optional().messages({
      "number.base": "Post ID must be a number",
      "number.integer": "Post ID must be an integer",
      "number.positive": "Post ID must be a positive number",
    }),
  });

/**
 * Comment ID parameter schema
 * Validates comment ID parameter in route
 */
export const commentIdParamSchema = idParamSchema("Comment ID");

// Re-export interfaces for backward compatibility
export type {
  CreateCommentInput,
  UpdateCommentInput,
  ListCommentsQuery,
};

