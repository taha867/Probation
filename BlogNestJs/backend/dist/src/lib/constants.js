"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SANITIZATION_PATTERNS = exports.VALIDATION_PATTERNS = exports.USER_STATUS = exports.SECURITY = exports.VALIDATION_LIMITS = exports.DEFAULTS = exports.EMAIL_TEMPLATES = exports.LOG_MESSAGES = exports.VALIDATION_MESSAGES = exports.ERROR_MESSAGES = exports.SUCCESS_MESSAGES = exports.HTTP_STATUS = void 0;
const http_status_codes_1 = require("http-status-codes");
// HTTP Status Codes
exports.HTTP_STATUS = http_status_codes_1.StatusCodes;
exports.SUCCESS_MESSAGES = {
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
};
exports.ERROR_MESSAGES = {
    // Authentication Errors
    INVALID_CREDENTIALS: 'Invalid credentials',
    ACCESS_TOKEN_REQUIRED: 'Access token is required',
    INVALID_TOKEN: 'Invalid token',
    AUTHENTICATION_FAILED: 'Authentication failed',
    PASSWORD_EMAIL_OR_PHONE_REQUIRED: 'Please provide your password and either email or phone number',
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
};
exports.VALIDATION_MESSAGES = {
    // Common
    IS_EMAIL: 'must be a valid email address',
    // User validation
    NAME_REQUIRED: 'Name is required',
    NAME_MIN_LENGTH: 'Name must be at least 2 characters long',
    NAME_INVALID_CHARS: 'Name must contain only letters and spaces',
    EMAIL_REQUIRED: 'Email is required',
    EMAIL_INVALID: 'Please provide a valid email address',
    PHONE_REQUIRED: 'Phone number is required',
    PHONE_INVALID_FORMAT: 'Phone number must be 10 to 15 digits (e.g., +1234567890)',
    PASSWORD_REQUIRED: 'Password is required',
    PASSWORD_MIN_LENGTH: 'Password must be at least 8 characters long',
    IMAGE_INVALID_URL: 'Image must be a valid URL',
    // Post validation
    TITLE_REQUIRED: 'Post title is required',
    TITLE_MIN_LENGTH: 'Post title must be at least 1 character long',
    TITLE_MAX_LENGTH: 'Post title must not exceed 200 characters',
    TITLE_INVALID_CHARS: 'Title contains invalid characters (HTML tags are not allowed)',
    BODY_REQUIRED: 'Post body is required',
    BODY_MIN_LENGTH: 'Post body must be at least 1 character long',
    BODY_INVALID_CHARS: 'Body contains invalid characters (HTML tags are not allowed)',
    STATUS_INVALID: 'Post status must be either "draft" or "published"',
    // Comment validation
    COMMENT_BODY_REQUIRED: 'Comment body is required',
    COMMENT_BODY_MIN_LENGTH: 'Comment body must be at least 1 character long',
    COMMENT_BODY_MAX_LENGTH: 'Comment body must not exceed 2000 characters',
    COMMENT_BODY_INVALID_CHARS: 'Comment body contains invalid characters (HTML tags are not allowed)',
    POST_ID_REQUIRED: 'Post ID is required',
    POST_ID_INVALID: 'Post ID must be a positive integer',
    PARENT_ID_INVALID: 'Parent comment ID must be a positive integer',
    // Pagination validation
    PAGE_INVALID: 'Page number must be at least 1',
    LIMIT_MIN_INVALID: 'Limit must be at least 1',
    LIMIT_MAX_INVALID: 'Limit must not exceed 100',
    // Cloudinary validation
    FOLDER_INVALID_CHARS: 'folder must contain only alphanumeric characters, slashes, underscores, and hyphens',
    ORIGINAL_NAME_INVALID_CHARS: 'originalName must contain only alphanumeric characters, dots, underscores, and hyphens',
    RESULT_INVALID_VALUE: 'result must be either "ok" or "not found"',
};
exports.LOG_MESSAGES = {
    // Application
    APP_RUNNING: 'Application is running on:',
    // Email
    EMAIL_TRANSPORTER_INIT_SUCCESS: 'Email transporter initialized successfully',
    EMAIL_TRANSPORTER_INIT_FAILED: 'Failed to initialize email transporter',
    EMAIL_ENV_VARS_MISSING: 'Missing required email environment variables:',
    EMAIL_TRANSPORTER_NOT_INIT: 'Email transporter not initialized - check environment variables',
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
};
exports.EMAIL_TEMPLATES = {
    APP_NAME: 'Blog App',
    RESET_PASSWORD_SUBJECT: 'Reset Your Password - Blog App',
    RESET_PASSWORD_TITLE: 'Reset Your Password',
    RESET_PASSWORD_GREETING: 'Hello',
    RESET_PASSWORD_INTRO: 'You requested to reset your password. Click the button below to set a new password.',
    RESET_PASSWORD_BUTTON: 'Reset My Password',
    RESET_PASSWORD_WARNING: '⚠️ Important:',
    RESET_PASSWORD_EXPIRY: 'This link will expire in',
    RESET_PASSWORD_EXPIRY_TIME: '1 hour',
    RESET_PASSWORD_FALLBACK: "If the button doesn't work, copy and paste this link into your browser:",
    RESET_PASSWORD_IGNORE: 'If you did not request this password reset, you can safely ignore this email.',
    RESET_PASSWORD_CLOSING: 'Best regards,',
    RESET_PASSWORD_TEAM: 'Blog App Team',
    RESET_PASSWORD_AUTO: 'This is an automated email. Please do not reply.',
    RESET_PASSWORD_TEXT_INTRO: 'You requested to reset your password. Click the link below to reset it:',
    RESET_PASSWORD_TEXT_EXPIRY: 'This link will expire in 1 hour.',
    RESET_PASSWORD_TEXT_IGNORE: "If you didn't request this, please ignore this email.",
};
/**
 * Default values
 */
exports.DEFAULTS = {
    USER_NAME: 'User',
    CLOUDINARY_FOLDER: 'blog',
    CLOUDINARY_IMAGE_NAME: 'image',
    CLOUDINARY_POSTS_FOLDER: 'blog/posts',
    CLOUDINARY_POST_IMAGE_NAME: 'post-image',
    CLOUDINARY_USERS_FOLDER: 'blog/users',
    CLOUDINARY_PROFILE_IMAGE_NAME: 'profile-image',
    PAGINATION_PAGE: 1, // Default page number
    PAGINATION_LIMIT: 10, // Default items per page
    USERS_LIST_LIMIT: 20, // Default limit for users list
};
/**
 * Validation limits
 */
exports.VALIDATION_LIMITS = {
    NAME_MIN_LENGTH: 2, // Minimum name length
    PASSWORD_MIN_LENGTH: 8, // Minimum password length
    PAGE_MIN: 1, // Minimum page number
    LIMIT_MIN: 1, // Minimum items per page
    LIMIT_MAX: 100, // Maximum items per page
};
/**
 * Security/Encryption constants
 */
exports.SECURITY = {
    SALT_ROUNDS: 10,
};
/**
 * User status values
 */
exports.USER_STATUS = {
    LOGGED_IN: 'logged in',
    LOGGED_OUT: 'logged out',
}; // immutable
/**
 * Validation regex patterns
 */
exports.VALIDATION_PATTERNS = {
    FOLDER: /^[a-zA-Z0-9/_-]+$/, //blog/post
    ORIGINAL_NAME: /^[a-zA-Z0-9._-]+$/, // profile.jpg
    NO_HTML_TAGS: /^[^<>]*$/, // Prevents HTML tags (< and > characters)
    NAME: /^[A-Za-z\s]+$/, // Name: letters and spaces only
    PHONE: /^\+?[0-9]{10,15}$/, // Phone: 10-15 digits, optional +
};
/**
 * Sanitization regex patterns (for removing invalid characters)
 */
exports.SANITIZATION_PATTERNS = {
    FOLDER: /[^a-zA-Z0-9/_-]/g, // Remove invalid chars from folder path
    ORIGINAL_NAME: /[^a-zA-Z0-9._-]/g, // Remove invalid chars from filename
    PUBLIC_ID_EXTRACT: /\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/, // Extract public_id from URL
    BLOG_PREFIX_REMOVE: /^blog\//, // Remove blog/ prefix from public_id
};
//# sourceMappingURL=constants.js.map