/**
 * useCloudinaryUpload - Custom hook for Cloudinary direct uploads
 * Handles file upload to Cloudinary with loading and error states
 * Follows React 19 best practices
 */
import { useState, useCallback } from "react";
import { uploadImage } from "../services/cloudinaryService";
import toast from "react-hot-toast";

export const useCloudinaryUpload = (folder = "blog", maxSizeMB = 5) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadFile = useCallback(
    async (file) => {
      if (!file) return null;

      setIsUploading(true);
      setUploadProgress(0);

      try {
        // Validate file type
        if (!file.type.startsWith("image/")) {
          toast.error("Only image files are allowed");
          return null;
        }

        // Validate file size
        const maxSize = maxSizeMB * 1024 * 1024; // Convert MB to bytes
        if (file.size > maxSize) {
          toast.error(`File size must be less than ${maxSizeMB}MB`);
          return null;
        }

        // Upload to Cloudinary
        const result = await uploadImage(file, folder);

        setUploadProgress(100);
        return {
          image: result.secure_url,
          imagePublicId: result.public_id,
        };
      } catch (error) {
        console.error("Cloudinary upload error:", error);
        toast.error(error.message || "Failed to upload image");
        return null;
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    },
    [folder, maxSizeMB]
  );

  return {
    uploadFile,
    isUploading,
    uploadProgress,
  };
};

