import { StatusCodes } from "http-status-codes";
export declare const HTTP_STATUS: typeof StatusCodes;
/**
 * Success messages for API responses
 */
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
/**
 * Error messages for API responses
 */
export declare const ERROR_MESSAGES: {
    readonly INVALID_CREDENTIALS: "Invalid credentials";
    readonly ACCESS_TOKEN_REQUIRED: "Access token is required";
    readonly INVALID_TOKEN: "Invalid token";
    readonly INVALID_TOKEN_USER_NOT_FOUND: "Invalid token - user not found";
    readonly TOKEN_EXPIRED: "Token expired";
    readonly AUTHENTICATION_FAILED: "Authentication failed";
    readonly PASSWORD_EMAIL_OR_PHONE_REQUIRED: "Please provide your password and either email or phone number";
    readonly EMAIL_REQUIRED: "Email is required";
    readonly RESET_TOKEN_REQUIRED: "Reset token is required";
    readonly NEW_PASSWORD_REQUIRED: "New password is required";
    readonly INVALID_RESET_TOKEN: "Invalid or expired reset token";
    readonly RESET_TOKEN_EXPIRED: "Reset token has expired. Please request a new one";
    readonly PASSWORD_MISSMATCH: "your password doesnot match with confirm password";
    readonly REFRESH_TOKEN_REQUIRED: "Refresh token is required";
    readonly INVALID_REFRESH_TOKEN: "Invalid or expired refresh token";
    readonly REFRESH_TOKEN_EXPIRED: "Refresh token has expired. Please login again";
    readonly ACCESS_TOKEN_EXPIRED: "Access token has expired. Please refresh your token";
    readonly EMAIL_SEND_FAILED: "Failed to send email. Please try again later";
    readonly USER_NOT_FOUND: "User not found";
    readonly USER_ALREADY_EXISTS: "User with that email or phone already exists";
    readonly EMAIL_ALREADY_EXISTS: "Email already exists for another user";
    readonly PHONE_ALREADY_EXISTS: "Phone number already exists for another user";
    readonly INVALID_USER_ID: "Invalid user id";
    readonly CANNOT_UPDATE_OTHER_USER: "You can only update your own profile";
    readonly CANNOT_DELETE_OTHER_USER: "You can only delete your own account";
    readonly NO_FIELDS_TO_UPDATE: "No fields provided to update";
    readonly UNABLE_TO_FETCH_USERS: "Unable to fetch users at this time";
    readonly UNABLE_TO_FETCH_USER_POSTS: "Unable to fetch posts for this user";
    readonly UNABLE_TO_UPDATE_USER: "Unable to update user at this time";
    readonly UNABLE_TO_DELETE_USER: "Unable to delete user at this time";
    readonly UNABLE_TO_FETCH_CURRENT_USER: "Unable to fetch current user";
    readonly POST_NOT_FOUND: "Post not found";
    readonly INVALID_POST_ID: "Invalid post id";
    readonly TITLE_BODY_REQUIRED: "title and body are required fields";
    readonly CANNOT_UPDATE_OTHER_POST: "You can only update your own posts";
    readonly CANNOT_DELETE_OTHER_POST: "You can only delete your own posts";
    readonly UNABLE_TO_CREATE_POST: "Unable to create post at this time";
    readonly UNABLE_TO_FETCH_POSTS: "Unable to fetch posts at this time";
    readonly UNABLE_TO_FETCH_POST: "Unable to fetch the requested post";
    readonly UNABLE_TO_UPDATE_POST: "Unable to update the requested post";
    readonly UNABLE_TO_DELETE_POST: "Unable to delete the requested post";
    readonly UNABLE_TO_FETCH_POST_COMMENTS: "Unable to fetch comments for this post";
    readonly COMMENT_NOT_FOUND: "Comment not found";
    readonly PARENT_COMMENT_NOT_FOUND: "Parent comment not found";
    readonly BODY_POST_ID_OR_PARENT_ID_REQUIRED: "body and either postId or parentId are required fields";
    readonly BODY_REQUIRED: "body is required";
    readonly CANNOT_UPDATE_OTHER_COMMENT: "You can only update your own comments";
    readonly CANNOT_DELETE_OTHER_COMMENT: "You can only delete your own comments";
    readonly UNABLE_TO_CREATE_COMMENT: "Unable to create comment at this time";
    readonly UNABLE_TO_FETCH_COMMENTS: "Unable to fetch comments at this time";
    readonly UNABLE_TO_FETCH_COMMENT: "Unable to fetch the requested comment";
    readonly UNABLE_TO_UPDATE_COMMENT: "Unable to update the requested comment";
    readonly UNABLE_TO_DELETE_COMMENT: "Unable to delete the requested comment";
    readonly VALIDATION_ERROR: "Validation error";
    readonly OPERATION_FAILED: "Could not perform operation at this time, kindly try again later.";
    readonly TOO_MANY_REQUESTS: "Too many requests, please try again later";
    readonly ROUTE_NOT_FOUND: "Route not found";
};
/**
 * User status values
 */
export declare const USER_STATUS: {
    readonly LOGGED_IN: "logged in";
    readonly LOGGED_OUT: "logged out";
};
//# sourceMappingURL=constants.d.ts.map