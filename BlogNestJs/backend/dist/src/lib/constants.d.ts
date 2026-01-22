import { StatusCodes } from "http-status-codes";
export declare const HTTP_STATUS: typeof StatusCodes;
export declare const SUCCESS_MESSAGES: {
    readonly ACCOUNT_CREATED: "Account created successfully";
    readonly SIGNED_IN: "Signed in successfully";
    readonly LOGGED_OUT: "Logged out successfully";
    readonly USER_UPDATED: "User updated successfully";
    readonly USER_DELETED: "User account deleted successfully";
    readonly POST_CREATED: "Post created successfully";
    readonly POST_UPDATED: "Post updated successfully";
    readonly POST_DELETED: "Post deleted successfully";
    readonly COMMENT_CREATED: "Comment created successfully";
    readonly COMMENT_UPDATED: "Comment updated successfully";
    readonly COMMENT_DELETED: "Comment deleted successfully";
    readonly RESET_TOKEN_SENT: "Password reset token has been sent to your email";
    readonly PASSWORD_RESET: "Password has been reset successfully";
    readonly TOKEN_REFRESHED: "Access token refreshed successfully";
};
export declare const ERROR_MESSAGES: {
    readonly INVALID_CREDENTIALS: "Invalid credentials";
    readonly ACCESS_TOKEN_REQUIRED: "Access token is required";
    readonly INVALID_TOKEN: "Invalid token";
    readonly AUTHENTICATION_FAILED: "Authentication failed";
    readonly PASSWORD_EMAIL_OR_PHONE_REQUIRED: "Please provide your password and either email or phone number";
    readonly INVALID_RESET_TOKEN: "Invalid or expired reset token";
    readonly RESET_TOKEN_EXPIRED: "Reset token has expired. Please request a new one";
    readonly PASSWORD_MISSMATCH: "your password doesnot match with confirm password";
    readonly INVALID_REFRESH_TOKEN: "Invalid or expired refresh token";
    readonly REFRESH_TOKEN_EXPIRED: "Refresh token has expired. Please login again";
    readonly ACCESS_TOKEN_EXPIRED: "Access token has expired. Please refresh your token";
    readonly EMAIL_SEND_FAILED: "Failed to send email. Please try again later";
    readonly PASSWORD_RESET_FAILED: "Password reset failed";
    readonly USER_ALREADY_EXISTS: "User with that email or phone already exists";
    readonly USER_NOT_FOUND: "User not found";
    readonly EMAIL_ALREADY_EXISTS: "Email already exists for another user";
    readonly PHONE_ALREADY_EXISTS: "Phone number already exists for another user";
    readonly CANNOT_UPDATE_OTHER_USER: "You can only update your own profile";
    readonly CANNOT_DELETE_OTHER_USER: "You can only delete your own account";
    readonly USER_UPDATE_FAILED: "Unable to update user at this time";
    readonly AT_LEAST_ONE_FIELD_REQUIRED: "At least one field must be provided to update";
    readonly POST_NOT_FOUND: "Post not found";
    readonly CANNOT_UPDATE_OTHER_POST: "You can only update your own posts";
    readonly CANNOT_DELETE_OTHER_POST: "You can only delete your own posts";
    readonly POST_CREATION_FAILED: "Unable to create post at this time";
    readonly POST_UPDATE_FAILED: "Unable to update the requested post";
    readonly COMMENT_NOT_FOUND: "Comment not found";
    readonly PARENT_COMMENT_NOT_FOUND: "Parent comment not found";
    readonly CANNOT_UPDATE_OTHER_COMMENT: "You can only update your own comments";
    readonly CANNOT_DELETE_OTHER_COMMENT: "You can only delete your own comments";
    readonly COMMENT_CREATION_FAILED: "Unable to create comment at this time";
    readonly COMMENT_UPDATE_FAILED: "Unable to update the requested comment";
    readonly POST_ID_REQUIRED: "Post ID is required";
    readonly EITHER_POST_ID_OR_PARENT_ID_REQUIRED: "Either postId or parentId is required";
    readonly INTERNAL_SERVER_ERROR: "Internal server error";
};
export declare const VALIDATION_MESSAGES: {
    readonly IS_EMAIL: "must be a valid email address";
    readonly NAME_REQUIRED: "Name is required";
    readonly NAME_MIN_LENGTH: "Name must be at least 2 characters long";
    readonly NAME_INVALID_CHARS: "Name must contain only letters and spaces";
    readonly EMAIL_REQUIRED: "Email is required";
    readonly EMAIL_INVALID: "Please provide a valid email address";
    readonly PHONE_REQUIRED: "Phone number is required";
    readonly PHONE_INVALID_FORMAT: "Phone number must be 10 to 15 digits (e.g., +1234567890)";
    readonly PASSWORD_REQUIRED: "Password is required";
    readonly PASSWORD_MIN_LENGTH: "Password must be at least 8 characters long";
    readonly IMAGE_INVALID_URL: "Image must be a valid URL";
    readonly TITLE_REQUIRED: "Post title is required";
    readonly TITLE_MIN_LENGTH: "Post title must be at least 1 character long";
    readonly TITLE_MAX_LENGTH: "Post title must not exceed 200 characters";
    readonly TITLE_INVALID_CHARS: "Title contains invalid characters (HTML tags are not allowed)";
    readonly BODY_REQUIRED: "Post body is required";
    readonly BODY_MIN_LENGTH: "Post body must be at least 1 character long";
    readonly BODY_INVALID_CHARS: "Body contains invalid characters (HTML tags are not allowed)";
    readonly STATUS_INVALID: "Post status must be either \"draft\" or \"published\"";
    readonly COMMENT_BODY_REQUIRED: "Comment body is required";
    readonly COMMENT_BODY_MIN_LENGTH: "Comment body must be at least 1 character long";
    readonly COMMENT_BODY_MAX_LENGTH: "Comment body must not exceed 2000 characters";
    readonly COMMENT_BODY_INVALID_CHARS: "Comment body contains invalid characters (HTML tags are not allowed)";
    readonly POST_ID_REQUIRED: "Post ID is required";
    readonly POST_ID_INVALID: "Post ID must be a positive integer";
    readonly PARENT_ID_INVALID: "Parent comment ID must be a positive integer";
    readonly PAGE_INVALID: "Page number must be at least 1";
    readonly LIMIT_MIN_INVALID: "Limit must be at least 1";
    readonly LIMIT_MAX_INVALID: "Limit must not exceed 100";
    readonly FOLDER_INVALID_CHARS: "folder must contain only alphanumeric characters, slashes, underscores, and hyphens";
    readonly ORIGINAL_NAME_INVALID_CHARS: "originalName must contain only alphanumeric characters, dots, underscores, and hyphens";
    readonly RESULT_INVALID_VALUE: "result must be either \"ok\" or \"not found\"";
};
export declare const LOG_MESSAGES: {
    readonly APP_RUNNING: "Application is running on:";
    readonly EMAIL_TRANSPORTER_INIT_SUCCESS: "Email transporter initialized successfully";
    readonly EMAIL_TRANSPORTER_INIT_FAILED: "Failed to initialize email transporter";
    readonly EMAIL_ENV_VARS_MISSING: "Missing required email environment variables:";
    readonly EMAIL_TRANSPORTER_NOT_INIT: "Email transporter not initialized - check environment variables";
    readonly EMAIL_SENT_SUCCESS: "Password reset email sent successfully:";
    readonly EMAIL_SEND_ERROR: "Detailed email error:";
    readonly CLOUDINARY_DELETE_ERROR: "Error deleting image from Cloudinary:";
    readonly CLOUDINARY_UPLOAD_ERROR: "Cloudinary upload error:";
    readonly CLOUDINARY_UPLOAD_FAILED: "Error uploading image to Cloudinary:";
    readonly CLOUDINARY_EXTRACT_ERROR: "Error extracting public_id from URL:";
    readonly UNHANDLED_ERROR: "Unhandled error:";
    readonly UPLOAD_NO_RESULT: "Upload completed but no result returned";
};
export declare const EMAIL_TEMPLATES: {
    readonly APP_NAME: "Blog App";
    readonly RESET_PASSWORD_SUBJECT: "Reset Your Password - Blog App";
    readonly RESET_PASSWORD_TITLE: "Reset Your Password";
    readonly RESET_PASSWORD_GREETING: "Hello";
    readonly RESET_PASSWORD_INTRO: "You requested to reset your password. Click the button below to set a new password.";
    readonly RESET_PASSWORD_BUTTON: "Reset My Password";
    readonly RESET_PASSWORD_WARNING: "⚠️ Important:";
    readonly RESET_PASSWORD_EXPIRY: "This link will expire in";
    readonly RESET_PASSWORD_EXPIRY_TIME: "1 hour";
    readonly RESET_PASSWORD_FALLBACK: "If the button doesn't work, copy and paste this link into your browser:";
    readonly RESET_PASSWORD_IGNORE: "If you did not request this password reset, you can safely ignore this email.";
    readonly RESET_PASSWORD_CLOSING: "Best regards,";
    readonly RESET_PASSWORD_TEAM: "Blog App Team";
    readonly RESET_PASSWORD_AUTO: "This is an automated email. Please do not reply.";
    readonly RESET_PASSWORD_TEXT_INTRO: "You requested to reset your password. Click the link below to reset it:";
    readonly RESET_PASSWORD_TEXT_EXPIRY: "This link will expire in 1 hour.";
    readonly RESET_PASSWORD_TEXT_IGNORE: "If you didn't request this, please ignore this email.";
};
/**
 * Default values
 */
export declare const DEFAULTS: {
    readonly USER_NAME: "User";
    readonly CLOUDINARY_FOLDER: "blog";
    readonly CLOUDINARY_IMAGE_NAME: "image";
    readonly CLOUDINARY_POSTS_FOLDER: "blog/posts";
    readonly CLOUDINARY_POST_IMAGE_NAME: "post-image";
    readonly CLOUDINARY_USERS_FOLDER: "blog/users";
    readonly CLOUDINARY_PROFILE_IMAGE_NAME: "profile-image";
    readonly PAGINATION_PAGE: 1;
    readonly PAGINATION_LIMIT: 10;
    readonly USERS_LIST_LIMIT: 20;
};
/**
 * Validation limits
 */
export declare const VALIDATION_LIMITS: {
    readonly NAME_MIN_LENGTH: 2;
    readonly PASSWORD_MIN_LENGTH: 8;
    readonly PAGE_MIN: 1;
    readonly LIMIT_MIN: 1;
    readonly LIMIT_MAX: 100;
};
export declare const SECURITY: {
    readonly SALT_ROUNDS: 10;
};
export declare const USER_STATUS: {
    readonly LOGGED_IN: "logged in";
    readonly LOGGED_OUT: "logged out";
};
/**
 * Validation regex patterns
 */
export declare const VALIDATION_PATTERNS: {
    readonly FOLDER: RegExp;
    readonly ORIGINAL_NAME: RegExp;
    readonly NO_HTML_TAGS: RegExp;
    readonly NAME: RegExp;
    readonly PHONE: RegExp;
};
/**
 * Sanitization regex patterns (for removing invalid characters)
 */
export declare const SANITIZATION_PATTERNS: {
    readonly FOLDER: RegExp;
    readonly ORIGINAL_NAME: RegExp;
    readonly PUBLIC_ID_EXTRACT: RegExp;
    readonly BLOG_PREFIX_REMOVE: RegExp;
};
//# sourceMappingURL=constants.d.ts.map