import {
  memo,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import { useAuth } from "../../hooks/authHooks/authHooks";
import { getImageUrl } from "../../utils/imageUtils";
import { getUserInitials } from "../../utils/authorUtils";

const UserProfileMenu = memo(() => {
  const { user, signout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
      setIsMenuOpen(false);
    }
  }, [signout, navigate]);

  const handleProfile = useCallback(() => {
    setIsMenuOpen(false);
    navigate("/profile");
  }, [navigate]);

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
        </button>

        {/* Dropdown Menu */}
        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white border border-slate-200 py-1 z-50">
            <button
              type="button"
              onClick={handleProfile}
              className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              My Profile
            </button>
            <div className="border-t border-slate-100 my-1"></div>
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
    </>
  );
});

export default UserProfileMenu;
