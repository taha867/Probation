import Joi, { ObjectSchema } from "joi";
import type { CreateCommentInput, UpdateCommentInput, ListCommentsQuery } from "../interfaces/commentInterface.js";
/**
 * Create comment schema
 * Validates data for creating a new comment or reply
 * Either postId or parentId must be provided
 */
export declare const createCommentSchema: ObjectSchema<CreateCommentInput>;
/**
 * Update comment schema
 * Validates data for updating an existing comment
 */
export declare const updateCommentSchema: ObjectSchema<UpdateCommentInput>;
/**
 * List comments query schema
 * Validates query parameters for listing comments
 */
export declare const listCommentsQuerySchema: ObjectSchema<ListCommentsQuery>;
/**
 * Comment ID parameter schema
 * Validates comment ID parameter in route
 */
export declare const commentIdParamSchema: Joi.ObjectSchema<{
    id: number;
}>;
export type { CreateCommentInput, UpdateCommentInput, ListCommentsQuery, };
//# sourceMappingURL=commentValidation.d.ts.map