# Blog Backend - Node.js + Express + Sequelize API

A production-ready RESTful API backend built with Node.js, Express, and Sequelize ORM, following layered architecture principles and best practices for security, validation, and maintainability.

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Architecture Overview](#architecture-overview)
- [Request Flow](#request-flow)
- [Key Concepts](#key-concepts)
- [Database Models & Relationships](#database-models--relationships)
- [Authentication & Authorization](#authentication--authorization)
- [Validation System](#validation-system)
- [Error Handling](#error-handling)
- [Service Layer Pattern](#service-layer-pattern)
- [API Endpoints](#api-endpoints)
- [Development Guide](#development-guide)
- [Best Practices](#best-practices)

---

## 🛠 Tech Stack

### Core Framework

- **Node.js** - JavaScript runtime
- **Express 5.1.0** - Web application framework
- **Sequelize 6.37.7** - ORM for PostgreSQL
- **PostgreSQL** - Relational database

### Authentication & Security

- **jsonwebtoken 9.0.2** - JWT token generation and verification
- **bcrypt 6.0.0** - Password hashing
- **express-rate-limit 8.2.1** - Rate limiting for brute-force protection
- **cors 2.8.5** - Cross-Origin Resource Sharing

### Validation & Utilities

- **Joi 18.0.2** - Schema validation library
- **http-status-codes 2.3.0** - HTTP status code constants
- **dotenv 17.2.3** - Environment variable management

### External Services

- **Cloudinary 2.8.0** - Image upload and management
- **Nodemailer 7.0.11** - Email sending service

### Development Tools

- **nodemon 3.1.11** - Auto-restart on file changes
- **sequelize-cli 6.6.3** - Database migrations and seeders

---

## 📁 Project Structure

```
backend/
├── config.js                    # Database configuration (Sequelize)
├── server.js                    # Application entry point
├── package.json                 # Dependencies and scripts
│
├── src/
│   ├── config/
│   │   └── dbConfig.js         # Database initialization
│   │
│   ├── controllers/            # HTTP request handlers (thin layer)
│   │   ├── authController.js   # Authentication endpoints
│   │   ├── userController.js   # User management endpoints
│   │   ├── postController.js   # Post CRUD endpoints
│   │   ├── commentController.js # Comment CRUD endpoints
│   │   └── uploadController.js  # Cloudinary upload signature
│   │
│   ├── services/               # Business logic layer
│   │   ├── authService.js      # Authentication business logic
│   │   ├── userService.js      # User business logic
│   │   ├── postService.js      # Post business logic
│   │   ├── commentService.js  # Comment business logic
│   │   ├── cloudinaryService.js # Cloudinary operations
│   │   └── emailService.js     # Email sending service
│   │
│   ├── models/                 # Sequelize models (database schema)
│   │   ├── index.js           # Model loader and associations
│   │   ├── user.js            # User model
│   │   ├── post.js            # Post model
│   │   └── comment.js         # Comment model
│   │
│   ├── routes/                 # Route definitions
│   │   ├── index.js           # Main router (mounts all routes)
│   │   ├── authRoutes.js      # Authentication routes
│   │   ├── userRoutes.js      # User routes
│   │   ├── postRoutes.js      # Post routes
│   │   ├── commentRoutes.js  # Comment routes
│   │   └── uploadRoutes.js    # Upload routes
│   │
│   ├── middleware/             # Express middleware
│   │   └── authMiddleware.js  # JWT authentication middleware
│   │
│   ├── validations/            # Joi validation schemas
│   │   ├── commonSchemas.js   # Shared validation schemas
│   │   ├── authValidation.js  # Auth validation schemas
│   │   ├── userValidation.js  # User validation schemas
│   │   ├── postValidation.js  # Post validation schemas
│   │   └── commentValidation.js # Comment validation schemas
│   │
│   ├── utils/                  # Utility functions
│   │   ├── constants.js       # Application constants
│   │   ├── errors.js          # Custom error classes
│   │   ├── validations.js     # Validation helper
│   │   ├── jwt.js             # JWT utilities
│   │   ├── bcrypt.js          # Password hashing utilities
│   │   └── pagination.js      # Pagination helpers
│   │
│   └── migrations/             # Database migrations (Sequelize)
│       ├── 20251121132047-create-user.js
│       ├── 20251124100000-create-post.js
│       ├── 20251125120000-create-comment.js
│       └── ... (other migrations)
│
└── .env                        # Environment variables
```

---

## 🏗 Architecture Overview

### Layered Architecture Pattern

The backend follows a **layered architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────┐
│         HTTP Request                     │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Routes Layer                           │
│  - Route definitions                    │
│  - Middleware application               │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Middleware Layer                       │
│  - Authentication (JWT)                 │
│  - Rate limiting                        │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Controller Layer                       │
│  - Request validation                   │
│  - Service calls                        │
│  - HTTP response formatting             │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Service Layer                          │
│  - Business logic                       │
│  - Database operations                  │
│  - External service integration         │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Model Layer (Sequelize)                │
│  - Database schema                      │
│  - Relationships                        │
│  - Data access                          │
└─────────────────────────────────────────┘
```

### Design Principles

1. **Separation of Concerns**

   - **Routes**: Define endpoints and apply middleware
   - **Controllers**: Handle HTTP requests/responses, validate input
   - **Services**: Contain business logic, database operations
   - **Models**: Define data structure and relationships

2. **Single Responsibility Principle (SRP)**

   - Each layer has one clear responsibility
   - Services separated by domain (auth, users, posts, comments)
   - Controllers are thin - delegate to services

3. **DRY (Don't Repeat Yourself)**

   - Shared validation schemas (`commonSchemas.js`)
   - Reusable utilities (`pagination.js`, `errors.js`)
   - Centralized constants (`constants.js`)

4. **Security First**
   - Input validation at controller level
   - Authentication middleware for protected routes
   - Rate limiting for sensitive endpoints
   - Password hashing with bcrypt
   - JWT token-based authentication

---

## 🔄 Request Flow

### Example: Creating a Post (`POST /posts`)

```
1. HTTP Request
   POST /posts
   Authorization: Bearer <token>
   Body: { title: "...", body: "...", status: "published" }
   │
   ▼
2. Express App (server.js)
   - CORS middleware
   - JSON body parser
   - URL-encoded parser
   │
   ▼
3. Routes (routes/postRoutes.js)
   router.post("/", authenticateToken, create)
   │
   ▼
4. Middleware (middleware/authMiddleware.js)
   authenticateToken:
   - Extract token from Authorization header
   - Verify JWT token
   - Check token type (access token)
   - Set req.user = { id: userId }
   │
   ▼
5. Controller (controllers/postController.js)
   create():
   - Validate request body (validateRequest + createPostSchema)
   - Extract validated data: { title, body, status, image, imagePublicId }
   - Extract userId from req.user.id
   - Call service: postService.createPost({ ... })
   │
   ▼
6. Service (services/postService.js)
   createPost():
   - Use Sequelize: Post.create({ title, body, status, image, imagePublicId, userId })
   - Return created post
   │
   ▼
7. Controller Response
   - Format response: { data: post, message: POST_CREATED }
   - Send HTTP 201 Created
   │
   ▼
8. HTTP Response
   201 Created
   { data: { ...post }, message: "Post created successfully" }
```

### Request Flow Diagram

```
Client Request
    │
    ├─► Routes (routes/)
    │   └─► Apply Middleware
    │       ├─► authenticateToken (if protected)
    │       └─► Rate Limiter (if applicable)
    │
    ├─► Controller (controllers/)
    │   ├─► Validate Request (validateRequest + Joi schema)
    │   ├─► Extract Data (req.body, req.params, req.user)
    │   └─► Call Service
    │
    ├─► Service (services/)
    │   ├─► Business Logic
    │   ├─► Database Operations (Sequelize)
    │   ├─► External Services (Cloudinary, Email)
    │   └─► Return Result
    │
    ├─► Controller Response
    │   ├─► Format Response
    │   ├─► Add Success Message
    │   └─► Send HTTP Response
    │
    └─► Client Response
```

---

## 🔑 Key Concepts

### 1. Layered Architecture

**Purpose**: Separates concerns and makes code maintainable and testable.

**Layers**:

- **Routes**: Endpoint definitions and middleware application
- **Controllers**: HTTP request/response handling, input validation
- **Services**: Business logic, database operations, external integrations
- **Models**: Data structure, relationships, database schema

**Benefits**:

- Easy to test each layer independently
- Clear separation of responsibilities
- Easy to modify one layer without affecting others
- Reusable business logic

### 2. Service Layer Pattern

**Purpose**: Encapsulates business logic and database operations.

**Key Characteristics**:

- Services are classes that receive models in constructor
- Pure JavaScript functions (no Express dependencies)
- Throw `AppError` for domain errors
- Return data objects or `{ ok: true/false }` patterns

**Example**:

```javascript
// Service class pattern
export class PostService {
  constructor(models) {
    this.Post = models.Post;
    this.User = models.User;
  }

  async createPost({ title, body, status, userId }) {
    return this.Post.create({ title, body, status, userId });
  }
}

// Usage in controller
const postService = new PostService(models);
const post = await postService.createPost({ ... });
```

### 3. Controller Pattern

**Purpose**: Handle HTTP requests and responses, delegate to services.

**Standard Pattern**:

```javascript
export async function create(req, res) {
  // 1. Validate request
  const validatedBody = validateRequest(createPostSchema, req.body, res);
  if (!validatedBody) return; // Validation failed, response sent

  // 2. Extract data
  const { title, body, status } = validatedBody;
  const { id: userId } = req.user;

  try {
    // 3. Call service
    const post = await postService.createPost({ title, body, status, userId });

    // 4. Send success response
    return res.status(CREATED).send({
      data: post,
      message: POST_CREATED,
    });
  } catch (err) {
    // 5. Handle errors
    if (handleAppError(err, res, ERROR_MESSAGES)) return;
    // Fallback error handling
    return res.status(INTERNAL_SERVER_ERROR).send({
      message: UNABLE_TO_CREATE_POST,
    });
  }
}
```

### 4. Validation System

**Purpose**: Validate and sanitize all incoming data before processing.

**Components**:

- **Joi Schemas** (`validations/`): Define validation rules
- **validateRequest** (`utils/validations.js`): Executes validation
- **Common Schemas** (`validations/commonSchemas.js`): Reusable patterns

**Validation Flow**:

```javascript
// 1. Define schema
export const createPostSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200).required(),
  body: Joi.string().trim().min(1).max(5000).required(),
  status: Joi.string().valid("draft", "published").required(),
});

// 2. Validate in controller
const validatedBody = validateRequest(createPostSchema, req.body, res);
if (!validatedBody) return; // Validation failed

// 3. Use validated data
const { title, body, status } = validatedBody; // Guaranteed to be valid
```

**Features**:

- Automatic type conversion (with `convert: true`)
- Strips unknown fields (with `stripUnknown: true`)
- Returns all errors (not just first)
- Consistent error format

### 5. Error Handling System

**Purpose**: Consistent error handling across the application.

**Components**:

- **AppError Class** (`utils/errors.js`): Custom error with code and status
- **handleAppError** (`utils/errors.js`): Maps AppError to HTTP response
- **ERROR_MESSAGES** (`utils/constants.js`): Centralized error messages

**Error Flow**:

```javascript
// Service throws AppError
throw new AppError("POST_NOT_FOUND", HTTP_STATUS.NOT_FOUND);

// Controller catches and handles
catch (err) {
  if (handleAppError(err, res, ERROR_MESSAGES)) return;
  // Fallback for unexpected errors
  return res.status(INTERNAL_SERVER_ERROR).send({ ... });
}
```

**Benefits**:

- Consistent error responses
- Machine-readable error codes
- Proper HTTP status codes
- Centralized error messages

### 6. Authentication & Authorization

**Purpose**: Secure API endpoints and ensure users can only access/modify their own resources.

**Components**:

- **JWT Tokens**: Access tokens (15min) and refresh tokens (7days)
- **authenticateToken Middleware**: Verifies JWT and sets `req.user`
- **Service-level Authorization**: Checks ownership before operations

**Authentication Flow**:

```
1. User logs in → Receives accessToken + refreshToken
2. Client sends: Authorization: Bearer <accessToken>
3. authenticateToken middleware:
   - Extracts token from header
   - Verifies token signature
   - Checks token type (access token)
   - Sets req.user = { id: userId }
4. Controller uses req.user.id for operations
```

**Authorization Pattern**:

```javascript
// Service checks ownership
async updatePostForUser({ postId, userId, data }) {
  const post = await this.Post.findByPk(postId);
  if (post.userId !== userId) {
    throw new AppError("CANNOT_UPDATE_OTHER_POST", HTTP_STATUS.FORBIDDEN);
  }
  // Update post...
}
```

---

## 🗄 Database Models & Relationships

### Entity Relationship Diagram

```
                    ┌─────────────┐
                    │    User     │
                    │─────────────│
                    │ id (PK)     │
                    │ name        │
                    │ email       │
                    │ phone       │
                    │ password    │
                    │ status      │
                    │ image       │
                    │ tokenVersion│
                    └─────┬───────┘
                          │
                          │ hasMany (1:N)
                          │
                          │
                          │
                          │
                          ▼
┌─────────────┐    ┌─────────────┐
│    Post     │    │  Comment    │◄──────────┐
│─────────────│    │─────────────│           │ hasMany (1:N) - Self Relation
│ id (PK)     │    │ id (PK)     │           │ (replies/nested comments)
│ userId (FK) │    │ userId (FK) │◄──────────┘
│ title       │    │ postId (FK) │
│ body        │    │ parentId    │
│ status      │    │   (FK)      │
│ image       │    │ body        │
└──────┬──────┘    └──────┬──────┘
       │                  │
       │ hasMany (1:N)    │
       │                  │
       │                  │
       │                  │
       │                  │
       └──────────────────┘

```

**Relationships**:

- **User hasMany Posts** (1:N) - One user can create many posts
- **User hasMany Comments** (1:N) - One user can write many comments
- **Post hasMany Comments** (1:N) - One post can have many comments
- **Comment hasMany Comments** (1:N Self-Relation) - One comment can have many replies (nested comments)

### Model Definitions

#### User Model (`models/user.js`)

**Fields**:

- `id` - Primary key (auto-increment)
- `name` - User's full name
- `email` - Unique email address
- `phone` - Unique phone number
- `password` - Hashed password (bcrypt)
- `status` - User status ("logged in" / "logged out")
- `image` - Profile image URL (Cloudinary)
- `imagePublicId` - Cloudinary public_id for deletion
- `lastLoginAt` - Last login timestamp
- `tokenVersion` - Token version for invalidation

**Associations**:

- `hasMany(Post)` - User can have many posts
- `hasMany(Comment)` - User can have many comments

**Hooks**:

- `beforeCreate`: Hash password before creating user
- `beforeUpdate`: Hash password if password field changed

**Security**:

- `toJSON()` method excludes password from responses
- Password automatically hashed via hooks

#### Post Model (`models/post.js`)

**Fields**:

- `id` - Primary key
- `userId` - Foreign key to User
- `title` - Post title (max 200 chars)
- `body` - Post content (TEXT)
- `status` - Post status ("draft" / "published")
- `image` - Post image URL (Cloudinary)
- `imagePublicId` - Cloudinary public_id for deletion
- `createdAt` - Creation timestamp
- `updatedAt` - Update timestamp

**Associations**:

- `belongsTo(User)` - Post belongs to one user (author)
- `hasMany(Comment)` - Post can have many comments

#### Comment Model (`models/comment.js`)

**Fields**:

- `id` - Primary key
- `userId` - Foreign key to User (comment author)
- `postId` - Foreign key to Post
- `parentId` - Foreign key to Comment (for replies, nullable)
- `body` - Comment content (TEXT, max 2000 chars)
- `createdAt` - Creation timestamp
- `updatedAt` - Update timestamp

**Associations**:

- `belongsTo(User)` - Comment belongs to one user (author)
- `belongsTo(Post)` - Comment belongs to one post
- `belongsTo(Comment)` - Comment can have a parent (for replies)
- `hasMany(Comment)` - Comment can have many replies

**Nested Comments**:

- Top-level comments: `parentId = null`
- Replies: `parentId = parent comment id`
- Cascading delete: Deleting a comment deletes all replies

### Model Loading (`models/index.js`)

**Dynamic Model Loading**:

1. Reads all `.js` files in `models/` directory
2. Dynamically imports each model
3. Calls `associate()` method on each model to set up relationships
4. Exports `db` object with all models and Sequelize instance

**Usage**:

```javascript
import models from "./models/index.js";

const { User, Post, Comment, sequelize } = models;
```

---

## 🔐 Authentication & Authorization

### JWT Token System

**Token Types**:

1. **Access Token**

   - Expires in: 15 minutes
   - Contains: `userId`, `email`, `tokenVersion`, `type: "access"`
   - Used for: API requests
   - Stored: Client-side (localStorage)

2. **Refresh Token**
   - Expires in: 7 days
   - Contains: `userId`, `tokenVersion`, `type: "refresh"`
   - Used for: Getting new access tokens
   - Stored: Client-side (localStorage)

**Token Versioning**:

- Each user has a `tokenVersion` field
- Incremented on password change or logout
- Invalidates all existing tokens (security feature)

### Authentication Endpoints

| Endpoint               | Method | Description               | Auth Required     |
| ---------------------- | ------ | ------------------------- | ----------------- |
| `/auth/register`       | POST   | Register new user         | No                |
| `/auth/login`          | POST   | Login user                | No (rate limited) |
| `/auth/logout`         | POST   | Logout user               | Yes               |
| `/auth/forgotPassword` | POST   | Request password reset    | No                |
| `/auth/resetPassword`  | POST   | Reset password with token | No                |
| `/auth/refreshToken`   | POST   | Refresh access token      | No                |

### Authentication Flow

**Registration**:

```
1. User submits: { name, email, phone, password }
2. Validate input (Joi schema)
3. Check if email/phone exists
4. Hash password (bcrypt)
5. Create user with status="logged out"
6. Return success message
```

**Login**:

```
1. User submits: { email/phone, password }
2. Validate input
3. Find user by email/phone
4. Compare password (bcrypt)
5. Update user status="logged in", lastLoginAt
6. Generate accessToken (15min) + refreshToken (7days)
7. Return tokens + user data
```

**Token Refresh**:

```
1. User submits: { refreshToken }
2. Verify refreshToken signature
3. Check token type === "refresh"
4. Verify tokenVersion matches user.tokenVersion
5. Generate new accessToken
6. Return new accessToken
```

**Password Reset**:

```
1. User submits: { email }
2. Find user by email
3. Generate reset token (JWT, 1 hour expiry)
4. Send email with reset link
5. User clicks link → Frontend extracts token
6. User submits: { token, newPassword, confirmPassword }
7. Verify token, check expiry
8. Hash new password
9. Update user password + increment tokenVersion
10. Return success message
```

### Authorization Patterns

**Resource Ownership Checks**:

```javascript
// Pattern used in services
async updatePostForUser({ postId, userId, data }) {
  const post = await this.Post.findByPk(postId);

  // Check ownership
  if (post.userId !== userId) {
    throw new AppError("CANNOT_UPDATE_OTHER_POST", HTTP_STATUS.FORBIDDEN);
  }

  // Proceed with update
  await post.update(data);
  return { ok: true, post };
}
```

**Protected Routes**:

```javascript
// Routes with authentication
router.post("/", authenticateToken, create);
router.put("/:id", authenticateToken, update);
router.delete("/:id", authenticateToken, remove);
```

---

## ✅ Validation System

### Validation Architecture

**Components**:

1. **Joi Schemas** (`validations/`): Define validation rules
2. **validateRequest** (`utils/validations.js`): Executes validation
3. **Common Schemas** (`validations/commonSchemas.js`): Reusable patterns

### Validation Layers

**1. Request Body Validation**:

```javascript
// Schema definition
export const createPostSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200).required(),
  body: Joi.string().trim().min(1).max(5000).required(),
  status: Joi.string().valid("draft", "published").required(),
});

// Usage in controller
const validatedBody = validateRequest(createPostSchema, req.body, res);
if (!validatedBody) return; // Validation failed
```

**2. Request Parameters Validation**:

```javascript
// Schema definition
export const postIdParamSchema = idParamSchema("Post ID");

// Usage in controller
const validatedParams = validateRequest(postIdParamSchema, req.params, res);
if (!validatedParams) return;
const { id } = validatedParams;
```

**3. Query Parameters Validation**:

```javascript
// Schema definition
export const listPostsQuerySchema = paginationQuerySchema({
  defaultLimit: 10,
  maxLimit: 100,
}).keys({
  search: Joi.string().optional(),
  userId: Joi.number().integer().positive().optional(),
  status: Joi.string().valid("draft", "published").optional(),
});

// Usage in controller
const validatedQuery = validateRequest(listPostsQuerySchema, req.query, res, {
  convert: true, // Convert string numbers to numbers
});
```

### Common Validation Patterns

**Reusable Schemas** (`validations/commonSchemas.js`):

- `idParamSchema()` - ID parameter validation
- `paginationQuerySchema()` - Pagination parameters
- `baseEmailSchema` - Email validation
- `basePasswordSchema` - Password validation
- `basePhoneSchema` - Phone validation
- `baseNameSchema` - Name validation

**Benefits**:

- Consistent validation across endpoints
- Reusable patterns
- Easy to maintain
- Type conversion support

---

## ⚠️ Error Handling

### Error Handling Architecture

**Components**:

1. **AppError Class** (`utils/errors.js`): Custom error with code and status
2. **handleAppError** (`utils/errors.js`): Maps AppError to HTTP response
3. **ERROR_MESSAGES** (`utils/constants.js`): Centralized error messages

### Error Types

**1. Validation Errors** (400 Bad Request):

```javascript
// Returned by validateRequest
{
  data: {
    message: "Validation error",
    errors: [
      { field: "title", message: "Title is required" },
      { field: "body", message: "Body must be at least 10 characters" }
    ]
  }
}
```

**2. Authentication Errors** (401 Unauthorized):

```javascript
// Examples:
-"Access token is required" -
  "Invalid token" -
  "Token expired" -
  "Invalid credentials";
```

**3. Authorization Errors** (403 Forbidden):

```javascript
// Examples:
-"You can only update your own posts" - "You can only delete your own comments";
```

**4. Not Found Errors** (404 Not Found):

```javascript
// Examples:
-"Post not found" - "User not found" - "Comment not found";
```

**5. Business Logic Errors** (422 Unprocessable Entity):

```javascript
// Examples:
-"User with that email or phone already exists" -
  "Invalid or expired reset token";
```

**6. Server Errors** (500 Internal Server Error):

```javascript
// Examples:
-"Unable to create post at this time" - "Operation failed";
```

### Error Handling Pattern

**Service Layer**:

```javascript
// Services throw AppError
if (!user) {
  throw new AppError("USER_NOT_FOUND", HTTP_STATUS.NOT_FOUND);
}

if (user.id !== authUserId) {
  throw new AppError("CANNOT_UPDATE_OTHER_USER", HTTP_STATUS.FORBIDDEN);
}
```

**Controller Layer**:

```javascript
try {
  const result = await service.method();
  return res.status(OK).send({ data: result });
} catch (err) {
  // Handle AppError
  if (handleAppError(err, res, ERROR_MESSAGES)) return;

  // Handle unexpected errors
  console.error(err);
  return res.status(INTERNAL_SERVER_ERROR).send({
    message: OPERATION_FAILED,
  });
}
```

**Response Format**:

```javascript
// Success
{
  data: { ... },
  message: "Success message" // Optional
}

// Error
{
  data: {
    message: "Error message",
    errors: [...] // Optional, for validation errors
  }
}
```

---

## 🔧 Service Layer Pattern

### Service Architecture

**Purpose**: Encapsulate business logic and database operations.

**Key Characteristics**:

- Classes that receive models in constructor
- Pure JavaScript functions (no Express dependencies)
- Throw `AppError` for domain errors
- Return data objects or `{ ok: true/false }` patterns

### Service Examples

#### AuthService (`services/authService.js`)

**Methods**:

- `registerUser({ name, email, phone, password, image })`

  - Checks for existing user
  - Creates new user with hashed password
  - Returns `{ ok: true }`

- `authenticateUser({ email, phone, password })`

  - Finds user by email/phone
  - Verifies password
  - Updates user status and lastLoginAt
  - Generates accessToken and refreshToken
  - Returns `{ ok: true, user, accessToken, refreshToken }`

- `logoutUser(userId)`

  - Updates user status to "logged out"
  - Increments tokenVersion (invalidates tokens)

- `verifyAndRefreshToken(refreshToken)`

  - Verifies refreshToken
  - Checks tokenVersion
  - Generates new accessToken
  - Returns `{ ok: true, accessToken }`

- `createPasswordResetToken(email)`

  - Finds user by email
  - Generates reset token (JWT, 1 hour)
  - Sends email via emailService
  - Returns `{ ok: true }`

- `resetUserPassword(token, newPassword)`
  - Verifies reset token
  - Checks expiry
  - Hashes new password
  - Updates user password and tokenVersion
  - Returns `{ ok: true }`

#### PostService (`services/postService.js`)

**Methods**:

- `createPost({ title, body, status, image, imagePublicId, userId })`

  - Creates new post
  - Returns created post

- `listPosts({ page, limit, search, userId, status })`

  - Builds where clause with filters
  - Applies pagination
  - Includes author information
  - Returns `{ rows, count, page, limit }`

- `findPostWithAuthor(id)`

  - Finds post by ID
  - Includes author information
  - Returns post or null

- `getPostWithComments({ postId, page, limit })`

  - Finds post with author
  - Fetches comments with pagination
  - Returns `{ post, comments, meta }`

- `updatePostForUser({ postId, userId, data })`

  - Finds post
  - Checks ownership (throws if not owner)
  - Updates post
  - Deletes old image from Cloudinary if changed
  - Returns `{ ok: true, post }`

- `deletePostForUser({ postId, userId })`
  - Finds post
  - Checks ownership
  - Deletes image from Cloudinary
  - Deletes post (cascades to comments)
  - Returns `{ ok: true }`

#### CommentService (`services/commentService.js`)

**Methods**:

- `createCommentOrReply({ body, postId, parentId, userId })`

  - Validates postId or parentId
  - Determines final postId (from parent if reply)
  - Creates comment
  - Returns `{ ok: true, comment }`

- `listTopLevelComments({ postId })`

  - Finds comments where parentId is null
  - Optionally filters by postId
  - Includes author and post
  - Returns array of comments

- `findCommentWithRelations(id)`

  - Finds comment with author and post
  - Loads replies separately (avoids complex JOINs)
  - Returns comment with replies attached

- `updateCommentForUser({ id, userId, body })`

  - Finds comment
  - Checks ownership
  - Updates comment body
  - Returns `{ ok: true, comment }`

- `deleteCommentForUser({ id, userId })`
  - Finds comment
  - Checks ownership
  - Deletes comment (cascades to replies)
  - Returns `{ ok: true }`

#### UserService (`services/userService.js`)

**Methods**:

- `listUsers({ page, limit })`

  - Paginated list of users
  - Returns `{ rows, count, page, limit }`

- `findUserById(id)`

  - Finds user by ID
  - Returns user with limited attributes

- `getUserPostsWithComments({ userId, page, limit, search })`

  - Finds user
  - Fetches user's posts with nested comments and replies
  - Applies search filter if provided
  - Returns `{ user, posts: { rows, count }, meta }`

- `updateUserForSelf({ requestedUserId, authUserId, data })`

  - Checks ownership (must be self)
  - Validates email/phone uniqueness if changed
  - Updates user fields
  - Deletes old image from Cloudinary if changed
  - Returns `{ ok: true, user }`

- `deleteUserForSelf({ requestedUserId, authUserId })`
  - Checks ownership
  - Deletes user images from Cloudinary
  - Deletes user (cascades to posts and comments)
  - Returns `{ ok: true }`

#### CloudinaryService (`services/cloudinaryService.js`)

**Methods**:

- `generateUploadSignature(folder)`

  - Generates signed upload parameters
  - Sanitizes folder name (security)
  - Returns `{ signature, timestamp, cloud_name, api_key, folder }`

- `deleteImageFromCloudinary(publicId)`

  - Deletes image from Cloudinary
  - Handles errors gracefully (doesn't throw)
  - Returns deletion result or null

- `extractPublicIdFromUrl(url)`
  - Extracts public_id from Cloudinary URL
  - Handles various URL formats
  - Returns public_id or null

#### EmailService (`services/emailService.js`)

**Methods**:

- `sendPasswordResetEmail(email, resetToken, userName)`
  - Generates reset link
  - Creates HTML email template
  - Sends email via nodemailer
  - Returns `{ success: true, messageId }`

**Features**:

- HTML email templates
- Plain text fallback
- Error handling and logging
- SMTP configuration validation

---

## 🌐 API Endpoints

### Authentication Endpoints (`/auth`)

| Endpoint               | Method | Description            | Auth | Rate Limit  |
| ---------------------- | ------ | ---------------------- | ---- | ----------- |
| `/auth/register`       | POST   | Register new user      | No   | No          |
| `/auth/login`          | POST   | Login user             | No   | Yes (5/min) |
| `/auth/logout`         | POST   | Logout user            | Yes  | No          |
| `/auth/forgotPassword` | POST   | Request password reset | No   | No          |
| `/auth/resetPassword`  | POST   | Reset password         | No   | No          |
| `/auth/refreshToken`   | POST   | Refresh access token   | No   | No          |

### User Endpoints (`/users`)

| Endpoint           | Method | Description                    | Auth            |
| ------------------ | ------ | ------------------------------ | --------------- |
| `/users`           | GET    | List all users (paginated)     | Yes             |
| `/users/me`        | GET    | Get current user profile       | Yes             |
| `/users/:id/posts` | GET    | Get user's posts with comments | Yes             |
| `/users/:id`       | PUT    | Update user profile            | Yes (self only) |
| `/users/:id`       | DELETE | Delete user account            | Yes (self only) |

### Post Endpoints (`/posts`)

| Endpoint                  | Method | Description                      | Auth             |
| ------------------------- | ------ | -------------------------------- | ---------------- |
| `/posts`                  | GET    | List posts (paginated, filtered) | No               |
| `/posts/:id`              | GET    | Get post by ID                   | No               |
| `/posts/:postId/comments` | GET    | Get post comments (paginated)    | No               |
| `/posts`                  | POST   | Create new post                  | Yes              |
| `/posts/:id`              | PUT    | Update post                      | Yes (owner only) |
| `/posts/:id`              | DELETE | Delete post                      | Yes (owner only) |

**Query Parameters** (`GET /posts`):

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)
- `search` - Search in title/body
- `userId` - Filter by user ID
- `status` - Filter by status ("draft" / "published")

### Comment Endpoints (`/comments`)

| Endpoint        | Method | Description                        | Auth             |
| --------------- | ------ | ---------------------------------- | ---------------- |
| `/comments`     | GET    | List comments (filtered by postId) | Yes              |
| `/comments/:id` | GET    | Get comment by ID with replies     | Yes              |
| `/comments`     | POST   | Create comment or reply            | Yes              |
| `/comments/:id` | PUT    | Update comment                     | Yes (owner only) |
| `/comments/:id` | DELETE | Delete comment                     | Yes (owner only) |

**Comment Creation**:

- Top-level comment: `{ body, postId }`
- Reply: `{ body, parentId }` (postId derived from parent)

### Upload Endpoints (`/upload`)

| Endpoint            | Method | Description                     | Auth |
| ------------------- | ------ | ------------------------------- | ---- |
| `/upload/signature` | POST   | Get Cloudinary upload signature | Yes  |

**Request Body**:

```json
{
  "folder": "blog/posts" // Optional, default: "blog"
}
```

**Response**:

```json
{
  "data": {
    "signature": "...",
    "timestamp": 1234567890,
    "cloud_name": "...",
    "api_key": "...",
    "folder": "blog/posts"
  }
}
```

---

## 🚀 Development Guide

### Prerequisites

- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### Environment Setup

1. **Create `.env` file**:

```env
# Database
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=blog_db
DB_HOST=localhost
DB_DIALECT=postgres

# Server
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# JWT
JWT_SECRET=your_secret_key_here

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (for password reset)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=your_email@gmail.com
```

2. **Install Dependencies**:

```bash
cd backend
npm install
```

3. **Run Migrations**:

```bash
npm run db:migrate
# or
npx sequelize db:migrate
```

4. **Start Development Server**:

```bash
npm run dev
```

### Database Migrations

**Run Migrations**:

```bash
npm run db:migrate
```

**Create New Migration**:

```bash
npx sequelize migration:generate --name migration-name
```

**Undo Last Migration**:

```bash
npx sequelize db:migrate:undo
```

**Check Migration Status**:

```bash
npx sequelize db:migrate:status
```

### Adding a New Feature

**Example: Adding a "Like" Feature**

1. **Create Migration**:

```bash
npx sequelize migration:generate --name add-likes-to-posts
```

2. **Define Migration** (`migrations/...add-likes-to-posts.js`):

```javascript
export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn("Posts", "likes", {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    allowNull: false,
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn("Posts", "likes");
}
```

3. **Update Model** (`models/post.js`):

```javascript
likes: {
  type: DataTypes.INTEGER,
  defaultValue: 0,
  allowNull: false,
}
```

4. **Create Validation Schema** (`validations/postValidation.js`):

```javascript
export const likePostSchema = idParamSchema("Post ID");
```

5. **Add Service Method** (`services/postService.js`):

```javascript
async likePost({ postId }) {
  const post = await this.Post.findByPk(postId);
  if (!post) {
    throw new AppError("POST_NOT_FOUND", HTTP_STATUS.NOT_FOUND);
  }
  await post.increment("likes");
  return { ok: true, post };
}
```

6. **Add Controller** (`controllers/postController.js`):

```javascript
export async function like(req, res) {
  const validatedParams = validateRequest(postIdParamSchema, req.params, res);
  if (!validatedParams) return;
  const { id: postId } = validatedParams;

  try {
    const result = await postService.likePost({ postId });
    return res.status(OK).send({
      data: result.post,
      message: "Post liked successfully",
    });
  } catch (err) {
    if (handleAppError(err, res, ERROR_MESSAGES)) return;
    return res.status(INTERNAL_SERVER_ERROR).send({
      message: "Unable to like post",
    });
  }
}
```

7. **Add Route** (`routes/postRoutes.js`):

```javascript
router.post("/:id/like", authenticateToken, like);
```

8. **Add Constants** (`utils/constants.js`):

```javascript
export const SUCCESS_MESSAGES = {
  // ... existing
  POST_LIKED: "Post liked successfully",
};
```

### Code Style Guidelines

**Controller Structure**:

```javascript
export async function actionName(req, res) {
  // 1. Validate request
  const validatedBody = validateRequest(schema, req.body, res);
  if (!validatedBody) return;

  // 2. Extract data
  const { field1, field2 } = validatedBody;
  const { id: userId } = req.user;

  try {
    // 3. Call service
    const result = await service.method({ field1, field2, userId });

    // 4. Send success response
    return res.status(STATUS_CODE).send({
      data: result,
      message: SUCCESS_MESSAGE, // Optional
    });
  } catch (err) {
    // 5. Handle errors
    if (handleAppError(err, res, ERROR_MESSAGES)) return;

    // 6. Fallback error
    console.error(err);
    return res.status(INTERNAL_SERVER_ERROR).send({
      message: ERROR_MESSAGE,
    });
  }
}
```

**Service Structure**:

```javascript
export class ServiceName {
  constructor(models) {
    this.Model = models.Model;
  }

  async methodName({ param1, param2 }) {
    // 1. Validate business rules
    const entity = await this.Model.findByPk(id);
    if (!entity) {
      throw new AppError("ENTITY_NOT_FOUND", HTTP_STATUS.NOT_FOUND);
    }

    // 2. Check authorization
    if (entity.userId !== userId) {
      throw new AppError("CANNOT_UPDATE_OTHER_ENTITY", HTTP_STATUS.FORBIDDEN);
    }

    // 3. Perform operation
    await entity.update({ field: value });

    // 4. Return result
    return { ok: true, entity };
  }
}
```

---

## ✅ Best Practices

### Security Best Practices

1. **Input Validation**

   - Validate all inputs using Joi schemas
   - Strip unknown fields
   - Type conversion where appropriate
   - Sanitize user input (prevent XSS)

2. **Authentication**

   - Use JWT tokens for stateless authentication
   - Short-lived access tokens (15 minutes)
   - Long-lived refresh tokens (7 days)
   - Token versioning for invalidation

3. **Authorization**

   - Check ownership in service layer
   - Use middleware for route protection
   - Never trust client-provided user IDs

4. **Password Security**

   - Hash passwords with bcrypt (10 rounds)
   - Never store plain text passwords
   - Auto-hash via model hooks
   - Exclude password from responses

5. **Rate Limiting**

   - Apply rate limiting to sensitive endpoints
   - Login endpoint: 5 attempts per minute
   - Prevents brute-force attacks

6. **Error Handling**
   - Don't expose internal errors to clients
   - Use consistent error format
   - Log errors for debugging
   - Return appropriate HTTP status codes

### Code Organization Best Practices

1. **Separation of Concerns**

   - Controllers: HTTP handling only
   - Services: Business logic
   - Models: Data structure
   - Routes: Endpoint definitions

2. **Single Responsibility**

   - Each service handles one domain
   - Each controller handles one resource
   - Each route file handles one feature

3. **DRY Principle**

   - Reuse validation schemas
   - Share common utilities
   - Centralize constants
   - Extract common patterns

4. **Error Handling**

   - Use AppError for domain errors
   - Consistent error responses
   - Centralized error messages
   - Proper HTTP status codes

5. **Validation**
   - Validate at controller level
   - Use Joi for schema validation
   - Reuse common schemas
   - Type conversion where needed

### Database Best Practices

1. **Migrations**

   - Use migrations for schema changes
   - Never modify migrations after deployment
   - Test migrations in development
   - Keep migrations small and focused

2. **Associations**

   - Define associations in models
   - Use appropriate cascade options
   - Include related data when needed
   - Avoid N+1 query problems

3. **Queries**

   - Use Sequelize methods (not raw SQL)
   - Include only needed attributes
   - Use pagination for large datasets
   - Index frequently queried fields

4. **Transactions**
   - Use transactions for multi-step operations
   - Rollback on errors
   - Keep transactions short

### API Design Best Practices

1. **RESTful Conventions**

   - Use proper HTTP methods (GET, POST, PUT, DELETE)
   - Use resource-based URLs
   - Return appropriate status codes
   - Consistent response format

2. **Response Format**

   ```javascript
   // Success
   {
     data: { ... },
     message: "Success message" // Optional
   }

   // Error
   {
     data: {
       message: "Error message",
       errors: [...] // Optional, for validation
     }
   }
   ```

3. **Pagination**

   - Always paginate large datasets
   - Include pagination metadata
   - Consistent pagination format
   - Reasonable default limits

4. **Filtering & Search**
   - Support filtering via query parameters
   - Case-insensitive search
   - Multiple filter combinations
   - Document filter options

---

## 📚 Key Files Reference

### Entry Point

- `server.js` - Application bootstrap, middleware setup, server start

### Configuration

- `config.js` - Database configuration for Sequelize
- `src/config/dbConfig.js` - Database initialization

### Routing

- `src/routes/index.js` - Main router (mounts all route modules)
- `src/routes/*.js` - Feature-specific routes

### Controllers

- `src/controllers/authController.js` - Authentication endpoints
- `src/controllers/userController.js` - User management endpoints
- `src/controllers/postController.js` - Post CRUD endpoints
- `src/controllers/commentController.js` - Comment CRUD endpoints
- `src/controllers/uploadController.js` - Cloudinary upload signature

### Services

- `src/services/authService.js` - Authentication business logic
- `src/services/userService.js` - User business logic
- `src/services/postService.js` - Post business logic
- `src/services/commentService.js` - Comment business logic
- `src/services/cloudinaryService.js` - Cloudinary operations
- `src/services/emailService.js` - Email sending

### Models

- `src/models/index.js` - Model loader and associations
- `src/models/user.js` - User model
- `src/models/post.js` - Post model
- `src/models/comment.js` - Comment model

### Middleware

- `src/middleware/authMiddleware.js` - JWT authentication and rate limiting

### Validation

- `src/validations/commonSchemas.js` - Shared validation schemas
- `src/validations/authValidation.js` - Auth schemas
- `src/validations/userValidation.js` - User schemas
- `src/validations/postValidation.js` - Post schemas
- `src/validations/commentValidation.js` - Comment schemas

### Utilities

- `src/utils/constants.js` - Application constants
- `src/utils/errors.js` - Custom error classes
- `src/utils/validations.js` - Validation helper
- `src/utils/jwt.js` - JWT utilities
- `src/utils/bcrypt.js` - Password hashing
- `src/utils/pagination.js` - Pagination helpers

---

## 🔍 Common Patterns

### Pattern 1: Controller → Service → Model

```javascript
// Controller
export async function create(req, res) {
  const validatedBody = validateRequest(schema, req.body, res);
  if (!validatedBody) return;

  const result = await service.create(validatedBody);
  return res.status(CREATED).send({ data: result, message: SUCCESS_MESSAGE });
}

// Service
async create(data) {
  return this.Model.create(data);
}
```

### Pattern 2: Authorization Check

```javascript
// Service
async updateForUser({ id, userId, data }) {
  const entity = await this.Model.findByPk(id);
  if (entity.userId !== userId) {
    throw new AppError("CANNOT_UPDATE_OTHER_ENTITY", HTTP_STATUS.FORBIDDEN);
  }
  await entity.update(data);
  return { ok: true, entity };
}
```

### Pattern 3: Pagination

```javascript
// Service
async list({ page, limit, search }) {
  const { offset } = getPaginationParams({ page, limit });
  const where = {};
  if (search) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${search}%` } },
      { body: { [Op.iLike]: `%${search}%` } },
    ];
  }

  const { rows, count } = await this.Model.findAndCountAll({
    where,
    limit,
    offset,
  });

  return { rows, count, page, limit };
}
```

### Pattern 4: Nested Data Loading

```javascript
// Service
async getWithRelations(id) {
  const entity = await this.Model.findByPk(id, {
    include: [
      {
        model: this.User,
        as: "author",
        attributes: ["id", "name", "email"],
      },
    ],
  });

  // Load nested data separately (avoids complex JOINs)
  const nested = await this.NestedModel.findAll({
    where: { entityId: id },
    include: [{ model: this.User, as: "author" }],
  });

  entity.nested = nested;
  return entity;
}
```

---

## 🐛 Troubleshooting

### Issue: Database Connection Failed

- Check `.env` file has correct database credentials
- Verify PostgreSQL is running
- Check database exists
- Verify network connectivity

### Issue: Migration Errors

- Check migration files are in correct order
- Verify database state matches migration state
- Run `npx sequelize db:migrate:status` to check
- Rollback and re-run if needed

### Issue: JWT Token Invalid

- Check `JWT_SECRET` in `.env`
- Verify token hasn't expired
- Check token type (access vs refresh)
- Verify tokenVersion matches user.tokenVersion

### Issue: Validation Errors

- Check Joi schema matches request structure
- Verify required fields are present
- Check field types match schema
- Review validation error messages

### Issue: Authorization Failures

- Verify `req.user` is set (check middleware)
- Check ownership in service layer
- Verify user ID matches resource owner
- Check token is valid and not expired

---

## 📖 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Sequelize Documentation](https://sequelize.org/)
- [Joi Validation Documentation](https://joi.dev/)
- [JWT.io](https://jwt.io/) - JWT token debugging
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Cloudinary Documentation](https://cloudinary.com/documentation)

---

## 🤝 Contributing

When contributing to this codebase:

1. Follow the layered architecture pattern
2. Write services for business logic
3. Keep controllers thin
4. Validate all inputs
5. Handle errors consistently
6. Write clear, self-documenting code
7. Add comments for complex logic
8. Follow existing code patterns

---

## 📝 Notes

- This backend follows RESTful API conventions
- All services use Sequelize ORM for database operations
- Authentication uses JWT tokens with refresh mechanism
- Password reset uses email tokens with 1-hour expiry
- Image uploads use Cloudinary with signed uploads
- All endpoints return consistent response format
- Error handling is centralized and consistent
- Validation is performed at controller level using Joi

---

**Last Updated**: 2024
**Node Version**: 18+
**Express Version**: 5.1.0
**Sequelize Version**: 6.37.7
