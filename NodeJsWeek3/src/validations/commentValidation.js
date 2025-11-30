import Joi from "joi";

const idParamSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    "number.base": "Comment ID must be a number",
    "number.integer": "Comment ID must be an integer",
    "number.positive": "Comment ID must be a positive number",
    "any.required": "Comment ID is required",
  }),
});

export const createCommentSchema = Joi.object({
  body: Joi.string().min(1).required().messages({
    "string.min": "Comment body must not be empty",
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
}).or("postId", "parentId").messages({
  "object.missing": "Either postId or parentId is required",
});

export const updateCommentSchema = Joi.object({
  body: Joi.string().min(1).required().messages({
    "string.min": "Comment body must not be empty",
    "any.required": "Comment body is required",
  }),
});

export const listCommentsQuerySchema = Joi.object({
  postId: Joi.number().integer().positive().optional().messages({
    "number.base": "Post ID must be a number",
    "number.integer": "Post ID must be an integer",
    "number.positive": "Post ID must be a positive number",
  }),
});

export const commentIdParamSchema = idParamSchema;

