# Blog Frontend - React 19 Application

A modern, production-ready blog application frontend built with React 19, showcasing best practices in component architecture, state management, performance optimization, and user experience.

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Architecture Overview](#architecture-overview)
- [Key Concepts](#key-concepts)
- [Component Organization](#component-organization)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [Form Handling](#form-handling)
- [Routing & Navigation](#routing--navigation)
- [Performance Optimizations](#performance-optimizations)
- [Development Guide](#development-guide)
- [Best Practices](#best-practices)

---

## 🛠 Tech Stack

### Core Framework
- **React 19.2.0** - Latest React with concurrent features (`use()`, `useTransition()`, `Suspense`)
- **Vite 7.2.4** - Fast build tool and dev server
- **React Router DOM 7.10.1** - Client-side routing

### State Management & Data Fetching
- **TanStack Query (React Query) 5.90.12** - Server state management, caching, and synchronization
- **React Context API** - Client-side state management (authentication)
- **useReducer** - Complex state logic (auth reducer)

### UI & Styling
- **Tailwind CSS 4.1.17** - Utility-first CSS framework
- **Shadcn/ui** - Accessible component library (Radix UI primitives)
- **Lucide React** - Icon library
- **Tailwind Merge** - Merge Tailwind classes intelligently
- **Three.js** - 3D library for WebGL
- **Vanta.js** - Animated 3D background effects

### Form Management & Validation
- **React Hook Form 7.68.0** - Performant form library
- **Yup 1.7.1** - Schema validation
- **@hookform/resolvers** - Yup resolver for React Hook Form

### HTTP & API
- **Axios 1.13.2** - HTTP client
- **axios-auth-refresh 3.3.6** - Automatic token refresh interceptor

### Utilities
- **date-fns 4.1.0** - Date formatting and manipulation
- **jwt-decode 4.0.0** - JWT token decoding
- **react-hot-toast 2.6.0** - Toast notifications
- **http-status-codes** - HTTP status code constants

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

---

## 📁 Project Structure

```
frontend/
├── public/                    # Static assets
│   ├── blogImg.jpeg          # Blog image for auth pages
│   └── vite.svg              # Vite logo
│
├── src/
│   ├── components/           # React components
│   │   ├── auth/             # Authentication components
│   │   │   ├── AuthLayout.jsx    # Unified auth layout with 3D background
│   │   │   ├── SignIn.jsx        # Sign in page container
│   │   │   ├── SignUp.jsx    # Sign up page container
│   │   │   ├── ChangePaswword.jsx  # Change password container
│   │   │   ├── ForgotPassword.jsx  # Forgot password container
│   │   │   ├── ResetPassword.jsx   # Reset password container
│   │   │   └── form/         # Auth form components
│   │   │       ├── SignInForm.jsx
│   │   │       ├── SignUpForm.jsx
│   │   │       ├── ChangePasswordForm.jsx
│   │   │       ├── ForgotPasswordForm.jsx
│   │   │       └── ResetPasswordForm.jsx
│   │   │
│   │   ├── comments/         # Comment-related components
│   │   │   ├── CommentSection.jsx      # Main comment container
│   │   │   ├── CommentItem.jsx          # Individual comment display
│   │   │   ├── CommentForm.jsx          # Comment create/edit form
│   │   │   ├── CommentActionsMenu.jsx   # Three-dot menu for edit/delete
│   │   │   └── DeleteCommentDialog.jsx  # Delete confirmation dialog
│   │   │
│   │   ├── common/           # Reusable/common components
│   │   │   ├── AuthorAvatar.jsx         # Author avatar with preview
│   │   │   ├── PostCard.jsx             # Post card component
│   │   │   ├── PostFilter.jsx           # Post search/filter
│   │   │   ├── PaginationControls.jsx   # Pagination component
│   │   │   ├── DeleteDialog.jsx         # Generic delete dialog
│   │   │   ├── ProtectedRoute.jsx       # Route protection wrapper
│   │   │   ├── AuthRouteProtection.jsx  # Auth route protection
│   │   │   ├── AppInitializer.jsx      # Loading component
│   │   │   ├── AuthFallback.jsx        # Error boundary fallback
│   │   │   └── ToastNotification.jsx   # Toast container
│   │   │
│   │   ├── custom/           # Custom form components
│   │   │   ├── FormField.jsx           # Unified form field
│   │   │   ├── FormFileInput.jsx       # File upload component
│   │   │   ├── FormSelect.jsx          # Select dropdown component
│   │   │   └── index.js                 # Barrel export
│   │   │
│   │   ├── posts/            # Post-related components
│   │   │   ├── PostList.jsx            # Post list display
│   │   │   ├── PostDetailContent.jsx  # Post detail view
│   │   │   ├── CreatePost.jsx         # Create post container
│   │   │   ├── DeletePostDialog.jsx   # Delete post dialog wrapper
│   │   │   └── form/                  # Post form components
│   │   │       ├── CreatePostForm.jsx
│   │   │       └── EditPostForm.jsx
│   │   │
│   │   ├── profile/          # User profile components
│   │   │   └── UserProfileMenu.jsx    # Profile dropdown menu
│   │   │
│   │   ├── home/             # Home page components
│   │   │   └── Home.jsx               # Home page content
│   │   │
│   │   ├── ui/               # Shadcn/ui base components
│   │   │   ├── button.jsx
│   │   │   ├── card.jsx
│   │   │   ├── dialog.jsx
│   │   │   ├── form.jsx
│   │   │   ├── input.jsx
│   │   │   └── ... (other UI components)
│   │   │
│   │   ├── Navbar.jsx         # Navigation bar
│   │   └── Footer.jsx        # Footer component
│   │
│   ├── containers/           # Container components (page-level)
│   │   ├── DashboardContainer.jsx  # Dashboard page container
│   │   └── PostContainer.jsx       # Post detail page container
│   │
│   ├── pages/                # Page components (route-level)
│   │   ├── HomePage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── CreatePostPage.jsx
│   │   ├── PostDetailPage.jsx
│   │   └── AuthPages/        # Authentication pages
│   │       ├── SignInPage.jsx
│   │       ├── SignUpPage.jsx
│   │       ├── ForgotPasswordPage.jsx
│   │       ├── ResetPasswordPage.jsx
│   │       └── ChangePasswordPage.jsx
│   │
│   ├── hooks/                # Custom React hooks
│   │   ├── authHooks/        # Authentication hooks
│   │   │   └── authHooks.js  # useAuth hook
│   │   ├── postHooks/        # Post-related hooks
│   │   │   ├── postQueries.js    # React Query queries
│   │   │   └── postMutations.js  # React Query mutations
│   │   ├── commentHooks/     # Comment-related hooks
│   │   │   ├── commentQueries.js    # React Query queries
│   │   │   └── commentMutations.js  # React Query mutations
│   │   ├── useCloudinaryUpload.js   # Cloudinary upload hook
│   │   └── useImperativeDialog.js   # Dialog state management hook
│   │
│   ├── services/             # API service layer
│   │   ├── authService.js     # Authentication API calls
│   │   ├── postService.js     # Post API calls
│   │   ├── commentService.js  # Comment API calls
│   │   ├── userService.js     # User API calls
│   │   └── cloudinaryService.js  # Cloudinary upload service
│   │
│   ├── utils/                # Utility functions
│   │   ├── axiosInstance.js      # Axios instance with interceptors
│   │   ├── tokenUtils.js         # JWT token utilities
│   │   ├── authPromise.js        # Auth promise for use() hook
│   │   ├── constants.js           # Application constants
│   │   ├── formSubmitWithToast.js # Form submission wrapper
│   │   ├── postUtils.js          # Post-related utilities
│   │   ├── imageUtils.js         # Image URL utilities
│   │   ├── authorUtils.js        # Author-related utilities
│   │   └── memoComparisons.js    # React.memo comparison functions
│   │
│   ├── validations/          # Yup validation schemas
│   │   ├── authSchemas.js    # Auth form schemas
│   │   ├── postSchemas.js    # Post form schemas
│   │   ├── commentSchemas.js # Comment form schemas
│   │   └── userSchemas.js    # User form schemas
│   │
│   ├── contexts/             # React Context providers
│   │   └── authContext.jsx   # Authentication context
│   │
│   ├── reducers/             # Reducers for complex state
│   │   └── authReducer.js    # Authentication reducer
│   │
│   ├── lib/                  # Third-party library utilities
│   │   └── utils.js          # Tailwind merge utility
│   │
│   ├── App.jsx               # Main app component (routing)
│   ├── main.jsx              # Application entry point
│   └── index.css             # Global styles
│
├── .env                      # Environment variables
├── package.json              # Dependencies and scripts
├── vite.config.js            # Vite configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── postcss.config.js         # PostCSS configuration
├── eslint.config.js          # ESLint configuration
└── README.md                 # This file
```

---

## 🏗 Architecture Overview

### Design Principles

1. **Separation of Concerns**
   - **Pages**: Route-level components (minimal logic)
   - **Containers**: Page-level logic and layout
   - **Components**: Reusable UI components
   - **Services**: API communication layer
   - **Hooks**: Reusable stateful logic
   - **Utils**: Pure utility functions

2. **Single Responsibility Principle (SRP)**
   - Each file/module has one clear purpose
   - Services separated by domain (auth, posts, comments, users)
   - Hooks separated by concern (queries vs mutations)

3. **DRY (Don't Repeat Yourself)**
   - Shared utilities for common operations
   - Reusable components (DeleteDialog, AuthorAvatar, FormField)
   - Centralized constants and validation schemas

4. **React 19 Best Practices**
   - `use()` hook for async data resolution
   - `useTransition()` for non-blocking operations
   - `Suspense` for declarative loading states
   - Proper memoization to prevent unnecessary re-renders

---

## 🔑 Key Concepts

### 1. React Query (TanStack Query)

**Purpose**: Manages server state, caching, and synchronization.

**Key Features**:
- Automatic caching and background refetching
- Optimistic updates
- Cache invalidation on mutations
- Loading and error states

**Query Keys Structure**:
```javascript
// Hierarchical query keys for efficient cache management
homePostsKeys = {
  all: ["homePosts"],
  lists: () => [...homePostsKeys.all, "list"],
  list: (page, limit, search) => [...homePostsKeys.lists(), page, limit, search]
}
```

**Usage Pattern**:
```javascript
// Queries (read operations)
const { data, isLoading, error } = useHomePosts(page, limit, search);

// Mutations (write operations)
const createPostMutation = useCreatePost();
createPostMutation.mutate(postData);
```

**Cache Configuration** (`main.jsx`):
- `staleTime: 2 minutes` - Data considered fresh for 2 minutes
- `gcTime: 5 minutes` - Unused data kept in cache for 5 minutes
- `refetchOnWindowFocus: false` - Prevents refetch on tab switch
- `retry: 1` - Retry failed requests once

### 2. Authentication Flow

**Architecture**:
```
App Load
  ↓
Suspense Boundary (main.jsx)
  ↓
AuthProvider (uses use() hook)
  ↓
createInitialAuthPromise() resolves
  ↓
Token validated → User decoded → Context updated
  ↓
App renders with auth state
```

**Key Files**:
- `contexts/authContext.jsx` - Auth state provider
- `utils/authPromise.js` - Cached promise for auth resolution
- `hooks/authHooks/authHooks.js` - Auth operations (signin, signup, logout)
- `reducers/authReducer.js` - Auth state reducer
- `utils/tokenUtils.js` - JWT token management

**Token Management**:
- Access token stored in localStorage
- Refresh token stored in localStorage
- Automatic token refresh via axios interceptor
- Token validation on app initialization

### 3. Axios Interceptors

**Request Interceptor** (`utils/axiosInstance.js`):
- Automatically adds `Authorization: Bearer <token>` header
- Runs before every request

**Response Interceptor**:
- Success: Shows toast notification if message exists
- Error: Shows error toast, handles specific status codes
- Network errors: Shows network error message

**Token Refresh Interceptor** (`axios-auth-refresh`):
- Automatically refreshes token on 401 Unauthorized
- Pauses requests while refreshing
- Retries failed request with new token
- Redirects to login if refresh fails

- Automatically refreshes token on 401 Unauthorized
- Pauses requests while refreshing
- Retries failed request with new token
- Redirects to login if refresh fails

### 4. 3D Visual Effects
**Technology**: Vanta.js + Three.js
- Implemented via `AuthLayout` component
- Provides interactive "Clouds" effect on authentication pages
- Uses `useRef` and `useEffect` for WebGL context lifecycle management
- Graceful cleanup on unmount to prevent memory leaks

### 5. Form Handling Pattern

**Standard Pattern**:
```javascript
// 1. Define validation schema (validations/)
const postSchema = yup.object({
  title: yup.string().required().min(3).max(200),
  body: yup.string().required().min(10).max(10000),
});

// 2. Setup form (component)
const form = useForm({
  resolver: yupResolver(postSchema),
  defaultValues: { title: "", body: "" },
  mode: "onChange",
});

// 3. Create submit handler with toast
const handleSubmit = createSubmitHandlerWithToast(form, onSubmit, {
  successMessage: TOAST_MESSAGES.POST_CREATED_SUCCESS,
});

// 4. Use custom FormField component
<FormField
  control={form.control}
  name="title"
  label="Title"
  placeholder="Enter post title"
/>
```

**Key Utilities**:
- `formSubmitWithToast.js` - Wraps handleSubmit with toast notifications
- `custom/FormField.jsx` - Unified form field component
- Validation schemas in `validations/` folder

### 5. Dialog Management Pattern

**Imperative Dialog Pattern**:
```javascript
// 1. Use useImperativeDialog hook
const { isOpen, payload, openDialog, closeDialog } = useImperativeDialog(null);

// 2. Expose via ref (for parent control)
useImperativeHandle(ref, () => ({
  openDialog: (entity) => openDialog(entity),
  closeDialog: () => closeDialog(),
}));

// 3. Generic DeleteDialog component
<DeleteDialog
  ref={deleteDialogRef}
  config={{
    title: "Delete Post",
    descriptionFormatter: (payload) => `Delete "${payload.title}"?`,
    mutationHook: useDeletePost,
    mutationCall: (payload) => ({ postId: payload.id }),
  }}
/>
```

**Benefits**:
- Reusable dialog logic
- Consistent dialog behavior
- Separation of dialog state from business logic

---

## 🧩 Component Organization

### Component Hierarchy

```
App
├── Navbar (always visible)
├── Routes
│   ├── Public Routes
│   │   ├── HomePage
│   │   │   └── Home (PostList + PostFilter)
│   │   └── PostDetailPage
│   │       └── PostContainer
│   │           ├── PostDetailContent
│   │           └── CommentSection
│   │               ├── CommentForm
│   │               └── CommentItem (recursive for replies)
│   │
│   ├── Auth Routes (redirect if authenticated)
│   │   ├── SignInPage → SignIn → SignInForm
│   │   ├── SignUpPage → SignUp → SignUpForm
│   │   └── ...
│   │
│   └── Protected Routes (require authentication)
│       ├── DashboardPage
│       │   └── DashboardContainer
│       │       └── PostList
│       ├── CreatePostPage
│       │   └── CreatePost → CreatePostForm
│       └── ChangePasswordPage
│           └── ChangePassword → ChangePasswordForm
│
└── Footer (always visible)
```

### Component Types

1. **Page Components** (`pages/`)
   - Minimal logic, mostly routing wrappers
   - Example: `DashboardPage.jsx` → renders `DashboardContainer`

2. **Container Components** (`containers/`)
   - Page-level logic and layout
   - Manages state and data fetching
   - Example: `DashboardContainer.jsx` → manages post list, edit/delete dialogs

3. **Feature Components** (`components/`)
   - Domain-specific components (posts, comments, auth)
   - Contains business logic related to feature
   - Example: `CommentSection.jsx` → manages comment display and pagination

4. **Common Components** (`components/common/`)
   - Reusable across multiple features
   - Generic, configurable components
   - Example: `DeleteDialog.jsx` → generic delete confirmation

5. **UI Components** (`components/ui/`)
   - Base UI primitives (Shadcn/ui)
   - No business logic, pure presentation
   - Example: `Button.jsx`, `Card.jsx`

6. **Custom Form Components** (`components/custom/`)
   - Form-specific components
   - Integrates React Hook Form with Shadcn/ui
   - Example: `FormField.jsx` → unified input component

---

## 🔄 State Management

### Server State (React Query)

**Managed by**: TanStack Query

**What it manages**:
- Posts data (home, user posts, post details)
- Comments data
- User profile data
- Pagination state
- Search/filter state

**Key Concepts**:
- **Query Keys**: Hierarchical keys for cache management
- **Stale Time**: How long data is considered fresh
- **Cache Time**: How long unused data stays in cache
- **Invalidation**: Clearing cache when data changes

**Example**:
```javascript
// Query
const { data, isLoading } = useHomePosts(page, limit, search);

// Mutation with cache invalidation
const createPostMutation = useCreatePost();
createPostMutation.mutate(postData);
// Automatically invalidates userPostsKeys.all and homePostsKeys.all
```

### Client State (Context + Reducer)

**Managed by**: React Context + useReducer

**What it manages**:
- Authentication state (user, tokens)
- UI state (dialogs, modals)

**Auth State Flow**:
```
AuthProvider (Context)
  ↓
useReducer(authReducer, initialState)
  ↓
Actions dispatched via useAuth hook
  ↓
State updated → Components re-render
```

**Example**:
```javascript
const { user, isAuthenticated, signin, signout } = useAuth();
```

### Local Component State

**Managed by**: useState, useRef

**What it manages**:
- Form inputs
- UI interactions (dropdowns, modals)
- Temporary UI state

**Best Practices**:
- Use `useState` for simple state
- Use `useRef` for values that don't trigger re-renders
- Use `useMemo` for expensive calculations
- Use `useCallback` for stable function references

---

## 🌐 API Integration

### Service Layer Architecture

**Structure**:
```
Component/Hook
  ↓
Service Function (services/)
  ↓
Axios Instance (utils/axiosInstance.js)
  ↓
Backend API
```

**Service Files**:
- `authService.js` - Authentication endpoints
- `postService.js` - Post CRUD operations
- `commentService.js` - Comment CRUD operations
- `userService.js` - User profile operations
- `cloudinaryService.js` - Image upload operations

**Example Service Function**:
```javascript
// services/postService.js
export const fetchAllPosts = async (params = {}) => {
  const response = await axiosInstance.get("/posts", { params });
  const { data: { data } = {} } = response;
  return {
    posts: data.posts || [],
    pagination: data.meta || {},
  };
};
```

**Usage in Hooks**:
```javascript
// hooks/postHooks/postQueries.js
export const useHomePosts = (page, limit, search) => {
  return useQuery({
    queryKey: homePostsKeys.list(page, limit, search),
    queryFn: async () => {
      return await fetchAllPosts({ page, limit, status: "published", search });
    },
    staleTime: 1000 * 60 * 1,
  });
};
```

### Error Handling

**Global Error Handling** (`axiosInstance.js`):
- Network errors → Toast notification
- Server errors (4xx, 5xx) → Toast with error message
- 401 Unauthorized → Automatic token refresh
- Token refresh failure → Redirect to login

**Component-Level Error Handling**:
- React Query provides `error` state
- Error boundaries catch render errors
- Form validation errors shown inline

---

## 📝 Form Handling

### Form Architecture

**Components**:
1. **Form Component** (`components/custom/FormField.jsx`)
   - Unified component for all input types
   - Handles text, email, password, tel, textarea
   - Supports icons, password toggle, validation

2. **Validation Schemas** (`validations/`)
   - Yup schemas for each form type
   - Centralized validation rules
   - Reusable across components

3. **Form Submission** (`utils/formSubmitWithToast.js`)
   - Wraps React Hook Form's handleSubmit
   - Shows toast on validation errors
   - Shows success toast on successful submission

### Form Flow

```
User Input
  ↓
React Hook Form (onChange validation)
  ↓
Yup Schema Validation
  ↓
Validation Errors → Shown inline
  ↓
Form Submit
  ↓
createSubmitHandlerWithToast
  ↓
Client Validation → Toast if errors
  ↓
onSubmit Handler
  ↓
API Call (via service)
  ↓
Success/Error → Toast notification
```

### Form Components

**FormField** (`components/custom/FormField.jsx`):
- Auto-detects input type
- Supports password toggle
- Shows validation errors
- Supports icons and helper text

**FormFileInput** (`components/custom/FormFileInput.jsx`):
- File upload with preview
- Cloudinary integration
- Image validation
- Progress indication

**FormSelect** (`components/custom/FormSelect.jsx`):
- Dropdown select component
- Integrates with React Hook Form
- Accessible (Radix UI)

---

## 🧭 Routing & Navigation

### Route Structure

**Public Routes**:
- `/` - Home page (post list)
- `/posts/:id` - Post detail page

**Auth Routes** (redirect if authenticated):
- `/signin` - Sign in page
- `/signup` - Sign up page
- `/forgot-password` - Forgot password
- `/reset-password` - Reset password (with token)

**Protected Routes** (require authentication):
- `/dashboard` - User dashboard (user's posts)
- `/create-post` - Create new post
- `/change-password` - Change password

### Route Protection

**ProtectedRoute** (`components/common/ProtectedRoute.jsx`):
- Checks authentication status
- Shows loading while checking
- Redirects to `/auth` if not authenticated
- Preserves intended destination

**AuthRoute** (`components/common/AuthRouteProtection.jsx`):
- Prevents authenticated users from accessing auth pages
- Redirects to `/dashboard` if authenticated
- Shows auth pages only for non-authenticated users

### Navigation

**Programmatic Navigation**:
```javascript
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();
navigate("/dashboard");
navigate("/posts/123", { replace: true });
```

**Link Navigation**:
```javascript
import { Link } from "react-router-dom";

<Link to="/dashboard">Dashboard</Link>
```

---

## ⚡ Performance Optimizations

### React.memo with Custom Comparisons

**Purpose**: Prevent unnecessary re-renders when props haven't changed

**Implementation** (`utils/memoComparisons.js`):
```javascript
// Custom comparison functions for deep prop comparison
export const createCommentComparison = () => (prevProps, nextProps) => {
  // Compares comment content, not just object references
  return (
    prevComment.body === nextComment.body &&
    prevComment.author?.id === nextComment.author?.id &&
    // ... other properties
  );
};

// Usage
const CommentItem = memo(({ comment, ... }) => {
  // component code
}, createCommentComparison());
```

**Components Using Custom Comparisons**:
- `CommentItem.jsx` - Deep comparison of comment props
- `PostCard.jsx` - Deep comparison of post props
- `AuthorAvatar.jsx` - Deep comparison of author props

### useMemo & useCallback

**useMemo**: Memoize expensive calculations
```javascript
const authorName = useMemo(() => author?.name || "Unknown", [author?.name]);
const initials = useMemo(() => getAuthorInitial(authorName), [authorName]);
```

**useCallback**: Memoize function references
```javascript
const handleClick = useCallback((e) => {
  // handler logic
}, [dependencies]);
```

**When to Use**:
- ✅ Expensive calculations (date formatting, filtering)
- ✅ Stable function references passed to memoized children
- ✅ Preventing object/array recreation on every render

**When NOT to Use**:
- ❌ Simple calculations (overhead > benefit)
- ❌ Primitive values (no benefit)
- ❌ Functions with frequently changing dependencies

### React Query Optimizations

**Stale Time Configuration**:
- Home posts: 1 minute (frequently updated)
- User posts: 2 minutes (moderate updates)
- Post details: 5 minutes (rarely changes)
- Comments: 30 seconds (frequently updated)

**Cache Invalidation**:
- Mutations automatically invalidate related queries
- Prevents stale data display
- Ensures UI reflects latest server state

**Query Keys**:
- Hierarchical structure for efficient cache management
- Enables partial cache invalidation
- Example: Invalidating `userPostsKeys.all` clears all user post queries

---

## 🚀 Development Guide

### Getting Started

1. **Install Dependencies**:
```bash
cd frontend
npm install
```

2. **Environment Setup**:
Create `.env` file:
```env
VITE_API_BASE_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173
```

3. **Start Development Server**:
```bash
npm run dev
```

4. **Build for Production**:
```bash
npm run build
```

### Code Style Guidelines

**Component Structure**:
```javascript
// 1. Imports (grouped)
import React hooks
import Third-party libraries
import Components
import Utils/services
import Types/constants

// 2. Component definition
const ComponentName = memo(({ prop1, prop2 }) => {
  // 3. Hooks
  const [state, setState] = useState();
  const { data } = useQuery();
  
  // 4. Memoized values
  const memoizedValue = useMemo(() => {}, [deps]);
  
  // 5. Callbacks
  const handleClick = useCallback(() => {}, [deps]);
  
  // 6. Effects
  useEffect(() => {}, [deps]);
  
  // 7. Early returns
  if (loading) return <Loader />;
  
  // 8. Render
  return <div>...</div>;
}, comparisonFunction);

export default ComponentName;
```

**Naming Conventions**:
- Components: PascalCase (`PostCard.jsx`)
- Hooks: camelCase starting with `use` (`useAuth.js`)
- Utilities: camelCase (`postUtils.js`)
- Constants: UPPER_SNAKE_CASE (`POST_STATUS`)
- Files: Match export name

**File Organization**:
- One component per file
- Related components in same folder
- Barrel exports (`index.js`) for convenience

### Adding a New Feature

**Example: Adding a "Like" Feature**

1. **Create Service Function** (`services/postService.js`):
```javascript
export const likePost = async (postId) => {
  const response = await axiosInstance.post(`/posts/${postId}/like`);
  return response.data.data;
};
```

2. **Create React Query Hook** (`hooks/postHooks/postMutations.js`):
```javascript
export const useLikePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: likePost,
    onSuccess: (_, postId) => {
      queryClient.invalidateQueries({ queryKey: postDetailKeys.detail(postId) });
      queryClient.invalidateQueries({ queryKey: homePostsKeys.all });
    },
  });
};
```

3. **Use in Component**:
```javascript
const LikeButton = ({ postId }) => {
  const likeMutation = useLikePost();
  
  const handleLike = () => {
    likeMutation.mutate(postId);
  };
  
  return <Button onClick={handleLike}>Like</Button>;
};
```

### Debugging Tips

**React Query DevTools**:
- Install: `@tanstack/react-query-devtools`
- Shows query cache, mutations, and state

**Common Issues**:
1. **Stale Data**: Check `staleTime` and cache invalidation
2. **Unnecessary Re-renders**: Check memoization and dependencies
3. **Form Validation Errors**: Check Yup schema and form setup
4. **Token Issues**: Check token storage and refresh logic

---

## ✅ Best Practices

### Component Design

1. **Keep Components Small**
   - Single responsibility
   - Easy to test and maintain
   - Reusable across features

2. **Use Composition**
   - Compose smaller components
   - Avoid prop drilling
   - Use Context for shared state

3. **Memoization Strategy**
   - Memoize expensive calculations
   - Memoize callbacks passed to children
   - Use custom comparisons for complex props

### State Management

1. **Server State → React Query**
   - All API data managed by React Query
   - Automatic caching and synchronization
   - Optimistic updates where appropriate

2. **Client State → Context/useState**
   - Auth state in Context
   - UI state in local useState
   - Avoid prop drilling with Context

3. **Form State → React Hook Form**
   - All forms use React Hook Form
   - Yup for validation
   - Centralized validation schemas

### Code Organization

1. **Separation of Concerns**
   - Services: API calls only
   - Hooks: Stateful logic
   - Components: UI rendering
   - Utils: Pure functions

2. **Reusability**
   - Extract common logic to hooks
   - Create reusable components
   - Centralize utilities

3. **Consistency**
   - Follow established patterns
   - Use shared constants
   - Consistent naming conventions

### Performance

1. **Avoid Unnecessary Re-renders**
   - Use React.memo with custom comparisons
   - Memoize callbacks and values
   - Optimize React Query queries

2. **Optimize Bundle Size**
   - Code splitting with React.lazy
   - Tree shaking (ES modules)
   - Lazy load heavy components

3. **Optimize API Calls**
   - Use React Query caching
   - Implement pagination
   - Debounce search inputs

### Accessibility

1. **Semantic HTML**
   - Use proper HTML elements
   - ARIA labels where needed
   - Keyboard navigation support

2. **Form Accessibility**
   - Proper label associations
   - Error message announcements
   - Focus management

3. **Dialog Accessibility**
   - Focus trap
   - Escape key handling
   - Screen reader announcements

---

## 📚 Key Files Reference

### Entry Point
- `main.jsx` - App initialization, providers setup, Suspense boundaries

### Routing
- `App.jsx` - Route definitions, layout structure

### Authentication
- `contexts/authContext.jsx` - Auth state provider
- `hooks/authHooks/authHooks.js` - Auth operations
- `utils/tokenUtils.js` - Token management
- `utils/authPromise.js` - Auth initialization promise

### Data Fetching
- `hooks/postHooks/postQueries.js` - Post queries
- `hooks/postHooks/postMutations.js` - Post mutations
- `hooks/commentHooks/commentQueries.js` - Comment queries
- `hooks/commentHooks/commentMutations.js` - Comment mutations

### API Layer
- `utils/axiosInstance.js` - Axios instance with interceptors
- `services/` - API service functions

### Utilities
- `utils/constants.js` - Application constants
- `utils/postUtils.js` - Post-related utilities
- `utils/memoComparisons.js` - Memo comparison functions
- `utils/formSubmitWithToast.js` - Form submission wrapper

### Validation
- `validations/` - Yup validation schemas

---

## 🔍 Common Patterns

### Pattern 1: React Query Query + Mutation

```javascript
// Query
const { data, isLoading } = useHomePosts(page, limit, search);

// Mutation
const createMutation = useCreatePost();
createMutation.mutate(postData, {
  onSuccess: () => {
    // Optional: Additional logic after success
  },
});
```

### Pattern 2: Form with Validation

```javascript
const form = useForm({
  resolver: yupResolver(schema),
  defaultValues: { field: "" },
});

const handleSubmit = createSubmitHandlerWithToast(form, onSubmit, {
  successMessage: "Success!",
});

return (
  <Form {...form}>
    <form onSubmit={handleSubmit}>
      <FormField control={form.control} name="field" label="Label" />
      <Button type="submit">Submit</Button>
    </form>
  </Form>
);
```

### Pattern 3: Imperative Dialog

```javascript
const dialogRef = useRef(null);

const handleDelete = () => {
  dialogRef.current?.openDialog(post);
};

<DeleteDialog ref={dialogRef} config={deleteConfig} />
```

### Pattern 4: Memoized Component

```javascript
const Component = memo(({ data, onAction }) => {
  // Component logic
}, createComparisonFunction());
```

---

## 🐛 Troubleshooting

### Issue: Forms not submitting
- Check React Hook Form setup
- Verify validation schema
- Check onSubmit handler

### Issue: Stale data after mutation
- Verify cache invalidation in mutation
- Check query keys match
- Ensure mutation calls invalidateQueries

### Issue: Unnecessary re-renders
- Check memoization
- Verify dependencies in hooks
- Use custom comparison functions

### Issue: Token refresh not working
- Check axios interceptor setup
- Verify refresh token storage
- Check token expiration logic

---

## 📖 Additional Resources

- [React 19 Documentation](https://react.dev)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [React Hook Form Documentation](https://react-hook-form.com)
- [React Router Documentation](https://reactrouter.com)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Shadcn/ui Documentation](https://ui.shadcn.com)

---

## 🤝 Contributing

When contributing to this codebase:

1. Follow the established patterns
2. Maintain separation of concerns
3. Add proper memoization where needed
4. Update this README if adding new patterns
5. Write clear, self-documenting code
6. Use TypeScript-style JSDoc comments

---

## 📝 Notes

- This codebase follows React 19 best practices
- All forms use React Hook Form with Yup validation
- Server state is managed entirely by React Query
- Authentication uses JWT tokens with automatic refresh
- Components are optimized to prevent unnecessary re-renders
- Code is organized following separation of concerns principles

---

**Last Updated**: 2024
**React Version**: 19.2.0
**Node Version**: 18+
