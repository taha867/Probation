// Common DTOs (reusable across all interfaces)
export type {
  ServiceResult,
  PaginatedResult,
  BaseQuery,
  SearchableQuery,
  FileUploadInput,
  BaseAuthorizationInput,
  BaseEntityOwnershipInput,
  BaseUpdateWithFileInput,
  PaginationParams,
  PaginationMeta,
} from "./commonInterface.ts";

// Auth interfaces
export type {
  TokenPayload,
  AccessRefreshTokenPayload,
  SignUpInput,
  SignInInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  RefreshTokenInput,
  AuthenticationResult,
  AuthenticationResultData,
  TokenRefreshResult,
  TokenRefreshResultData,
  PasswordResetTokenResult,
  PasswordResetTokenResultData,
} from "./authInterface.ts";

// User interfaces
export type {
  BaseUserProfile,
  PublicUserProfile,
  AuthUserData,
  UserTokenVersion,
  UserIdEmailToken,
  UserIdAndName,
  UserImagePublicId,
  UserModelData,
  UpdateUserInput,
  ListUsersQuery,
  GetUserPostsQuery,
  ListUsersResult,
  UpdateUserServiceInput,
  UpdateUserServiceResult,
  DeleteUserServiceInput,
  GetUserPostsServiceInput,
  GetUserPostsServiceResult,
} from "./userInterface.ts";

// Post interfaces
export type {
  BasePost,
  PostWithAuthor,
  PostUserId,
  PostImagePublicId,
  PostModelData,
  CreatePostInput,
  UpdatePostInput,
  ListPostsQuery,
  ListPostsResult,
  CreatePostServiceInput,
  CreatePostServiceResult,
  UpdatePostServiceInput,
  UpdatePostServiceResult,
  DeletePostServiceInput,
  GetPostServiceResult,
  GetPostCommentsServiceInput,
  GetPostCommentsServiceResult,
} from "./postInterface.ts";

// Comment interfaces
export type {
  BaseComment,
  CommentWithAuthor,
  CommentWithRelations,
  CommentUserId,
  CommentPostId,
  CommentModelData,
  CreateCommentInput,
  UpdateCommentInput,
  ListCommentsQuery,
  CreateCommentServiceInput,
  CreateCommentServiceResult,
  UpdateCommentServiceInput,
  UpdateCommentServiceResult,
  DeleteCommentServiceInput,
  GetCommentServiceResult,
  ListCommentsServiceInput,
  ListCommentsServiceResult,
} from "./commentInterface.ts";

