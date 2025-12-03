import { StatusCodes } from "http-status-codes";

// HTTP Status Codes
export const httpStatus = StatusCodes;

// Success Messages
export const successMessages = {
  ACCOUNT_CREATED: "Account created successfully",
  signedIn: "Signed in successfully",
  loggedOut: "Logged out successfully",
  userUpdated: "User updated successfully",
  userDeleted: "User account deleted successfully",
  postCreated: "Post created successfully",
  postUpdated: "Post updated successfully",
  postDeleted: "Post deleted successfully",
  commentCreated: "Comment created successfully",
  commentUpdated: "Comment updated successfully",
  commentDeleted: "Comment deleted successfully",
  resetTokenSent: "Password reset token has been sent to your email",
  passwordReset: "Password has been reset successfully",
  tokenRefreshed: "Access token refreshed successfully",
};

// Error Messages
export const errorMessages = {
  // Authentication Errors
  invalidCredentials: "Invalid credentials",
  accessTokenRequired: "Access token is required",
  invalidToken: "Invalid token",
  invalidTokenUserNotFound: "Invalid token - user not found",
  tokenExpired: "Token expired",
  authenticationFailed: "Authentication failed",
  passwordEmailOrPhoneRequired: "Please provide your password and either email or phone number",
  emailRequired: "Email is required",
  resetTokenRequired: "Reset token is required",
  newPasswordRequired: "New password is required",
  invalidResetToken: "Invalid or expired reset token",
  resetTokenExpired: "Reset token has expired. Please request a new one",
  passwordMissmatch: "your password doesnot match with confirm password",
  refreshTokenRequired: "Refresh token is required",
  invalidRefreshToken: "Invalid or expired refresh token",
  refreshTokenExpired: "Refresh token has expired. Please login again",
  accessTokenExpired: "Access token has expired. Please refresh your token",

  // User Errors
  userNotFound: "User not found",
  userAlreadyExists: "User with that email or phone already exists",
  emailAlreadyExists: "Email already exists for another user",
  phoneAlreadyExists: "Phone number already exists for another user",
  invalidUserId: "Invalid user id",
  cannotUpdateOtherUser: "You can only update your own profile",
  cannotDeleteOtherUser: "You can only delete your own account",
  noFieldsToUpdate: "No fields provided to update",
  unableToFetchUsers: "Unable to fetch users at this time",
  unableToFetchUserPosts: "Unable to fetch posts for this user",
  unableToUpdateUser: "Unable to update user at this time",
  unableToDeleteUser: "Unable to delete user at this time",

  // Post Errors
  postNotFound: "Post not found",
  invalidPostId: "Invalid post id",
  titleBodyRequired: "title and body are required fields",
  cannotUpdateOtherPost: "You can only update your own posts",
  cannotDeleteOtherPost: "You can only delete your own posts",
  unableToCreatePost: "Unable to create post at this time",
  unableToFetchPosts: "Unable to fetch posts at this time",
  unableToFetchPost: "Unable to fetch the requested post",
  unableToUpdatePost: "Unable to update the requested post",
  unableToDeletePost: "Unable to delete the requested post",
  unableToFetchPostComments: "Unable to fetch comments for this post",

  // Comment Errors
  commentNotFound: "Comment not found",
  parentCommentNotFound: "Parent comment not found",
  bodyPostIdOrParentIdRequired: "body and either postId or parentId are required fields",
  bodyRequired: "body is required",
  cannotUpdateOtherComment: "You can only update your own comments",
  cannotDeleteOtherComment: "You can only delete your own comments",
  unableToCreateComment: "Unable to create comment at this time",
  unableToFetchComments: "Unable to fetch comments at this time",
  unableToFetchComment: "Unable to fetch the requested comment",
  unableToUpdateComment: "Unable to update the requested comment",
  unableToDeleteComment: "Unable to delete the requested comment",

  // General Errors
  operationFailed:
    "Could not perform operation at this time, kindly try again later.",
  tooManyRequests: "Too many requests, please try again later",
  routeNotFound: "Route not found",
};

// User Status
export const userStatus = {
  loggedIn: "logged in",
  loggedOut: "logged out",
};

