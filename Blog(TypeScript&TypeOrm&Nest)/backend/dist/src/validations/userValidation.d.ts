import Joi, { ObjectSchema } from "joi";
import type { UpdateUserInput, ListUsersQuery, GetUserPostsQuery } from "../interfaces/userInterface.js";
/**
 * Get user posts query schema
 * Pagination with optional search functionality
 * Used for fetching a user's posts with search capability
 */
export declare const getUserPostsQuerySchema: ObjectSchema<GetUserPostsQuery>;
/**
 * List users query schema
 * Pagination parameters for listing users
 */
export declare const listUsersQuerySchema: ObjectSchema<ListUsersQuery>;
/**
 * Update user schema
 * Validates data for updating an existing user
 * All fields are optional (partial update)
 * Simplified validation - "at least one field" check handled in controller
 */
export declare const updateUserSchema: ObjectSchema<UpdateUserInput>;
/**
 * User ID parameter schema
 * Validates user ID parameter in route
 */
export declare const userIdParamSchema: Joi.ObjectSchema<{
    id: number;
}>;
export type { UpdateUserInput, ListUsersQuery, GetUserPostsQuery, };
//# sourceMappingURL=userValidation.d.ts.map