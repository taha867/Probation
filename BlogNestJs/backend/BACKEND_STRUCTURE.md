# Backend Code Structure Guide

## 🚀 Where Does the Backend Code Start?

### Entry Point: `src/main.ts`

The backend starts from **`src/main.ts`** when you run:
```bash
npm run start:dev
```

The `bootstrap()` function is the **first function that executes**.

---

## 📍 Code Execution Flow

### Step 1: Application Bootstrap (`src/main.ts`)

```typescript
async function bootstrap() {
  // 1. Load environment variables (.env file)
  dotenv.config();
  
  // 2. Create NestJS application instance
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // 3. Apply global middleware
  app.use(helmet());        // Security headers
  app.use(cookieParser());   // Cookie parsing
  
  // 4. Configure CORS
  app.enableCors({ ... });
  
  // 5. Apply global ValidationPipe (validates ALL DTOs automatically)
  app.useGlobalPipes(new ValidationPipe({ ... }));
  
  // 6. Apply global Exception Filter (catches all errors)
  app.useGlobalFilters(new AppExceptionFilter());
  
  // 7. Start HTTP server
  await app.listen(3000);
}
```

**What happens:**
- Loads `.env` file
- Creates NestJS app using `AppModule`Z
- Applies security middleware
- Sets up automatic validation
- Starts listening on port 3000

---

### Step 2: Root Module Loading (`src/app.module.ts`)

When `NestFactory.create(AppModule)` is called, NestJS loads the root module:

```typescript
@Module({
  imports: [
    DatabaseModule,    // ← Database connection (TypeORM)
    CommonModule,      // ← Shared utilities
    AuthModule,        // ← Authentication routes (/auth/*)
    UsersModule,       // ← User routes (/users/*)
    PostsModule,       // ← Post routes (/posts/*)
    CommentsModule,    // ← Comment routes (/comments/*)
    ThrottlerModule,   // ← Rate limiting
  ],
  controllers: [AppController],  // ← Root controller (/)
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,        // ← Global: ALL routes protected by default
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,    // ← Global: Rate limits ALL routes
    },
  ],
})
export class AppModule {}
```

**What happens:**
- Imports all feature modules
- Registers global guards (AuthGuard, ThrottlerGuard)
- Sets up database connection
- Registers all controllers and routes

---

## 🏗 Complete Backend Structure

```
backend/
│
├── src/
│   │
│   ├── main.ts                    ⭐ ENTRY POINT - Starts here!
│   │   └── bootstrap()            ← First function executed
│   │
│   ├── app.module.ts              ⭐ ROOT MODULE - Imports all modules
│   │   └── @Module({ imports: [...] })
│   │
│   ├── app.controller.ts          ← Root controller (GET /)
│   ├── app.service.ts             ← Root service
│   │
│   ├── config/                    ← Configuration
│   │   ├── database.module.ts     ← Database setup (TypeORM)
│   │   ├── database.config.ts     ← DB connection config
│   │   └── dataSource.ts          ← Migration DataSource
│   │
│   ├── entities/                  ← Database schemas (TypeORM)
│   │   ├── BaseEntity.ts          ← Common fields (createdAt, updatedAt)
│   │   ├── User.ts                ← User table schema
│   │   ├── Post.ts                ← Post table schema
│   │   └── Comment.ts             ← Comment table schema
│   │
│   ├── auth/                      ← Authentication Module
│   │   ├── auth.module.ts         ← Module definition
│   │   ├── auth.controller.ts     ← Routes: /auth/*
│   │   │   ├── POST /auth/register
│   │   │   ├── POST /auth/login
│   │   │   ├── POST /auth/logout
│   │   │   ├── POST /auth/refreshToken
│   │   │   ├── POST /auth/forgotPassword
│   │   │   └── POST /auth/resetPassword
│   │   ├── auth.service.ts        ← Business logic
│   │   ├── guards/
│   │   │   └── auth.guard.ts      ← JWT authentication guard
│   │   ├── decorators/
│   │   │   └── public.decorator.ts ← @Public() decorator
│   │   ├── pipes/
│   │   │   └── email-or-phone.pipe.ts ← Custom validation pipe
│   │   └── dto/                   ← Validation schemas
│   │       ├── sign-up.dto.ts
│   │       ├── sign-in.dto.ts
│   │       ├── refresh-token.dto.ts
│   │       ├── forgot-password.dto.ts
│   │       └── reset-password.dto.ts
│   │
│   ├── users/                     ← Users Module
│   │   ├── users.module.ts
│   │   ├── users.controller.ts    ← Routes: /users/*
│   │   │   ├── GET /users
│   │   │   ├── GET /users/me
│   │   │   ├── GET /users/:id/posts
│   │   │   ├── PUT /users/:id
│   │   │   └── DELETE /users/:id
│   │   ├── users.service.ts
│   │   └── dto/
│   │       ├── list-users-query.dto.ts
│   │       ├── update-user.dto.ts
│   │       └── get-user-posts-query.dto.ts
│   │
│   ├── posts/                     ← Posts Module
│   │   ├── posts.module.ts
│   │   ├── posts.controller.ts    ← Routes: /posts/*
│   │   │   ├── GET /posts
│   │   │   ├── GET /posts/:id
│   │   │   ├── GET /posts/:postId/comments
│   │   │   ├── POST /posts
│   │   │   ├── PUT /posts/:id
│   │   │   └── DELETE /posts/:id
│   │   ├── posts.service.ts
│   │   └── dto/
│   │       ├── create-post.dto.ts
│   │       ├── update-post.dto.ts
│   │       ├── list-posts-query.dto.ts
│   │       └── pagination-query.dto.ts
│   │
│   ├── comments/                  ← Comments Module
│   │   ├── comments.module.ts
│   │   ├── comments.controller.ts ← Routes: /comments/*
│   │   │   ├── GET /comments
│   │   │   ├── GET /comments/:id
│   │   │   ├── POST /comments
│   │   │   ├── PUT /comments/:id
│   │   │   └── DELETE /comments/:id
│   │   ├── comments.service.ts
│   │   └── dto/
│   │       ├── create-comment.dto.ts
│   │       ├── update-comment.dto.ts
│   │       └── list-comments-query.dto.ts
│   │
│   ├── common/                    ← Shared/Common Module
│   │   ├── common.module.ts
│   │   ├── decorators/
│   │   │   └── user.decorator.ts  ← @User() decorator (extracts user from JWT)
│   │   ├── exceptions/
│   │   │   └── app.exception.ts   ← Custom exception class
│   │   └── filters/
│   │       └── http-exception.filter.ts ← Global exception filter
│   │
│   ├── shared/                     ← Shared Services & Utilities
│   │   ├── constants/
│   │   │   └── constants.ts       ← Application constants
│   │   ├── services/
│   │   │   ├── cloudinary.service.ts ← Image upload service
│   │   │   └── email.service.ts    ← Email sending service
│   │   └── utils/
│   │       ├── bcrypt.ts           ← Password hashing
│   │       ├── mappers.ts          ← Data mapping utilities
│   │       └── pagination.ts       ← Pagination helpers
│   │
│   ├── interfaces/                 ← TypeScript interfaces
│   │   ├── index.ts               ← Barrel export
│   │   ├── commonInterface.ts
│   │   ├── authInterface.ts
│   │   ├── userInterface.ts
│   │   ├── postInterface.ts
│   │   ├── commentInterface.ts
│   │   └── cloudinaryInterface.ts
│   │
│   └── migrations/                 ← Database migrations (TypeORM)
│       ├── 1735123456789-InitialSchema.ts
│       └── 1768772111000-RemoveTimestampDefaults.ts
│
├── package.json                    ← Dependencies & scripts
├── tsconfig.json                   ← TypeScript configuration
├── nest-cli.json                   ← NestJS CLI configuration
└── .env                            ← Environment variables
```

---

## 🔄 Complete Request Flow Example

### Example: `POST /posts` (Create a new post)

```
1. HTTP Request Arrives
   ─────────────────────
   POST http://localhost:3000/posts
   Headers: { Authorization: "Bearer eyJhbGc..." }
   Body: { title: "My Post", body: "Content here" }

2. main.ts - Global Middleware
   ────────────────────────────
   ✓ Helmet adds security headers
   ✓ CORS checks if origin is allowed
   ✓ Cookie parser processes cookies

3. app.module.ts - Global Guards
   ──────────────────────────────
   ✓ ThrottlerGuard checks rate limit
     - If exceeded → Returns 429 Too Many Requests
     - If OK → Continue
   
   ✓ AuthGuard checks JWT token:
     - Extracts token from Authorization header
     - Verifies token signature
     - Checks token type === "access"
     - Extracts userId from token
     - Sets request.user = { id: 123 }
     - If invalid → Returns 401 Unauthorized
     - If valid → Continue

4. Route Matching
   ───────────────
   NestJS finds: PostsController.create() method
   Route: @Post() matches POST /posts

5. ValidationPipe (Automatic)
   ───────────────────────────
   Request body: { title: "My Post", body: "Content here" }
   
   Transforms to CreatePostDto:
   ┌─────────────────────────────────────┐
   │ CreatePostDto {                      │
   │   @IsString()                        │
   │   @MinLength(1)                      │
   │   @MaxLength(200)                    │
   │   title: "My Post"  ✓ Valid          │
   │                                     │
   │   @IsString()                        │
   │   @MinLength(1)                      │
   │   body: "Content here"  ✓ Valid     │
   │ }                                    │
   └─────────────────────────────────────┘
   
   ✓ All validations pass
   ✓ If any fail → Returns 400 Bad Request
   ✓ If valid → Continue to controller

6. Controller (posts.controller.ts)
   ─────────────────────────────────
   @Post()
   create(
     @Body() createPostDto: CreatePostDto,  ← Already validated!
     @User('id') userId: number               ← Extracted from JWT
   ) {
     return this.postsService.createPost(
       createPostDto,  // { title: "My Post", body: "Content here" }
       userId          // 123 (from JWT token)
     );
   }

7. Service (posts.service.ts)
   ───────────────────────────
   createPost(createPostDto, userId) {
     // Business logic
     // Database operations using TypeORM
     const post = this.postRepository.create({
       title: createPostDto.title,
       body: createPostDto.body,
       userId: userId
     });
     return this.postRepository.save(post);
   }

8. Response
   ─────────
   Controller returns data
   NestJS sends HTTP 201 Created:
   {
     "data": {
       "id": 1,
       "title": "My Post",
       "body": "Content here",
       "userId": 123,
       "createdAt": "2025-01-19T..."
     }
   }
```

---

## 🔐 Authentication Flow

### Global AuthGuard Behavior

**By Default: ALL routes are PROTECTED**

```typescript
// app.module.ts
{
  provide: APP_GUARD,
  useClass: AuthGuard,  // ← Applied to ALL routes globally
}
```

### Making Routes Public

Use `@Public()` decorator to skip authentication:

```typescript
// auth.controller.ts
@Public()  // ← Makes route public
@Post('register')
register(@Body() signUpDto: SignUpDto) {
  // No JWT token required!
}
```

### Protected Routes (Default)

```typescript
// posts.controller.ts
@Post()  // ← NO @Public() decorator
create(@Body() dto: CreatePostDto, @User('id') userId: number) {
  // JWT token REQUIRED!
  // AuthGuard automatically checks token
  // If no token → Returns 401 Unauthorized
}
```

---

## ✅ Validation Flow

### Automatic Validation via ValidationPipe

**No manual validation needed!**

```typescript
// main.ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,              // Strip unknown properties
    forbidNonWhitelisted: true,    // Throw error for unknown properties
    transform: true,              // Transform to DTO instance
    enableImplicitConversion: true, // Auto-convert types
  }),
);
```

### How DTOs Work

```typescript
// posts/dto/create-post.dto.ts
export class CreatePostDto {
  @IsString()           // Must be a string
  @MinLength(1)         // Minimum 1 character
  @MaxLength(200)       // Maximum 200 characters
  title: string;
  
  @IsString()
  @MinLength(1)
  body: string;
}
```

**When request arrives:**
1. ValidationPipe transforms body to `CreatePostDto` instance
2. Validates using `class-validator` decorators
3. If invalid → Returns 400 Bad Request with error details
4. If valid → Passes validated DTO to controller

---

## 📦 Module Dependencies

```
AppModule (root)
│
├─► DatabaseModule
│   └─► Provides TypeORM connection
│   └─► Registers entities (User, Post, Comment)
│
├─► CommonModule
│   └─► Provides shared utilities
│
├─► AuthModule
│   ├─► Uses DatabaseModule (User entity)
│   ├─► Uses JwtModule (global)
│   └─► Exports AuthService
│
├─► UsersModule
│   ├─► Uses DatabaseModule (User entity)
│   └─► Uses CommonModule
│
├─► PostsModule
│   ├─► Uses DatabaseModule (Post entity)
│   └─► Uses CommonModule
│
└─► CommentsModule
    ├─► Uses DatabaseModule (Comment entity)
    └─► Uses CommonModule
```

---

## 🎯 Key Concepts

### 1. Modules
- **Purpose**: Organize code by feature
- **Structure**: Each feature has its own module (auth, posts, users, comments)
- **Dependencies**: Modules can import other modules

### 2. Controllers
- **Purpose**: Handle HTTP requests
- **Routes**: Define endpoints using decorators (`@Get()`, `@Post()`, etc.)
- **Dependencies**: Inject services via constructor

### 3. Services
- **Purpose**: Business logic and database operations
- **Dependencies**: Inject repositories and other services
- **Pattern**: Use `@Injectable()` decorator

### 4. DTOs (Data Transfer Objects)
- **Purpose**: Define request/response structure
- **Validation**: Use `class-validator` decorators
- **Automatic**: Validated by ValidationPipe automatically

### 5. Guards
- **Purpose**: Protect routes and control access
- **Types**: AuthGuard (JWT), ThrottlerGuard (rate limiting)
- **Global**: Applied to all routes by default

### 6. Pipes
- **Purpose**: Transform and validate data
- **Built-in**: ValidationPipe validates DTOs automatically
- **Custom**: Can create custom pipes for specific needs

### 7. Filters
- **Purpose**: Catch exceptions and format error responses
- **Global**: Applied to all routes
- **Custom**: AppExceptionFilter formats all errors consistently

---

## 🚀 How to Start the Backend

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
# Create .env file with database credentials, JWT secret, etc.

# 3. Run migrations
npm run migration:run

# 4. Start development server
npm run start:dev
```

**What happens:**
1. `main.ts` → `bootstrap()` function executes
2. Creates NestJS app with `AppModule`
3. Loads all modules and dependencies
4. Applies global middleware, pipes, guards
5. Starts HTTP server on port 3000
6. Ready to accept requests!

---

## 📝 Quick Reference

### Entry Point
- **File**: `src/main.ts`
- **Function**: `bootstrap()`
- **Command**: `npm run start:dev`

### Root Module
- **File**: `src/app.module.ts`
- **Purpose**: Imports all feature modules

### Feature Modules
- `src/auth/` → Authentication (`/auth/*`)
- `src/users/` → Users (`/users/*`)
- `src/posts/` → Posts (`/posts/*`)
- `src/comments/` → Comments (`/comments/*`)

### Global Guards
- **AuthGuard**: Requires JWT token (unless `@Public()`)
- **ThrottlerGuard**: Rate limits requests

### Global Validation
- **ValidationPipe**: Validates all DTOs automatically
- **Location**: Configured in `main.ts`

### Database
- **Module**: `src/config/database.module.ts`
- **Config**: `src/config/database.config.ts`
- **Entities**: `src/entities/`
- **Migrations**: `src/migrations/`

---

## 🔍 Finding Code

### Where is route `/auth/login`?
→ `src/auth/auth.controller.ts` → `signIn()` method

### Where is route `/posts`?
→ `src/posts/posts.controller.ts` → `list()` method

### Where is JWT authentication logic?
→ `src/auth/guards/auth.guard.ts`

### Where are validation rules?
→ `src/*/dto/*.dto.ts` files (each module has its own DTOs)

### Where is database connection?
→ `src/config/database.module.ts` and `database.config.ts`

### Where are error handlers?
→ `src/common/filters/http-exception.filter.ts`

---

**Last Updated**: 2025-01-19

