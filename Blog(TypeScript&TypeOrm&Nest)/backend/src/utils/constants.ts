import { StatusCodes } from "http-status-codes";


/*TypeScript sees:
{  
    readonly ACCOUNT_CREATED: "Account created successfully";
}
Immutable, Literal types,Type-safe, Better autocomplete
*/

// HTTP Status Codes
export const HTTP_STATUS = StatusCodes;

/**
 * Success messages for API responses
 */
export const SUCCESS_MESSAGES = {
  ACCOUNT_CREATED: "Account created successfully",
  SIGNED_IN: "Signed in successfully",
  LOGGED_OUT: "Logged out successfully",
  USER_UPDATED: "User updated successfully",
  USER_DELETED: "User account deleted successfully",
  POST_CREATED: "Post created successfully",
  POST_UPDATED: "Post updated successfully",
  POST_DELETED: "Post deleted successfully",
  COMMENT_CREATED: "Comment created successfully",
  COMMENT_UPDATED: "Comment updated successfully",
  COMMENT_DELETED: "Comment deleted successfully",
  RESET_TOKEN_SENT: "Password reset token has been sent to your email",
  PASSWORD_RESET: "Password has been reset successfully",
  TOKEN_REFRESHED: "Access token refreshed successfully",
} as const;

/**
 * Error messages for API responses
 */
export const ERROR_MESSAGES = {
  // Authentication Errors
  INVALID_CREDENTIALS: "Invalid credentials",
  ACCESS_TOKEN_REQUIRED: "Access token is required",
  INVALID_TOKEN: "Invalid token",
  INVALID_TOKEN_USER_NOT_FOUND: "Invalid token - user not found",
  TOKEN_EXPIRED: "Token expired",
  AUTHENTICATION_FAILED: "Authentication failed",
  PASSWORD_EMAIL_OR_PHONE_REQUIRED:
    "Please provide your password and either email or phone number",
  EMAIL_REQUIRED: "Email is required",
  RESET_TOKEN_REQUIRED: "Reset token is required",
  NEW_PASSWORD_REQUIRED: "New password is required",
  INVALID_RESET_TOKEN: "Invalid or expired reset token",
  RESET_TOKEN_EXPIRED: "Reset token has expired. Please request a new one",
  PASSWORD_MISSMATCH: "your password doesnot match with confirm password",
  REFRESH_TOKEN_REQUIRED: "Refresh token is required",
  INVALID_REFRESH_TOKEN: "Invalid or expired refresh token",
  REFRESH_TOKEN_EXPIRED: "Refresh token has expired. Please login again",
  ACCESS_TOKEN_EXPIRED: "Access token has expired. Please refresh your token",
  EMAIL_SEND_FAILED: "Failed to send email. Please try again later",

  // User Errors
  USER_NOT_FOUND: "User not found",
  USER_ALREADY_EXISTS: "User with that email or phone already exists",
  EMAIL_ALREADY_EXISTS: "Email already exists for another user",
  PHONE_ALREADY_EXISTS: "Phone number already exists for another user",
  INVALID_USER_ID: "Invalid user id",
  CANNOT_UPDATE_OTHER_USER: "You can only update your own profile",
  CANNOT_DELETE_OTHER_USER: "You can only delete your own account",
  NO_FIELDS_TO_UPDATE: "No fields provided to update",
  UNABLE_TO_FETCH_USERS: "Unable to fetch users at this time",
  UNABLE_TO_FETCH_USER_POSTS: "Unable to fetch posts for this user",
  UNABLE_TO_UPDATE_USER: "Unable to update user at this time",
  UNABLE_TO_DELETE_USER: "Unable to delete user at this time",
  UNABLE_TO_FETCH_CURRENT_USER: "Unable to fetch current user",

  // Post Errors
  POST_NOT_FOUND: "Post not found",
  INVALID_POST_ID: "Invalid post id",
  TITLE_BODY_REQUIRED: "title and body are required fields",
  CANNOT_UPDATE_OTHER_POST: "You can only update your own posts",
  CANNOT_DELETE_OTHER_POST: "You can only delete your own posts",
  UNABLE_TO_CREATE_POST: "Unable to create post at this time",
  UNABLE_TO_FETCH_POSTS: "Unable to fetch posts at this time",
  UNABLE_TO_FETCH_POST: "Unable to fetch the requested post",
  UNABLE_TO_UPDATE_POST: "Unable to update the requested post",
  UNABLE_TO_DELETE_POST: "Unable to delete the requested post",
  UNABLE_TO_FETCH_POST_COMMENTS: "Unable to fetch comments for this post",

  // Comment Errors
  COMMENT_NOT_FOUND: "Comment not found",
  PARENT_COMMENT_NOT_FOUND: "Parent comment not found",
  BODY_POST_ID_OR_PARENT_ID_REQUIRED:
    "body and either postId or parentId are required fields",
  BODY_REQUIRED: "body is required",
  CANNOT_UPDATE_OTHER_COMMENT: "You can only update your own comments",
  CANNOT_DELETE_OTHER_COMMENT: "You can only delete your own comments",
  UNABLE_TO_CREATE_COMMENT: "Unable to create comment at this time",
  UNABLE_TO_FETCH_COMMENTS: "Unable to fetch comments at this time",
  UNABLE_TO_FETCH_COMMENT: "Unable to fetch the requested comment",
  UNABLE_TO_UPDATE_COMMENT: "Unable to update the requested comment",
  UNABLE_TO_DELETE_COMMENT: "Unable to delete the requested comment",

  // Validation Errors
  VALIDATION_ERROR: "Validation error",

  // General Errors
  OPERATION_FAILED:
    "Could not perform operation at this time, kindly try again later.",
  TOO_MANY_REQUESTS: "Too many requests, please try again later",
  ROUTE_NOT_FOUND: "Route not found",
} as const;

/**
 * User status values
 */
export const USER_STATUS = {
  LOGGED_IN: "logged in",
  LOGGED_OUT: "logged out",
} as const;

