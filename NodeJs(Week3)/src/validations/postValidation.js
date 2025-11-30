import Joi from "joi";

const idParamSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    "number.base": "Post ID must be a number",
    "number.integer": "Post ID must be an integer",
    "number.positive": "Post ID must be a positive number",
    "any.required": "Post ID is required",
  }),
});

export const postIdParamForCommentsSchema = Joi.object({
  postId: Joi.number().integer().positive().required().messages({
    "number.base": "Post ID must be a number",
    "number.integer": "Post ID must be an integer",
    "number.positive": "Post ID must be a positive number",
    "any.required": "Post ID is required",
  }),
});

const paginationQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).optional().default(1).messages({
    "number.base": "Page must be a number",
    "number.integer": "Page must be an integer",
    "number.min": "Page must be at least 1",
  }),
  limit: Joi.number().integer().min(1).max(100).optional().default(10).messages({
    "number.base": "Limit must be a number",
    "number.integer": "Limit must be an integer",
    "number.min": "Limit must be at least 1",
    "number.max": "Limit must not exceed 100",
  }),
  search: Joi.string().optional().messages({
    "string.base": "Search must be a string",
  }),
  userId: Joi.number().integer().positive().optional().messages({
    "number.base": "User ID must be a number",
    "number.integer": "User ID must be an integer",
    "number.positive": "User ID must be a positive number",
  }),
});

export const createPostSchema = Joi.object({
  title: Joi.string().min(1).max(200).required().messages({
    "string.min": "Title must not be empty",
    "string.max": "Title must not exceed 200 characters",
    "any.required": "Title is required",
  }),
  body: Joi.string().min(1).required().messages({
    "string.min": "Body must not be empty",
    "any.required": "Body is required",
  }),
  status: Joi.string().valid("draft", "published").optional().default("draft").messages({
    "any.only": "Status must be either 'draft' or 'published'",
  }),
});

export const updatePostSchema = Joi.object({
  title: Joi.string().min(1).max(200).optional().messages({
    "string.min": "Title must not be empty",
    "string.max": "Title must not exceed 200 characters",
  }),
  body: Joi.string().min(1).optional().messages({
    "string.min": "Body must not be empty",
  }),
  status: Joi.string().valid("draft", "published").optional().messages({
    "any.only": "Status must be either 'draft' or 'published'",
  }),
}).min(1).messages({
  "object.min": "At least one field must be provided to update",
});

export const listPostsQuerySchema = paginationQuerySchema;

export const postIdParamSchema = idParamSchema;


