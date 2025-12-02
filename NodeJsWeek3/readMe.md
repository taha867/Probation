## Blog API – Technical Documentation

This repository contains a Node.js + Express + Sequelize REST API for a blog platform with users, posts, and nested comments.  
The codebase is structured for clarity, testability, and security (validation, rate limiting, and basic hardening against common attacks).

---

## 1. Tech Stack

- **Runtime:** Node.js
- **Framework:** Express
- **ORM:** Sequelize (PostgreSQL dialect)
- **Database:** PostgreSQL
- **Auth:** JWT (JSON Web Tokens)
- **Validation:** Joi

---

## 2. Project Structure (High Level)

- `server.js` – Application entry point (Express bootstrap, DB init, routes).
- `src/routes` – Route definitions (`authRoutes`, `userRoutes`, `postRoutes`, `commentRoutes`).
- `src/controllers` – HTTP controllers (thin): validate → call service → send response.
- `src/services` – Business logic + database operations (users, posts, comments, auth).
- `src/middleware` – Cross‑cutting concerns (auth, validation, rate limiting).
- `src/validations` – Joi schemas for bodies, params, queries.
- `src/models` – Sequelize models (`User`, `Post`, `Comment`) and associations.
- `src/config/dbConfig.js` – DB initialization via Sequelize.

---

## 3. How a Request Flows (Example: `POST /posts`)

1. **Route** (`src/routes/postRoutes.js`):
   - `router.post("/", authenticateToken, create);`
2. **Auth middleware** (`authenticateToken`):
   - Reads `Authorization: Bearer <token>`.
   - Verifies JWT, ensures it’s an access token.
   - On success sets `req.user = { id: userId }` and calls `next()`.
3. **Controller** (`postController.create`):
   - Calls `validateRequest(createPostSchema, req.body, res)`:
     - Validates `title`, `body`, `status`.
     - Rejects extra/invalid fields with 400.
   - On success, calls service:
     - `createPost({ title, body, status, userId: req.user.id })`.
   - Sends:
     - `201 Created` with the created post on success.
     - `500` with `unableToCreatePost` on unhandled errors.
4. **Service** (`postService.createPost`):
   - Uses Sequelize `Post.create`.
   - Returns the created post instance back to the controller.

This same pattern repeats across the API:
- **Routing** → **(optional) auth/rate limit** → **validation** → **service call** → **response**.

---

## 4. Validation and Security

### 4.1 Central Validation – `validationMiddleware.js`

All inputs go through `validateRequest(schema, payload, res, options)`:

- **Options:**
  - `convert: false` (default) – strict types for bodies.
  - `convert: true` – used for params/query, so `"1"` can be treated as `1`.
- **Behavior:**
  - `allowUnknown: false` – extra fields cause `400 Validation error`.
  - Returns sanitized value or sends a 400 response with detailed errors.

### 4.2 Joi Schemas – Highlights

Common patterns are defined in `src/validations/commonSchemas.js`:

- `baseEmailSchema`: valid email.
- `basePasswordSchema`: min 8 chars.
- `basePhoneSchema`: `+` optional, 10–15 digits.
- `baseNameSchema`: 2–100 chars, only letters + spaces.

Examples:

- **Auth:**
  - `signUpSchema` (`POST /auth/register`):
    - `{ name, email, phone, password }` (all required, strongly typed).
  - `signInSchema` (`POST /auth/login`):
    - `{ email?, phone?, password }` with `.or("email", "phone")`.
- **Posts:**
  - `createPostSchema` (`POST /posts`):
    - `title`: 1–200 chars, no `<`/`>`.
    - `body`: 1–5000 chars, no `<`/`>`.
    - `status`: `"draft"` or `"published"`.
- **Comments:**
  - `createCommentSchema` (`POST /comments`):
    - `body`: 1–2000 chars, no `<`/`>`.
    - `postId` or `parentId`: must provide one (nested replies supported).

This combination prevents:
- Unsafe types slipping through (e.g. `"limit": "abc"`).
- Extra / suspicious keys (`role`, `sql`, etc.).
- Simple XSS payloads via `<script>` in `title` / `body` / `comment body`.

### 4.3 Auth and Rate Limiting

- **JWT access tokens**:
  - Stored only in memory on the client, validated on each request.
  - `authenticateToken` ensures tokens are valid, not expired, and of type `"access"`.
- **Brute‑force protection** on `/auth/login`:
  - Rate‑limited (5 attempts/minute/IP) with 429 responses on abuse.

---

## 5. Business Logic (Service Layer)

Services expose pure JS functions that encapsulate all DB operations and domain rules. Controllers only call these and turn results into HTTP responses.

### 5.1 `authService.js`

- `registerUser({ name, email, phone, password })`:
  - Checks DB for existing email/phone.
  - Returns `{ ok: false, reason: "USER_ALREADY_EXISTS" }` or `{ ok: true }`.
- `authenticateUser({ email, phone, password })`:
  - Loads user by email/phone, verifies password via bcrypt.
  - Updates `status` and `last_login_at`.
  - Issues access and refresh JWTs.
  - Returns `{ ok: true, user, accessToken, refreshToken }` or `{ ok: false, reason: "INVALID_CREDENTIALS" }`.
- `logoutUser`, `verifyAndRefreshToken`, `createPasswordResetToken`, `resetUserPassword`:
  - Handle logout, token refresh, and password reset flows in a structured way.

### 5.2 `userService.js`

- `listUsers({ page, limit })`:
  - Uses `User.findAndCountAll` with pagination meta.
- `getUserPostsWithComments({ userId, page, limit })`:
  - Verifies user exists.
  - Fetches user’s posts with nested comments and replies.
- `updateUserForSelf({ requestedUserId, authUserId, data })`:
  - Enforces self‑update only.
  - Checks for email/phone uniqueness.
  - Returns `{ ok: true, user }` or `{ ok: false, reason }`.
- `deleteUserForSelf({ requestedUserId, authUserId })`:
  - Deletes the user if they match the authenticated user.

### 5.3 `postService.js`

- `createPost({ title, body, status, userId })` – creates a new post.
- `listPosts({ page, limit, search, userId })` – applies filters + search and returns paginated results.
- `findPostWithAuthor(id)` – single post with author details.
- `getPostWithComments({ postId, page, limit })` – post with its comments and replies.
- `updatePostForUser({ postId, userId, data })` / `deletePostForUser({ postId, userId })` – enforce that only the owner can modify/delete.

### 5.4 `commentService.js`

- `createCommentOrReply({ body, postId, parentId, userId })`:
  - Validates `postId` or `parentId` and creates either a top‑level comment or a reply.
- `listTopLevelComments({ postId })`:
  - Returns all top‑level comments (optionally filtered by `postId`) with author and post included.
- `findCommentWithRelations(id)`:
  - Returns a single comment with its author and post included.
- `updateCommentForUser({ id, userId, body })` / `deleteCommentForUser({ id, userId })`:
  - Enforce comment ownership before updating or deleting.

---

## 6. Controller Responsibilities (Pattern)

Each controller function typically:

1. **Validates**:
   - Uses `validateRequest(schema, req.body/params/query, res, options?)`.
2. **Calls the appropriate service**:
   - Passes validated data and `req.user` where needed.
3. **Maps service results to HTTP**:
   - `ok: true` → `200/201` with data and/or success message.
   - `ok: false` → `403/404/422` with a specific error message from `errorMessages`.
4. **Catches unexpected errors**:
   - Logs the stack trace.
   - Returns `500` with a generic `operationFailed` message.

This separation keeps controllers thin and makes business logic testable.

---

## 7. Database and Migrations (Sequelize CLI)

- **Run all pending migrations:**  
  `npx sequelize db:migrate`  
  or  
  `npm run db:migrate`

- **Revert last migration:**  
  `npx sequelize db:migrate:undo`

- **Revert all migrations:**  
  `npx sequelize db:migrate:undo:all`

- **Generate a new model + migration:**  
  `npx sequelize model:generate --name ModelName --attributes field1:type,field2:type`

- **Run all seeders:**  
  `npx sequelize db:seed:all`

- **Revert last seeder:**  
  `npx sequelize db:seed:undo`

- **Check migration status:**  
  `npx sequelize db:migrate:status`

- **Revert to a specific migration:**  
  `npx sequelize-cli db:migrate:undo:all --to 20251124100000-create-post.js`

The API uses **offset‑based pagination**:
- `page` and `limit` query params.
- `offset = (page - 1) * limit`.
- Responses include pagination metadata where relevant (`total`, `page`, `limit`, `totalPages`).
