import Joi, { ObjectSchema } from "joi";
import type { CreatePostInput, UpdatePostInput, ListPostsQuery } from "../interfaces/postInterface.js";
/**
 * Post ID parameter schema for comments endpoint
 * Validates postId parameter in route
 */
export declare const postIdParamForCommentsSchema: ObjectSchema<{
    postId: number;
}>;
/**
 * Create post schema
 * Validates data for creating a new post
 */
export declare const createPostSchema: ObjectSchema<CreatePostInput>;
/**
 * Update post schema
 * Validates data for updating an existing post
 * All fields are optional (partial update)
 */
export declare const updatePostSchema: ObjectSchema<UpdatePostInput>;
/**
 * List posts query schema
 * Validates query parameters for listing posts
 */
export declare const listPostsQuerySchema: ObjectSchema<ListPostsQuery>;
/**
 * Post ID parameter schema
 * Validates post ID parameter in route
 */
export declare const postIdParamSchema: Joi.ObjectSchema<{
    id: number;
}>;
export type { CreatePostInput, UpdatePostInput, ListPostsQuery };
//# sourceMappingURL=postValidation.d.ts.map