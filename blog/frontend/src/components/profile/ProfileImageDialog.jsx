/**
 * ProfileImageDialog - Dialog component for updating user profile image
 * Optimized with React 19 best practices and minimal re-renders
 */
import { memo, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { object, mixed } from "yup";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormFileInput } from "../custom";
import { useAuth } from "../../hooks/authHooks";
import { createSubmitHandlerWithToast } from "../../utils/formSubmitWithToast";

// Validation schema for profile image
const profileImageSchema = object({
  image: mixed()
    .nullable()
    .transform((value, originalValue) => {
      // Normalize empty objects to null
      if (value && typeof value === "object" && !(value.image) && Object.keys(value).length === 0) {
        return null;
      }
      return value;
    })
    .test("image-format", "Image must be a valid Cloudinary upload result or URL", (value) => {
      if (!value || value === null) return true; // Optional field
      if (typeof value === "string") return true; // Existing image URL
      if (typeof value === "object" && value.image && value.imagePublicId) {
        // Cloudinary upload result
        return typeof value.image === "string" && value.image.length > 0;
      }
      return false;
    }),
});

const ProfileImageDialog = memo(({ isOpen, onClose }) => {
  const [isPending, startTransition] = useTransition();
  const { user, updateProfileImage } = useAuth();

  const form = useForm({
    resolver: yupResolver(profileImageSchema),
    defaultValues: {
      image: null, // Always start with null, we'll set the preview separately
    },
    mode: "onChange",
  });

  // Reset form when dialog opens/closes or user changes
  useEffect(() => {
    if (isOpen) {
      // When dialog opens, reset to null (not the user image URL)
      // The FormFileInput will handle showing the existing image via preview
      form.reset({ image: null });
    }
  }, [isOpen, form]);

  const onSubmit = async (data) => {
    try {
      // Normalize the image value - handle empty objects or null
      const imageValue = data.image;
      
      // Only submit if a new image was uploaded to Cloudinary
      if (imageValue && typeof imageValue === "object" && imageValue.image) {
        await updateProfileImage(imageValue);
        
        // Non-urgent: Form reset and dialog close can be deferred
        startTransition(() => {
          form.reset({ image: null });
          onClose();
        });
      } else {
        // No new image uploaded, just close
        onClose();
      }
    } catch (error) {
      // Error handling is done by axios interceptor
    }
  };

  const handleSubmit = createSubmitHandlerWithToast(form, onSubmit);

  const handleClose = () => {
    form.reset({ image: user?.image || null });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Profile Image</DialogTitle>
          <DialogDescription>
            Upload a new profile image. Supported formats: JPEG, PNG, WebP, GIF. Max size: 5MB.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormFileInput
              control={form.control}
              name="image"
              label="Profile Image"
              accept="image/*"
              maxSizeMB={5}
              disabled={isPending}
              existingImageUrl={user?.image || null}
              folder="blog/users"
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Updating..." : "Update Image"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
});

ProfileImageDialog.displayName = "ProfileImageDialog";

export default ProfileImageDialog;

