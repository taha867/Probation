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
  IdParam,
  PostIdParam,
} from "./commonInterface.js";

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
  TokenRefreshResult,
  PasswordResetTokenResult,
} from "./authInterface.js";

// User interfaces
export type {
  BaseUserProfile,
  PublicUserProfile,
  AuthUserData,
  UserTokenVersion,
  UserIdEmailToken,
  UserIdAndName,
  UserImagePublicId,
  UpdateUserInput,
  ListUsersQuery,
  GetUserPostsQuery,
  ListUsersResult,
  UpdateUserServiceInput,
  UpdateUserServiceResult,
  DeleteUserServiceInput,
  GetUserPostsServiceInput,
  GetUserPostsServiceResult,
} from "./userInterface.js";

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
  GetPostCommentsServiceInput,
  GetPostCommentsServiceResult,
} from "./postInterface.js";

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
  ListCommentsServiceInput,
  ListCommentsServiceResult,
} from "./commentInterface.js";

// Cloudinary interfaces
export type {
  CloudinaryUploadResult,
  CloudinaryDeletionResult,
} from "./cloudinaryInterface.js";

