/**
 * UserProfileMenu - Profile icon with dropdown menu
 * Optimized with React 19 best practices and minimal re-renders
 */
import { memo, useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "../../hooks/authHooks";
import ProfileImageDialog from "./ProfileImageDialog";

/**
 * Gets user initials from name or email
 */
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
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
  return `${baseUrl}${imagePath}`;
};

const UserProfileMenu = memo(() => {
  const { user, signout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
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
    setIsDialogOpen(true);
    setIsMenuOpen(false);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setIsDialogOpen(false);
  }, []);

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
      <ProfileImageDialog isOpen={isDialogOpen} onClose={handleCloseDialog} />
    </>
  );
});

UserProfileMenu.displayName = "UserProfileMenu";

export default UserProfileMenu;

