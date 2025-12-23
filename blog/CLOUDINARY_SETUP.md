# Cloudinary Integration Setup Guide

## Overview
This project now uses **Option B: Direct Upload from Frontend to Cloudinary** with signed uploads. Images are uploaded directly from the frontend to Cloudinary, and only the image URL and public_id are stored in the database.

## Backend Setup

### 1. Environment Variables
Add these to your `.env` file in the `backend` directory:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**How to get these:**
1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Go to Dashboard → Settings → Product Environment Credentials
3. Copy `Cloud name`, `API Key`, and `API Secret`

### 2. Run Migration
Run the migration to add `imagePublicId` columns:

```bash
cd backend
npm run db:migrate
```

### 3. Backend Changes Summary
- ✅ Installed `cloudinary` package
- ✅ Created `backend/src/utils/cloudinary.js` - Cloudinary utilities
- ✅ Created `backend/src/controllers/uploadController.js` - Signed upload endpoint
- ✅ Created `backend/src/routes/uploadRoutes.js` - Upload routes
- ✅ Added `POST /upload/signature` endpoint (requires authentication)
- ✅ Updated post/user controllers to accept `image` (URL) and `imagePublicId` instead of files
- ✅ Updated post/user services to delete images from Cloudinary on update/delete
- ✅ Removed Multer middleware from routes (no longer needed)
- ✅ Added `imagePublicId` column to Posts and Users tables

## Frontend Setup

### 1. Frontend Changes Summary
- ✅ Created `frontend/src/services/cloudinaryService.js` - Cloudinary upload service
- ✅ Created `frontend/src/hooks/useCloudinaryUpload.js` - Upload hook with loading states
- ✅ Updated `FormFileInput` to automatically upload to Cloudinary on file selection
- ✅ Updated `CreatePostForm` and `EditPostForm` to send JSON instead of FormData
- ✅ Updated `ProfileImageDialog` to use Cloudinary uploads
- ✅ Updated `usePostMutations` to send JSON payloads
- ✅ Updated `useAuth.updateProfileImage` to accept Cloudinary upload result
- ✅ Updated validation schemas to accept Cloudinary upload format

### 2. How It Works

**Upload Flow:**
1. User selects image file in `FormFileInput`
2. Component automatically uploads to Cloudinary using signed parameters
3. Cloudinary returns `secure_url` and `public_id`
4. Form stores `{image: secure_url, imagePublicId: public_id}` in form field
5. On form submit, JSON payload is sent to backend with image URL and public_id
6. Backend stores URL and public_id in database

**Display:**
- Images are displayed directly from Cloudinary URLs (no base URL concatenation needed)
- `PostCard` and `UserProfileMenu` already handle full URLs correctly

**Deletion:**
- When post/user is deleted or image is updated, backend deletes old image from Cloudinary using `public_id`

## Testing Checklist

- [ ] Set Cloudinary environment variables in backend `.env`
- [ ] Run migration: `npm run db:migrate` in backend
- [ ] Test post creation with image upload
- [ ] Test post update with new image
- [ ] Test post deletion (verify old image deleted from Cloudinary)
- [ ] Test user profile image upload
- [ ] Test user profile image update
- [ ] Verify images display correctly on home page
- [ ] Verify images display correctly in dashboard
- [ ] Verify images display correctly in user profile menu

## Important Notes

1. **Folder Structure**: Images are organized in Cloudinary folders:
   - Posts: `blog/posts/`
   - Users: `blog/users/`

2. **Image URLs**: All image URLs are now full Cloudinary URLs (e.g., `https://res.cloudinary.com/...`)

3. **No Local Storage**: The `backend/uploads` directory is no longer used for new uploads. Old local images will still work if they exist.

4. **Security**: The backend only signs uploads - it never sees the actual file. The API secret is never exposed to the frontend.

5. **Error Handling**: If Cloudinary upload fails, the form will show an error toast and won't submit.

## Troubleshooting

**Images not uploading:**
- Check Cloudinary credentials in `.env`
- Check browser console for errors
- Verify `/upload/signature` endpoint is accessible and returns valid signature

**Images not displaying:**
- Verify Cloudinary URLs are being stored correctly in database
- Check browser network tab for image requests
- Verify CORS settings in Cloudinary dashboard (if needed)

**Old local images:**
- Existing posts/users with local image paths (`/uploads/...`) will still work
- New uploads will use Cloudinary URLs
- Consider migrating old images to Cloudinary if needed

