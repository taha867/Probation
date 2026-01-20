import { StatusCodes } from 'http-status-codes';

// HTTP Status Codes
export const HTTP_STATUS = StatusCodes;

/**
 * Success messages for API responses
 */
export const SUCCESS_MESSAGES = {
  ACCOUNT_CREATED: 'Account created successfully',
  SIGNED_IN: 'Signed in successfully',
  LOGGED_OUT: 'Logged out successfully',
  USER_UPDATED: 'User updated successfully',
  USER_DELETED: 'User account deleted successfully',
  POST_CREATED: 'Post created successfully',
  POST_UPDATED: 'Post updated successfully',
  POST_DELETED: 'Post deleted successfully',
  COMMENT_CREATED: 'Comment created successfully',
  COMMENT_UPDATED: 'Comment updated successfully',
  COMMENT_DELETED: 'Comment deleted successfully',
  RESET_TOKEN_SENT: 'Password reset token has been sent to your email',
  PASSWORD_RESET: 'Password has been reset successfully',
  TOKEN_REFRESHED: 'Access token refreshed successfully',
} as const;

/**
 * Error messages for API responses
 */
export const ERROR_MESSAGES = {
  // Authentication Errors
  INVALID_CREDENTIALS: 'Invalid credentials',
  ACCESS_TOKEN_REQUIRED: 'Access token is required',
  INVALID_TOKEN: 'Invalid token',
  AUTHENTICATION_FAILED: 'Authentication failed',
  PASSWORD_EMAIL_OR_PHONE_REQUIRED:
    'Please provide your password and either email or phone number',
  INVALID_RESET_TOKEN: 'Invalid or expired reset token',
  RESET_TOKEN_EXPIRED: 'Reset token has expired. Please request a new one',
  PASSWORD_MISSMATCH: 'your password doesnot match with confirm password',
  INVALID_REFRESH_TOKEN: 'Invalid or expired refresh token',
  REFRESH_TOKEN_EXPIRED: 'Refresh token has expired. Please login again',
  ACCESS_TOKEN_EXPIRED: 'Access token has expired. Please refresh your token',
  EMAIL_SEND_FAILED: 'Failed to send email. Please try again later',
  PASSWORD_RESET_FAILED: 'Password reset failed',
  USER_ALREADY_EXISTS: 'User with that email or phone already exists',

  // User Errors
  USER_NOT_FOUND: 'User not found',
  EMAIL_ALREADY_EXISTS: 'Email already exists for another user',
  PHONE_ALREADY_EXISTS: 'Phone number already exists for another user',
  CANNOT_UPDATE_OTHER_USER: 'You can only update your own profile',
  CANNOT_DELETE_OTHER_USER: 'You can only delete your own account',
  USER_UPDATE_FAILED: 'Unable to update user at this time',
  AT_LEAST_ONE_FIELD_REQUIRED: 'At least one field must be provided to update',

  // Post Errors
  POST_NOT_FOUND: 'Post not found',
  CANNOT_UPDATE_OTHER_POST: 'You can only update your own posts',
  CANNOT_DELETE_OTHER_POST: 'You can only delete your own posts',
  POST_CREATION_FAILED: 'Unable to create post at this time',
  POST_UPDATE_FAILED: 'Unable to update the requested post',

  // Comment Errors
  COMMENT_NOT_FOUND: 'Comment not found',
  PARENT_COMMENT_NOT_FOUND: 'Parent comment not found',
  CANNOT_UPDATE_OTHER_COMMENT: 'You can only update your own comments',
  CANNOT_DELETE_OTHER_COMMENT: 'You can only delete your own comments',
  COMMENT_CREATION_FAILED: 'Unable to create comment at this time',
  COMMENT_UPDATE_FAILED: 'Unable to update the requested comment',
  POST_ID_REQUIRED: 'Post ID is required',
  EITHER_POST_ID_OR_PARENT_ID_REQUIRED: 'Either postId or parentId is required',

  // General Errors
  INTERNAL_SERVER_ERROR: 'Internal server error',
} as const;

/**
 * Validation messages for DTOs
 */
export const VALIDATION_MESSAGES = {
  // Common
  IS_STRING: 'must be a string',
  IS_REQUIRED: 'is required',
  IS_EMAIL: 'must be a valid email address',
  IS_BOOLEAN: 'must be a boolean',
  IS_URL: 'must be a valid URL with protocol',

  // User validation
  NAME_INVALID_CHARS: 'Name must contain only letters and spaces',
  PHONE_INVALID_FORMAT: 'Phone number must be 10 to 15 digits',

  // Post validation
  TITLE_INVALID_CHARS: 'Title contains invalid characters',
  BODY_INVALID_CHARS: 'Body contains invalid characters',

  // Comment validation
  COMMENT_BODY_INVALID_CHARS: 'Comment body contains invalid characters',

  // Cloudinary validation
  FOLDER_INVALID_CHARS:
    'folder must contain only alphanumeric characters, slashes, underscores, and hyphens',
  ORIGINAL_NAME_INVALID_CHARS:
    'originalName must contain only alphanumeric characters, dots, underscores, and hyphens',
  RESULT_INVALID_VALUE: 'result must be either "ok" or "not found"',
} as const;

/**
 * Console/Log messages
 */
export const LOG_MESSAGES = {
  // Application
  APP_RUNNING: 'Application is running on:',

  // Email
  EMAIL_TRANSPORTER_INIT_SUCCESS: 'Email transporter initialized successfully',
  EMAIL_TRANSPORTER_INIT_FAILED: 'Failed to initialize email transporter',
  EMAIL_ENV_VARS_MISSING: 'Missing required email environment variables:',
  EMAIL_TRANSPORTER_NOT_INIT:
    'Email transporter not initialized - check environment variables',
  EMAIL_SENT_SUCCESS: 'Password reset email sent successfully:',
  EMAIL_SEND_ERROR: 'Detailed email error:',

  // Cloudinary
  CLOUDINARY_DELETE_ERROR: 'Error deleting image from Cloudinary:',
  CLOUDINARY_UPLOAD_ERROR: 'Cloudinary upload error:',
  CLOUDINARY_UPLOAD_FAILED: 'Error uploading image to Cloudinary:',
  CLOUDINARY_EXTRACT_ERROR: 'Error extracting public_id from URL:',

  // General
  UNHANDLED_ERROR: 'Unhandled error:',
  UPLOAD_NO_RESULT: 'Upload completed but no result returned',
} as const;

/**
 * Email template content
 */
export const EMAIL_TEMPLATES = {
  APP_NAME: 'Blog App',
  RESET_PASSWORD_SUBJECT: 'Reset Your Password - Blog App',
  RESET_PASSWORD_TITLE: 'Reset Your Password',
  RESET_PASSWORD_GREETING: 'Hello',
  RESET_PASSWORD_INTRO:
    'You requested to reset your password. Click the button below to set a new password.',
  RESET_PASSWORD_BUTTON: 'Reset My Password',
  RESET_PASSWORD_WARNING: '⚠️ Important:',
  RESET_PASSWORD_EXPIRY: 'This link will expire in',
  RESET_PASSWORD_EXPIRY_TIME: '1 hour',
  RESET_PASSWORD_FALLBACK:
    "If the button doesn't work, copy and paste this link into your browser:",
  RESET_PASSWORD_IGNORE:
    'If you did not request this password reset, you can safely ignore this email.',
  RESET_PASSWORD_CLOSING: 'Best regards,',
  RESET_PASSWORD_TEAM: 'Blog App Team',
  RESET_PASSWORD_AUTO: 'This is an automated email. Please do not reply.',
  RESET_PASSWORD_TEXT_INTRO:
    'You requested to reset your password. Click the link below to reset it:',
  RESET_PASSWORD_TEXT_EXPIRY: 'This link will expire in 1 hour.',
  RESET_PASSWORD_TEXT_IGNORE:
    "If you didn't request this, please ignore this email.",
} as const;

/**
 * Default values
 */
export const DEFAULTS = {
  USER_NAME: 'User',
  CLOUDINARY_FOLDER: 'blog',
  CLOUDINARY_IMAGE_NAME: 'image',
  CLOUDINARY_POSTS_FOLDER: 'blog/posts',
  CLOUDINARY_POST_IMAGE_NAME: 'post-image',
  CLOUDINARY_USERS_FOLDER: 'blog/users',
  CLOUDINARY_PROFILE_IMAGE_NAME: 'profile-image',
} as const;

/**
 * User status values
 */
export const USER_STATUS = {
  LOGGED_IN: 'logged in',
  LOGGED_OUT: 'logged out',
} as const;
