/**
 * FormFileInput - File input component for image uploads
 * Handles file selection, preview, and validation
 * File is sent to backend via FormData (multipart/form-data)
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
import { ImageIcon, X } from "lucide-react";
import toast from "react-hot-toast";

export const FormFileInput = ({
  control,
  name,
  label,
  accept = "image/*",
  maxSizeMB = 5,
  disabled = false,
  existingImageUrl = null, // URL string for existing image preview
}) => {
  const [preview, setPreview] = useState(null);
  const [hideExisting, setHideExisting] = useState(false);
  const fileInputRef = useRef(null);

  // Handle file selection - only create preview, don't upload
  const handleFileChange = useCallback(
    (field, event) => {
      const file = event.target.files?.[0];
      if (!file) {
        field.onChange(null);
        setPreview(null);
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Only image files are allowed");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      // Validate file size
      const maxSize = maxSizeMB * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error(`File size must be less than ${maxSizeMB}MB`);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Store file object in form field (will be sent to backend)
      field.onChange(file);
    },
    [maxSizeMB]
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
              {preview || (field.value instanceof File) || (typeof field.value === "string" && field.value) || (existingImageUrl && !hideExisting) ? (
                <div className="relative">
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-300 bg-gray-50">
                    <img
                      src={
                        preview ||
                        (field.value instanceof File ? preview : null) ||
                        (typeof field.value === "string" ? field.value : null) ||
                        (!hideExisting ? existingImageUrl : null)
                      }
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Hide image if it fails to load
                        e.target.style.display = "none";
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemove(field)}
                      disabled={disabled}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      aria-label="Remove image"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {field.value instanceof File
                      ? "Image selected (will be uploaded on submit)"
                      : typeof field.value === "string" && field.value
                      ? "Current image"
                      : "Current image"}
                  </p>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleButtonClick}
                  disabled={disabled}
                  className="w-full h-48 flex flex-col items-center justify-center gap-2 border-dashed"
                >
                  <ImageIcon className="h-8 w-8 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Click to upload image
                  </span>
                  <span className="text-xs text-gray-400">
                    Max size: {maxSizeMB}MB (JPEG, PNG, WebP, GIF)
                  </span>
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

