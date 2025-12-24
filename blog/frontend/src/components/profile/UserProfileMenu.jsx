/**
 * UserProfileMenu - Profile icon with dropdown menu
 * Optimized with React 19 best practices and minimal re-renders
 */
import { memo, useState, useRef, useEffect, useCallback, useTransition } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LogOut, Edit2 } from "lucide-react";
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
import { useImperativeDialog } from "../../hooks/useImperativeDialog";
import { createSubmitHandlerWithToast } from "../../utils/formSubmitWithToast";
import { profileImageSchema } from "../../validations/userSchemas";

const getUserInitials = (user) => {
  if (user?.name) {
    const names = user.name.trim().split(/\s+/);
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return user.name[0]?.toUpperCase() || "U";
  }
  if (user?.email) {
    return user.email[0]?.toUpperCase() || "U";
  }
  return "U";
};

/**
 * Gets full image URL from relative path
 */
const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith("http")) return imagePath;
  const baseUrl = import.meta.env.VITE_API_BASE_URL ;
  return `${baseUrl}${imagePath}`;
};

const UserProfileMenu = memo(() => {
  const { user, signout, updateProfileImage } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const menuRef = useRef(null);

  // Dialog state via shared hook
  const {
    isOpen: isDialogOpen,
    openDialog: openDialogState,
    closeDialog: closeDialogState,
  } = useImperativeDialog(null);

  // Form setup for profile image upload
  const form = useForm({
    resolver: yupResolver(profileImageSchema),
    defaultValues: {
      image: null, // Always start with null, FormFileInput will handle showing existing image via preview
    },
    mode: "onChange",
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (isDialogOpen) {
      // When dialog opens, reset to null (not the user image URL)
      // The FormFileInput will handle showing the existing image via preview
      form.reset({ image: null });
    }
  }, [isDialogOpen, form]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isMenuOpen]);

  const handleSignout = useCallback(async () => {
    try {
      await signout();
      setIsMenuOpen(false);
      navigate("/signin");
    } catch (error) {
      // Error handling is done by signout function
      setIsMenuOpen(false);
    }
  }, [signout, navigate]);

  const handleEditImage = useCallback(() => {
    openDialogState(null); // No payload needed for this dialog
    setIsMenuOpen(false);
  }, [openDialogState]);

  const handleCloseDialog = useCallback(() => {
    form.reset({ image: user?.image || null });
    closeDialogState();
  }, [form, user?.image, closeDialogState]);

  // Handle form submission for profile image update
  const onSubmit = useCallback(
    async (data) => {
      try {
        // Normalize the image value - handle empty objects or null
        const imageValue = data.image;

        // Only submit if a new image was uploaded to Cloudinary
        if (imageValue && typeof imageValue === "object" && imageValue.image) {
          await updateProfileImage(imageValue);

          // Non-urgent: Form reset and dialog close can be deferred
          startTransition(() => {
            form.reset({ image: null });
            closeDialogState();
          });
        } else {
          // No new image uploaded, just close
          closeDialogState();
        }
      } catch (error) {
        // Error handling is done by axios interceptor
      }
    },
    [updateProfileImage, form, startTransition]
  );

  const handleSubmit = createSubmitHandlerWithToast(form, onSubmit);

  if (!user) return null;

  const imageUrl = getImageUrl(user.image);
  const initials = getUserInitials(user);

  return (
    <>
      <div className="relative" ref={menuRef}>
        {/* Profile Avatar Button */}
        <button
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="relative flex items-center justify-center h-9 w-9 rounded-full overflow-hidden border-2 border-slate-200 hover:border-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="User menu"
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={user.name || user.email}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to initials if image fails to load
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
          ) : null}
          <div
            className={`w-full h-full flex items-center justify-center bg-blue-600 text-white text-sm font-semibold ${
              imageUrl ? "hidden" : ""
            }`}
          >
            {initials}
          </div>
          {/* Edit Icon Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
            <Edit2 className="h-4 w-4 text-white" />
          </div>
        </button>

        {/* Dropdown Menu */}
        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white border border-slate-200 py-1 z-50">
            <button
              type="button"
              onClick={handleEditImage}
              className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 flex items-center gap-2"
            >
              <Edit2 className="h-4 w-4" />
              Edit Profile Image
            </button>
            <button
              type="button"
              onClick={handleSignout}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Profile Image Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
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
                  onClick={handleCloseDialog}
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
    </>
  );
});

export default UserProfileMenu;
