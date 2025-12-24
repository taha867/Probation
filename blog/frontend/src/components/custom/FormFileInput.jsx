/**
 * FormFileInput - File input component for Cloudinary image uploads
 * Handles file selection, automatic Cloudinary upload, preview, and validation
 * Follows React 19 best practices
 */
import { useState, useRef, useCallback } from "react";
import {
  FormControl,
  FormField as ShadcnFormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ImageIcon, X, Loader2 } from "lucide-react";
import { useCloudinaryUpload } from "../../hooks/useCloudinaryUpload";

export const FormFileInput = ({
  control,
  name,
  label,
  accept = "image/*",
  maxSizeMB = 5,
  disabled = false,
  className = "",
  existingImageUrl = null, // URL string for existing image preview
  folder = "blog", // Cloudinary folder
}) => {
  const [preview, setPreview] = useState(null);
  const [hideExisting, setHideExisting] = useState(false);
  const fileInputRef = useRef(null);
  const { uploadFile, isUploading } = useCloudinaryUpload(folder, maxSizeMB);

  // Handle file selection and upload to Cloudinary
  const handleFileChange = useCallback(
    async (field, event) => {
      const file = event.target.files?.[0];
      if (!file) {
        field.onChange(null);
        setPreview(null);
        return;
      }

      // Create preview immediately (validation happens in useCloudinaryUpload hook)
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Upload to Cloudinary (validation for type and size happens inside uploadFile)
      const uploadResult = await uploadFile(file);
      if (uploadResult) {
        // Store Cloudinary URL and public_id in form field
        field.onChange({
          image: uploadResult.image,
          imagePublicId: uploadResult.imagePublicId,
        });
      } else {
        // Upload failed (validation failed or upload error), clear preview
        field.onChange(null);
        setPreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    },
    [uploadFile]
  );

  // Handle remove file (including clearing existing image preview)
  const handleRemove = useCallback(
    (field) => {
      field.onChange(null);
      setPreview(null);
      setHideExisting(true);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    []
  );

  // Handle button click to trigger file input
  const handleButtonClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // Generate unique ID for accessibility
  const fieldId = `${name}-file-input`;

  return (
    <ShadcnFormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel htmlFor={fieldId} className="text-sm font-medium text-slate-700">
            {label}
          </FormLabel>

          <FormControl>
            <div className="space-y-2">
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                id={fieldId}
                name={name}
                type="file"
                accept={accept}
                className="hidden"
                disabled={disabled}
                onChange={(e) => handleFileChange(field, e)}
              />

              {/* Preview or upload button */}
              {preview || (field.value && (field.value.image || typeof field.value === "string")) || (existingImageUrl && !hideExisting) ? (
                <div className="relative">
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-300 bg-gray-50">
                    {isUploading ? (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                      </div>
                    ) : (
                      <img
                        src={
                          preview ||
                          (field.value?.image || (typeof field.value === "string" ? field.value : null)) ||
                          (!hideExisting ? existingImageUrl : null)
                        }
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Hide image if it fails to load
                          e.target.style.display = "none";
                        }}
                      />
                    )}
                    {!isUploading && (
                      <button
                        type="button"
                        onClick={() => handleRemove(field)}
                        disabled={disabled}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        aria-label="Remove image"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  {!isUploading && (
                    <p className="text-xs text-gray-500 mt-1">
                      {field.value?.image || (typeof field.value === "string" && field.value)
                        ? "Image uploaded"
                        : "Current image"}
                    </p>
                  )}
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleButtonClick}
                  disabled={disabled || isUploading}
                  className="w-full h-48 flex flex-col items-center justify-center gap-2 border-dashed"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
                      <span className="text-sm text-gray-600">Uploading...</span>
                    </>
                  ) : (
                    <>
                      <ImageIcon className="h-8 w-8 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Click to upload image
                      </span>
                      <span className="text-xs text-gray-400">
                        Max size: {maxSizeMB}MB (JPEG, PNG, WebP, GIF)
                      </span>
                    </>
                  )}
                </Button>
              )}
            </div>
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormFileInput;

