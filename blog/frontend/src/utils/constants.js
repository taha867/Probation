import { StatusCodes } from "http-status-codes";

export const HTTP_STATUS = StatusCodes;

export const AUTH_ACTIONS = {
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  SIGNUP_SUCCESS: "SIGNUP_SUCCESS",
  AUTH_ERROR: "AUTH_ERROR",
  LOGOUT: "LOGOUT",
  SET_USER_FROM_TOKEN: "SET_USER_FROM_TOKEN",
  CLEAR_MESSAGES: "CLEAR_MESSAGES",
  FORGOT_PASSWORD_SUCCESS: "FORGOT_PASSWORD_SUCCESS",
  RESET_PASSWORD_SUCCESS: "RESET_PASSWORD_SUCCESS",
};

// AUTH_STATUS removed - replaced by useTransition's isPending

export const STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  REFRESH_TOKEN: "refresh_token",
};

export const VALIDATION_MESSAGES = {
  // Required field messages
  REQUIRED_FIELD: "This field is required",
  EMAIL_REQUIRED: "Email is required",
  PASSWORD_REQUIRED: "Password is required",
  NAME_REQUIRED: "Full name is required",
  PHONE_REQUIRED: "Phone number is required",
  CONFIRM_PASSWORD_REQUIRED: "Please confirm your password",
  COMMENT_REQUIRED: "Comment is required",

  // Format validation messages
  INVALID_EMAIL: "Please enter a valid email address",
  INVALID_PHONE: "Please enter a valid phone number",

  // Length validation messages
  NAME_TOO_SHORT: "Name must be at least 2 characters",
  NAME_TOO_LONG: "Name must not exceed 50 characters",
  PASSWORD_TOO_SHORT: "Password must be at least 8 characters",
  PASSWORD_TOO_LONG: "Password must not exceed 128 characters",

  // Password strength messages
  PASSWORD_WEAK:
    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
  PASSWORDS_DONT_MATCH: "Passwords do not match",

  // Phone validation messages
  PHONE_TOO_SHORT: "Phone number must be at least 10 digits",
  PHONE_TOO_LONG: "Phone number must not exceed 15 digits",

  // Email validation messages
  EMAIL_TOO_LONG: "Email must not exceed 254 characters",

  // Comment validation messages
  COMMENT_TOO_SHORT: "Comment cannot be empty",
  COMMENT_TOO_LONG: "Comment must not exceed 2000 characters",
};

// Toast Messages
export const TOAST_MESSAGES = {
  // Loading messages
  SIGNING_IN: "Signing you in...",
  SIGNING_OUT: "Signing you out...",
  CREATING_ACCOUNT: "Creating your account...",
  SENDING_RESET_LINK: "Sending reset link...",
  RESETTING_PASSWORD: "Resetting your password...",
  CREATING_POST: "Creating post...",
  UPDATING_POST: "Updating post...",
  DELETING_POST: "Deleting post...",
  LOADING_POSTS: "Loading posts...",

  // Success messages
  WELCOME_BACK: "Welcome back! ",
  SIGNED_OUT_SUCCESS: "Signed out successfully! ",
  ACCOUNT_CREATED_SUCCESS: "Account created successfully!  Please sign in.",
  RESET_LINK_SENT: "Password reset link sent! Check your email.",
  PASSWORD_RESET_SUCCESS:
    "Password reset successfully! Please sign in with your new password.",
  PASSWORD_CHANGED_SUCCESS: "Password changed successfully!",
  TOKEN_REFRESHED: "Token refreshed successfully",
  POST_CREATED_SUCCESS: "Post created successfully!",
  POST_UPDATED_SUCCESS: "Post updated successfully!",
  POST_DELETED_SUCCESS: "Post deleted successfully!",

  // Error messages
  INVALID_CREDENTIALS: "Invalid credentials. Please try again.",
  ACCOUNT_CREATION_FAILED: "Failed to create account. Please try again.",
  RESET_EMAIL_FAILED: "Failed to send reset email. Please try again.",
  SIGNOUT_ERROR: "Error signing out, but you've been logged out locally.",
  NETWORK_ERROR: "Network error. Please check your connection.",
  REQUEST_CONFIG_ERROR: "Request configuration error",
  SESSION_EXPIRED: "Session expired. Please login again.",
  TOKEN_REFRESH_FAILED: "Token refresh failed",
  BACKEND_LOGOUT_FAILED: "Backend logout failed",
  POST_CREATE_FAILED: "Failed to create post. Please try again.",
  POST_UPDATE_FAILED: "Failed to update post. Please try again.",
  POST_DELETE_FAILED: "Failed to delete post. Please try again.",
  POST_FETCH_FAILED: "Failed to fetch posts. Please try again.",

  // Console messages
  TOKEN_DECODE_ERROR: "Token decode error:",
  REFRESH_TOKEN_DECODE_ERROR: "Refresh token decode error:",
  SIGNOUT_ERROR_CONSOLE: "Signout error:",
  RESET_PASSWORD_ERROR: "Reset password error:",
  ACCESS_TOKEN_EXPIRED: "Access token expired, attempting to refresh...",
  NO_REFRESH_TOKEN: "No valid refresh token available, logging out...",
  INIT_TOKEN_REFRESH_SUCCESS:
    "Token refreshed successfully during app initialization",
  INIT_TOKEN_REFRESH_FAILED: "Token refresh failed during app initialization",
  VALIDATION_ERROR: "Validation error",
  INTERNAL_SERVER_ERROR: "Internal server error",

  // GitHub OAuth
  GITHUB_OAUTH_COMING_SOON: "GitHub OAuth coming soon! ",
};

// Posts Actions Constants - Essential data-only actions
export const POSTS_ACTIONS = {
  // Essential data actions only
  SET_POSTS: "SET_POSTS",
  SET_PAGINATION: "SET_PAGINATION",
  ADD_POST: "ADD_POST",
  UPDATE_POST: "UPDATE_POST",
  DELETE_POST: "DELETE_POST",
};

// Post Status Constants
export const POST_STATUS = {
  DRAFT: "draft",
  PUBLISHED: "published",
};

// Pagination Constants
export const COMMENTS_PER_PAGE = 10;
export const POSTS_PER_PAGE = 3;

// Post Tab Constants - REMOVED: No longer using tabs, separate pages instead

// Default error messages for auth operations
export const AUTH_ERROR_MESSAGES = {
  INVALID_CREDENTIALS: "Invalid credentials",
  UNABLE_TO_CREATE_ACCOUNT: "Unable to create account",
  FAILED_TO_SEND_RESET_EMAIL: "Failed to send reset email",
  FAILED_TO_RESET_PASSWORD: "Failed to reset password",
};
