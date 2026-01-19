# Blog Backend - NestJS + TypeORM API

A production-ready RESTful API backend built with NestJS, TypeORM, and PostgreSQL, following modular architecture principles and best practices for security, validation, and maintainability.

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Architecture Overview](#architecture-overview)
- [Request Flow](#request-flow)
- [Key Concepts](#key-concepts)
- [Database Entities & Relationships](#database-entities--relationships)
- [Authentication & Authorization](#authentication--authorization)
- [Validation System](#validation-system)
- [Error Handling](#error-handling)
- [Module System](#module-system)
- [API Endpoints](#api-endpoints)
- [Development Guide](#development-guide)
- [Best Practices](#best-practices)

---

## 🛠 Tech Stack

### Core Framework

- **Node.js** - JavaScript runtime
- **NestJS 11.1.12** - Progressive Node.js framework for building efficient and scalable server-side applications
- **TypeORM 0.3.28** - ORM for PostgreSQL
- **PostgreSQL** - Relational database
- **TypeScript 5.9.3** - Typed superset of JavaScript

### Authentication & Security

- **@nestjs/jwt 11.0.2** - JWT token generation and verification
- **passport-jwt 4.0.1** - JWT authentication strategy
- **bcrypt 6.0.0** - Password hashing
- **@nestjs/throttler 6.5.0** - Rate limiting for brute-force protection
- **helmet 8.1.0** - Security headers middleware
- **cookie-parser 1.4.7** - Cookie parsing middleware

### Validation & Utilities

- **class-validator 0.14.3** - Decorator-based validation library
- **class-transformer 0.5.1** - Object transformation library
- **http-status-codes 2.3.0** - HTTP status code constants
- **dotenv 17.2.3** - Environment variable management

### External Services

- **Cloudinary 2.8.0** - Image upload and management
- **Nodemailer 7.0.11** - Email sending service

### Development Tools

- **ts-node 10.9.2** - TypeScript execution for migrations
- **tsconfig-paths 4.2.0** - Path mapping support
- **@nestjs/cli 11.0.16** - NestJS CLI for project scaffolding

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── main.ts                      # Application entry point
│   ├── app.module.ts                # Root module
│   ├── app.controller.ts            # Root controller
│   ├── app.service.ts               # Root service
│   │
│   ├── config/                      # Configuration modules
│   │   ├── database.config.ts       # Database configuration
│   │   ├── database.module.ts      # Database module
│   │   └── dataSource.ts            # TypeORM DataSource for migrations
│   │
│   ├── entities/                   # TypeORM entities (database schema)
│   │   ├── BaseEntity.ts           # Base entity with timestamps
│   │   ├── User.ts                 # User entity
│   │   ├── Post.ts                 # Post entity
│   │   └── Comment.ts              # Comment entity
│   │
│   ├── auth/                        # Authentication module
│   │   ├── auth.module.ts          # Auth module definition
│   │   ├── auth.controller.ts      # Auth endpoints
│   │   ├── auth.service.ts         # Auth business logic
│   │   ├── guards/
│   │   │   └── auth.guard.ts       # JWT authentication guard
│   │   ├── decorators/
│   │   │   └── public.decorator.ts # Public route decorator
│   │   ├── pipes/
│   │   │   └── email-or-phone.pipe.ts # Custom validation pipe
│   │   └── dto/                    # Data Transfer Objects
│   │       ├── sign-up.dto.ts
│   │       ├── sign-in.dto.ts
│   │       ├── refresh-token.dto.ts
│   │       ├── forgot-password.dto.ts
│   │       └── reset-password.dto.ts
│   │
│   ├── users/                       # Users module
│   │   ├── users.module.ts         # Users module definition
│   │   ├── users.controller.ts     # User endpoints
│   │   ├── users.service.ts        # User business logic
│   │   └── dto/                    # User DTOs
│   │       ├── list-users-query.dto.ts
│   │       ├── update-user.dto.ts
│   │       └── get-user-posts-query.dto.ts
│   │
│   ├── posts/                       # Posts module
│   │   ├── posts.module.ts         # Posts module definition
│   │   ├── posts.controller.ts     # Post endpoints
│   │   ├── posts.service.ts        # Post business logic
│   │   └── dto/                    # Post DTOs
│   │       ├── create-post.dto.ts
│   │       ├── update-post.dto.ts
│   │       ├── list-posts-query.dto.ts
│   │       └── pagination-query.dto.ts
│   │
│   ├── comments/                    # Comments module
│   │   ├── comments.module.ts      # Comments module definition
│   │   ├── comments.controller.ts   # Comment endpoints
│   │   ├── comments.service.ts     # Comment business logic
│   │   └── dto/                    # Comment DTOs
│   │       ├── create-comment.dto.ts
│   │       ├── update-comment.dto.ts
│   │       └── list-comments-query.dto.ts
│   │
│   ├── common/                      # Shared/common module
│   │   ├── common.module.ts        # Common module definition
│   │   ├── decorators/
│   │   │   └── user.decorator.ts   # @User() decorator for extracting user
│   │   ├── exceptions/
│   │   │   └── app.exception.ts    # Custom exception class
│   │   └── filters/
│   │       └── http-exception.filter.ts # Global exception filter
│   │
│   ├── shared/                      # Shared utilities and services
│   │   ├── constants/
│   │   │   └── constants.ts        # Application constants
│   │   ├── services/
│   │   │   ├── cloudinary.service.ts # Cloudinary operations
│   │   │   └── email.service.ts     # Email sending service
│   │   └── utils/
│   │       ├── bcrypt.ts            # Password hashing utilities
│   │       ├── mappers.ts           # Data mapping utilities
│   │       └── pagination.ts        # Pagination helpers
│   │
│   ├── interfaces/                  # TypeScript interfaces
│   │   ├── index.ts                # Barrel export
│   │   ├── commonInterface.ts      # Common interfaces
│   │   ├── authInterface.ts        # Auth interfaces
│   │   ├── userInterface.ts        # User interfaces
│   │   ├── postInterface.ts        # Post interfaces
│   │   ├── commentInterface.ts     # Comment interfaces
│   │   └── cloudinaryInterface.ts  # Cloudinary interfaces
│   │
│   └── migrations/                  # TypeORM migrations
│       ├── 1735123456789-InitialSchema.ts
│       └── 1768772111000-RemoveTimestampDefaults.ts
│
├── package.json                     # Dependencies and scripts
├── tsconfig.json                    # TypeScript configuration
├── nest-cli.json                   # NestJS CLI configuration
└── .env                            # Environment variables
```

---

## 🏗 Architecture Overview

### Modular Architecture Pattern

The backend follows NestJS's **modular architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────┐
│         HTTP Request                     │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Main Application (main.ts)             │
│  - Global middleware (Helmet, CORS)     │
│  - Global pipes (ValidationPipe)         │
│  - Global filters (ExceptionFilter)     │
│  - Global guards (AuthGuard, Throttler) │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Module Layer                           │
│  - AuthModule                           │
│  - UsersModule                          │
│  - PostsModule                          │
│  - CommentsModule                       │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Controller Layer                       │
│  - Request handling                     │
│  - DTO validation (automatic)          │
│  - Response formatting                  │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Service Layer                          │
│  - Business logic                       │
│  - Database operations (TypeORM)         │
│  - External service integration         │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Entity Layer (TypeORM)                 │
│  - Database schema                      │
│  - Relationships                        │
│  - Data access                          │
└─────────────────────────────────────────┘
```

### Design Principles

1. **Modular Architecture**
   - Each feature is a self-contained module
   - Modules can import and export providers
   - Clear dependency injection

2. **Separation of Concerns**
   - **Controllers**: Handle HTTP requests/responses
   - **Services**: Contain business logic, database operations
   - **Entities**: Define data structure and relationships
   - **DTOs**: Define data transfer objects with validation

3. **Dependency Injection**
   - Services injected via constructor
   - TypeORM repositories injected via `@InjectRepository()`
   - Shared services available across modules

4. **Security First**
   - Global authentication guard (opt-out with `@Public()`)
   - Rate limiting via ThrottlerGuard
   - Input validation via ValidationPipe
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
2. Main Application (main.ts)
   - Helmet middleware (security headers)
   - CORS configuration
   - Cookie parser
   │
   ▼
3. Global Guards (app.module.ts)
   - AuthGuard: Verifies JWT token
   - ThrottlerGuard: Rate limiting
   │
   ▼
4. Controller (posts.controller.ts)
   @Post()
   @UseGuards(AuthGuard) // Optional, already global
   create(@Body() createPostDto: CreatePostDto, @User() user)
   │
   ▼
5. ValidationPipe (automatic)
   - Validates CreatePostDto using class-validator decorators
   - Transforms payload to DTO instance
   - Strips unknown properties
   │
   ▼
6. Service (posts.service.ts)
   createPost({ authUserId, data })
   - Uses TypeORM repository
   - Creates post entity
   - Returns created post
   │
   ▼
7. Controller Response
   - Formats response
   - Sends HTTP 201 Created
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
    ├─► Main Application (main.ts)
    │   ├─► Helmet (security)
    │   ├─► CORS
    │   ├─► Cookie Parser
    │   └─► Global Pipes & Filters
    │
    ├─► Global Guards (app.module.ts)
    │   ├─► AuthGuard (JWT verification)
    │   └─► ThrottlerGuard (rate limiting)
    │
    ├─► Module Router
    │   └─► Feature Module (e.g., PostsModule)
    │
    ├─► Controller (e.g., PostsController)
    │   ├─► DTO Validation (automatic via ValidationPipe)
    │   ├─► Extract Data (@Body(), @Param(), @User())
    │   └─► Call Service
    │
    ├─► Service (e.g., PostsService)
    │   ├─► Business Logic
    │   ├─► Database Operations (TypeORM Repository)
    │   ├─► External Services (Cloudinary, Email)
    │   └─► Return Result
    │
    ├─► Controller Response
    │   ├─► Format Response
    │   └─► Send HTTP Response
    │
    └─► Exception Filter (if error)
        ├─► Format Error Response
        └─► Send HTTP Error Response
```

---

## 🔑 Key Concepts

### 1. Module System

**Purpose**: Organize code into feature modules with clear boundaries.

**Module Structure**:

```typescript
@Module({
  imports: [
    TypeOrmModule.forFeature([Entity]), // Register entities
    OtherModule, // Import other modules
  ],
  controllers: [FeatureController],
  providers: [FeatureService],
  exports: [FeatureService], // Export for other modules
})
export class FeatureModule {}
```

**Benefits**:
- Clear feature boundaries
- Dependency injection
- Reusable providers
- Lazy loading support

### 2. Dependency Injection

**Purpose**: Inject dependencies via constructor, promoting testability and maintainability.

**Example**:

```typescript
@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async createPost(data: CreatePostDto) {
    return this.postRepository.save(data);
  }
}
```

### 3. DTOs (Data Transfer Objects)

**Purpose**: Define and validate data structures for requests/responses.

**Example**:

```typescript
export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 200)
  title: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 5000)
  body: string;

  @IsEnum(PostStatus)
  @IsOptional()
  status?: PostStatus;
}
```

**Features**:
- Automatic validation via `class-validator`
- Type transformation via `class-transformer`
- Whitelist unknown properties
- Custom validation decorators

### 4. Guards

**Purpose**: Protect routes and control access.

**Types**:
- **AuthGuard**: JWT token verification
- **ThrottlerGuard**: Rate limiting
- **Custom Guards**: Domain-specific authorization

**Example**:

```typescript
@Controller('posts')
export class PostsController {
  @Post()
  @Public() // Opt-out of global auth guard
  create(@Body() dto: CreatePostDto) {
    // Public endpoint
  }

  @Put(':id')
  // AuthGuard applied globally, no decorator needed
  update(@Param('id') id: number, @Body() dto: UpdatePostDto) {
    // Protected endpoint
  }
}
```

### 5. Pipes

**Purpose**: Transform and validate data before it reaches the controller.

**Built-in Pipes**:
- **ValidationPipe**: Validates DTOs using `class-validator`
- **ParseIntPipe**: Converts string to integer
- **ParseBoolPipe**: Converts string to boolean

**Custom Pipe Example**:

```typescript
@Injectable()
export class EmailOrPhonePipe implements PipeTransform {
  transform(value: any) {
    // Custom transformation logic
    return value;
  }
}
```

### 6. Exception Filters

**Purpose**: Catch and format exceptions consistently.

**Global Exception Filter**:

```typescript
@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    // Format error response
    // Log error
    // Send HTTP response
  }
}
```

---

## 🗄 Database Entities & Relationships

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
                    │ createdAt   │
                    │ updatedAt   │
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
│ createdAt   │    │ createdAt   │
│ updatedAt   │    │ updatedAt   │
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

### Entity Definitions

#### User Entity (`entities/User.ts`)

**Fields**:
- `id` - Primary key (auto-increment)
- `name` - User's full name
- `email` - Unique email address
- `phone` - Unique phone number
- `password` - Hashed password (bcrypt, excluded from queries by default)
- `status` - User status
- `image` - Profile image URL (Cloudinary)
- `imagePublicId` - Cloudinary public_id for deletion
- `lastLoginAt` - Last login timestamp
- `tokenVersion` - Token version for invalidation
- `createdAt` - Creation timestamp (from BaseEntity)
- `updatedAt` - Update timestamp (from BaseEntity)

**Relations**:
- `@OneToMany(() => Post, post => post.author)` - User can have many posts
- `@OneToMany(() => Comment, comment => comment.author)` - User can have many comments

**Security**:
- `toJSON()` method excludes password from responses
- Password field has `select: false` by default

#### Post Entity (`entities/Post.ts`)

**Fields**:
- `id` - Primary key
- `userId` - Foreign key to User
- `title` - Post title
- `body` - Post content (TEXT)
- `status` - Post status enum ("draft" / "published")
- `image` - Post image URL (Cloudinary)
- `imagePublicId` - Cloudinary public_id for deletion
- `createdAt` - Creation timestamp (from BaseEntity)
- `updatedAt` - Update timestamp (from BaseEntity)

**Relations**:
- `@ManyToOne(() => User, user => user.posts)` - Post belongs to one user (author)
- `@OneToMany(() => Comment, comment => comment.post)` - Post can have many comments

#### Comment Entity (`entities/Comment.ts`)

**Fields**:
- `id` - Primary key
- `userId` - Foreign key to User (comment author)
- `postId` - Foreign key to Post
- `parentId` - Foreign key to Comment (for replies, nullable)
- `body` - Comment content (TEXT)
- `createdAt` - Creation timestamp (from BaseEntity)
- `updatedAt` - Update timestamp (from BaseEntity)

**Relations**:
- `@ManyToOne(() => User, user => user.comments)` - Comment belongs to one user (author)
- `@ManyToOne(() => Post, post => post.comments)` - Comment belongs to one post
- `@ManyToOne(() => Comment, comment => comment.replies)` - Comment can have a parent (for replies)
- `@OneToMany(() => Comment, comment => comment.parent)` - Comment can have many replies

**Nested Comments**:
- Top-level comments: `parentId = null`
- Replies: `parentId = parent comment id`
- Cascading delete: Deleting a comment deletes all replies

#### BaseEntity (`entities/BaseEntity.ts`)

**Purpose**: Provides common timestamp fields for all entities.

```typescript
export abstract class BaseEntity {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

---

## 🔐 Authentication & Authorization

### JWT Token System

**Token Types**:

1. **Access Token**
   - Expires in: 15 minutes
   - Contains: `userId`, `email`, `tokenVersion`, `type: "access"`
   - Used for: API requests
   - Stored: Client-side

2. **Refresh Token**
   - Expires in: 7 days
   - Contains: `userId`, `tokenVersion`, `type: "refresh"`
   - Used for: Getting new access tokens
   - Stored: Client-side

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
2. DTO validation (class-validator)
3. Check if email/phone exists
4. Hash password (bcrypt)
5. Create user
6. Return success message
```

**Login**:
```
1. User submits: { email/phone, password }
2. DTO validation
3. Find user by email/phone
4. Compare password (bcrypt)
5. Update user status and lastLoginAt
6. Generate accessToken (15min) + refreshToken (7days)
7. Return tokens + user data
```

**Token Refresh**:
```
1. User submits: { refreshToken }
2. DTO validation
3. Verify refreshToken signature
4. Check token type === "refresh"
5. Verify tokenVersion matches user.tokenVersion
6. Generate new accessToken
7. Return new accessToken
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

```typescript
// Pattern used in services
async updatePostForUser({ postId, userId, data }) {
  const post = await this.postRepository.findOne({ where: { id: postId } });

  // Check ownership
  if (post.userId !== userId) {
    throw new AppException('CANNOT_UPDATE_OTHER_POST', HttpStatus.FORBIDDEN);
  }

  // Proceed with update
  await this.postRepository.update(postId, data);
  return { ok: true, post };
}
```

**Protected Routes**:

```typescript
// Routes with authentication (global by default)
@Controller('posts')
export class PostsController {
  @Post()
  // AuthGuard applied globally, no decorator needed
  create(@Body() dto: CreatePostDto, @User() user) {
    // Protected endpoint
  }

  @Get()
  @Public() // Opt-out of global auth guard
  findAll() {
    // Public endpoint
  }
}
```

---

## ✅ Validation System

### Validation Architecture

**Components**:
1. **DTOs** (`dto/`): Define data structures with `class-validator` decorators
2. **ValidationPipe**: Global pipe that validates DTOs automatically
3. **Custom Pipes**: Domain-specific validation logic

### Validation Layers

**1. DTO Validation** (automatic):

```typescript
export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 200)
  title: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 5000)
  body: string;

  @IsEnum(PostStatus)
  @IsOptional()
  status?: PostStatus;
}
```

**2. Custom Validation Pipe**:

```typescript
@Injectable()
export class EmailOrPhonePipe implements PipeTransform {
  transform(value: any) {
    // Custom validation logic
    if (!value.email && !value.phone) {
      throw new BadRequestException('Email or phone is required');
    }
    return value;
  }
}
```

**Features**:
- Automatic validation via `ValidationPipe`
- Type transformation
- Strips unknown properties
- Custom validation decorators
- Consistent error format

---

## ⚠️ Error Handling

### Error Handling Architecture

**Components**:
1. **AppException Class** (`common/exceptions/app.exception.ts`): Custom exception with code and status
2. **AppExceptionFilter** (`common/filters/http-exception.filter.ts`): Global exception filter
3. **Constants** (`shared/constants/constants.ts`): Centralized error messages

### Error Types

**1. Validation Errors** (400 Bad Request):
```json
{
  "statusCode": 400,
  "message": ["title must be a string", "body should not be empty"],
  "error": "Bad Request"
}
```

**2. Authentication Errors** (401 Unauthorized):
```json
{
  "statusCode": 401,
  "message": "Invalid token",
  "error": "Unauthorized"
}
```

**3. Authorization Errors** (403 Forbidden):
```json
{
  "statusCode": 403,
  "message": "You can only update your own posts",
  "error": "Forbidden"
}
```

**4. Not Found Errors** (404 Not Found):
```json
{
  "statusCode": 404,
  "message": "Post not found",
  "error": "Not Found"
}
```

**5. Business Logic Errors** (422 Unprocessable Entity):
```json
{
  "statusCode": 422,
  "message": "User with that email or phone already exists",
  "error": "Unprocessable Entity"
}
```

**6. Server Errors** (500 Internal Server Error):
```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

### Error Handling Pattern

**Service Layer**:

```typescript
// Services throw AppException
if (!user) {
  throw new AppException('USER_NOT_FOUND', HttpStatus.NOT_FOUND);
}

if (user.id !== authUserId) {
  throw new AppException('CANNOT_UPDATE_OTHER_USER', HttpStatus.FORBIDDEN);
}
```

**Global Exception Filter**:

```typescript
@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    // Format error response
    // Log error
    // Send HTTP response
  }
}
```

---

## 🔧 Module System

### Module Architecture

**Purpose**: Organize code into feature modules with clear boundaries.

**Module Structure**:

```typescript
@Module({
  imports: [
    TypeOrmModule.forFeature([Entity]), // Register entities
    OtherModule, // Import other modules
  ],
  controllers: [FeatureController],
  providers: [FeatureService, OtherService],
  exports: [FeatureService], // Export for other modules
})
export class FeatureModule {}
```

### Module Examples

#### AuthModule (`auth/auth.module.ts`)

```typescript
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, EmailService],
  exports: [AuthService],
})
export class AuthModule {}
```

#### PostsModule (`posts/posts.module.ts`)

```typescript
@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    CommonModule, // For shared services
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
```

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
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=blogdb

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
npm run migration:run
```

4. **Start Development Server**:

```bash
npm run start:dev
```

### Database Migrations

**Run Migrations**:

```bash
npm run migration:run
```

**Create New Migration**:

```bash
npm run migration:generate -- -n MigrationName
```

**Revert Last Migration**:

```bash
npm run migration:revert
```

**Show Migration Status**:

```bash
npm run migration:show
```

### Adding a New Feature

**Example: Adding a "Like" Feature**

1. **Create Migration**:

```bash
npm run migration:generate -- -n AddLikesToPosts
```

2. **Define Migration** (`migrations/...AddLikesToPosts.ts`):

```typescript
import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddLikesToPosts1234567890 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'Posts',
      new TableColumn({
        name: 'likes',
        type: 'integer',
        default: 0,
        isNullable: false,
      }),
    );
}

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('Posts', 'likes');
  }
}
```

3. **Update Entity** (`entities/Post.ts`):

```typescript
@Column({ type: 'integer', default: 0 })
likes: number;
```

4. **Create DTO** (`posts/dto/like-post.dto.ts`):

```typescript
export class LikePostDto {
  @IsNumber()
  @IsNotEmpty()
  postId: number;
}
```

5. **Add Service Method** (`posts/posts.service.ts`):

```typescript
async likePost(postId: number) {
  const post = await this.postRepository.findOne({ where: { id: postId } });
  if (!post) {
    throw new AppException('POST_NOT_FOUND', HttpStatus.NOT_FOUND);
  }
  post.likes += 1;
  await this.postRepository.save(post);
  return post;
}
```

6. **Add Controller Method** (`posts/posts.controller.ts`):

```typescript
@Post(':id/like')
async like(@Param('id', ParseIntPipe) id: number) {
  const post = await this.postsService.likePost(id);
  return { data: post, message: 'Post liked successfully' };
  }
```

### Code Style Guidelines

**Controller Structure**:

```typescript
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  async create(@Body() dto: CreatePostDto, @User() user) {
    const post = await this.postsService.createPost({
      authUserId: user.id,
      data: dto,
    });
    return { data: post, message: 'Post created successfully' };
  }
}
```

**Service Structure**:

```typescript
@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async createPost({ authUserId, data }) {
    // Business logic
    const post = this.postRepository.create({
      ...data,
      userId: authUserId,
    });
    return this.postRepository.save(post);
  }
}
```

---

## ✅ Best Practices

### Security Best Practices

1. **Input Validation**
   - Validate all inputs using DTOs with `class-validator`
   - Use `ValidationPipe` globally
   - Strip unknown properties
   - Type conversion where appropriate

2. **Authentication**
   - Use JWT tokens for stateless authentication
   - Short-lived access tokens (15 minutes)
   - Long-lived refresh tokens (7 days)
   - Token versioning for invalidation

3. **Authorization**
   - Check ownership in service layer
   - Use guards for route protection
   - Never trust client-provided user IDs
   - Use `@User()` decorator to extract authenticated user

4. **Password Security**
   - Hash passwords with bcrypt (10 rounds)
   - Never store plain text passwords
   - Exclude password from entity queries by default

5. **Rate Limiting**
   - Apply rate limiting via ThrottlerGuard
   - Login endpoint: 5 attempts per minute
   - Prevents brute-force attacks

6. **Error Handling**
   - Don't expose internal errors to clients
   - Use consistent error format
   - Log errors for debugging
   - Return appropriate HTTP status codes

### Code Organization Best Practices

1. **Modular Architecture**
   - Each feature is a self-contained module
   - Clear module boundaries
   - Dependency injection

2. **Separation of Concerns**
   - Controllers: HTTP handling only
   - Services: Business logic
   - Entities: Data structure
   - DTOs: Data validation

3. **DRY Principle**
   - Reuse DTOs
   - Share common services
   - Centralize constants
   - Extract common patterns

4. **Error Handling**
   - Use AppException for domain errors
   - Consistent error responses
   - Centralized error messages
   - Proper HTTP status codes

5. **Validation**
   - Validate at DTO level
   - Use `class-validator` decorators
   - Reuse common validation patterns
   - Type conversion where needed

### Database Best Practices

1. **Migrations**
   - Use migrations for schema changes
   - Never modify migrations after deployment
   - Test migrations in development
   - Keep migrations small and focused

2. **Relations**
   - Define relations in entities
   - Use appropriate cascade options
   - Include related data when needed
   - Avoid N+1 query problems

3. **Queries**
   - Use TypeORM repositories
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
   ```typescript
   // Success
   {
     data: { ... },
     message: "Success message" // Optional
   }

   // Error (handled by exception filter)
   {
     statusCode: 400,
       message: "Error message",
     error: "Bad Request"
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

- `src/main.ts` - Application bootstrap, middleware setup, server start

### Configuration

- `src/config/database.config.ts` - Database configuration
- `src/config/database.module.ts` - Database module
- `src/config/dataSource.ts` - TypeORM DataSource for migrations

### Modules

- `src/app.module.ts` - Root module
- `src/auth/auth.module.ts` - Authentication module
- `src/users/users.module.ts` - Users module
- `src/posts/posts.module.ts` - Posts module
- `src/comments/comments.module.ts` - Comments module
- `src/common/common.module.ts` - Common/shared module

### Controllers

- `src/auth/auth.controller.ts` - Authentication endpoints
- `src/users/users.controller.ts` - User management endpoints
- `src/posts/posts.controller.ts` - Post CRUD endpoints
- `src/comments/comments.controller.ts` - Comment CRUD endpoints

### Services

- `src/auth/auth.service.ts` - Authentication business logic
- `src/users/users.service.ts` - User business logic
- `src/posts/posts.service.ts` - Post business logic
- `src/comments/comments.service.ts` - Comment business logic
- `src/shared/services/cloudinary.service.ts` - Cloudinary operations
- `src/shared/services/email.service.ts` - Email sending

### Entities

- `src/entities/BaseEntity.ts` - Base entity with timestamps
- `src/entities/User.ts` - User entity
- `src/entities/Post.ts` - Post entity
- `src/entities/Comment.ts` - Comment entity

### Guards & Filters

- `src/auth/guards/auth.guard.ts` - JWT authentication guard
- `src/common/filters/http-exception.filter.ts` - Global exception filter

### DTOs

- `src/auth/dto/*.ts` - Authentication DTOs
- `src/users/dto/*.ts` - User DTOs
- `src/posts/dto/*.ts` - Post DTOs
- `src/comments/dto/*.ts` - Comment DTOs

### Utilities

- `src/shared/constants/constants.ts` - Application constants
- `src/shared/utils/bcrypt.ts` - Password hashing
- `src/shared/utils/mappers.ts` - Data mapping utilities
- `src/shared/utils/pagination.ts` - Pagination helpers

---

## 🔍 Common Patterns

### Pattern 1: Controller → Service → Repository

```typescript
// Controller
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  async create(@Body() dto: CreatePostDto, @User() user) {
    const post = await this.postsService.createPost({
      authUserId: user.id,
      data: dto,
    });
    return { data: post, message: 'Post created successfully' };
  }
}

// Service
@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async createPost({ authUserId, data }) {
    const post = this.postRepository.create({
      ...data,
      userId: authUserId,
    });
    return this.postRepository.save(post);
  }
}
```

### Pattern 2: Authorization Check

```typescript
// Service
async updatePostForUser({ postId, userId, data }) {
  const post = await this.postRepository.findOne({ where: { id: postId } });
  if (post.userId !== userId) {
    throw new AppException('CANNOT_UPDATE_OTHER_POST', HttpStatus.FORBIDDEN);
  }
  await this.postRepository.update(postId, data);
  return { ok: true, post };
}
```

### Pattern 3: Pagination

```typescript
// Service
async listPosts({ page, limit, search }) {
  const queryBuilder = this.postRepository.createQueryBuilder('post');

  if (search) {
    queryBuilder.where(
      '(post.title ILIKE :search OR post.body ILIKE :search)',
      { search: `%${search}%` },
    );
  }

  const [posts, total] = await queryBuilder
    .skip((page - 1) * limit)
    .take(limit)
    .getManyAndCount();

  return {
    rows: posts,
    meta: {
      total,
      page,
      limit,
      pagination: Math.ceil(total / limit),
    },
  };
}
```

### Pattern 4: Nested Data Loading

```typescript
// Service
async getPostWithComments(postId: number) {
  const post = await this.postRepository.findOne({
    where: { id: postId },
    relations: ['author'],
  });

  // Load comments separately (avoids complex JOINs)
  const comments = await this.commentRepository.find({
    where: { postId },
    relations: ['author'],
  });

  return { ...post, comments };
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
- Run `npm run migration:show` to check status
- Rollback and re-run if needed

### Issue: JWT Token Invalid

- Check `JWT_SECRET` in `.env`
- Verify token hasn't expired
- Check token type (access vs refresh)
- Verify tokenVersion matches user.tokenVersion

### Issue: Validation Errors

- Check DTO decorators match request structure
- Verify required fields are present
- Check field types match DTO
- Review validation error messages

### Issue: Authorization Failures

- Verify `@User()` decorator is used correctly
- Check ownership in service layer
- Verify user ID matches resource owner
- Check token is valid and not expired

---

## 📖 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [class-validator Documentation](https://github.com/typestack/class-validator)
- [JWT.io](https://jwt.io/) - JWT token debugging
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Cloudinary Documentation](https://cloudinary.com/documentation)

---

## 🤝 Contributing

When contributing to this codebase:

1. Follow the modular architecture pattern
2. Write services for business logic
3. Keep controllers thin
4. Validate all inputs using DTOs
5. Handle errors consistently
6. Write clear, self-documenting code
7. Add comments for complex logic
8. Follow existing code patterns

---

## 📝 Notes

- This backend follows RESTful API conventions
- All services use TypeORM for database operations
- Authentication uses JWT tokens with refresh mechanism
- Password reset uses email tokens with 1-hour expiry
- Image uploads use Cloudinary with signed uploads
- All endpoints return consistent response format
- Error handling is centralized via exception filter
- Validation is performed automatically via ValidationPipe and DTOs

---

**Last Updated**: 2025
**Node Version**: 18+
**NestJS Version**: 11.1.12
**TypeORM Version**: 0.3.28
