/**
 * Navigation bar component
 * Shows different navigation based on authentication status
 */
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "../hooks/authHooks";
import {
  getCurrentUser,
  isAuthenticated as checkAuth,
} from "../utils/tokenUtils";
import { TOAST_MESSAGES } from "../utils/constants";

const Navbar = () => {
  const { signout } = useAuth();
  const user = getCurrentUser();
  const isAuthenticated = checkAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignout = async () => {
    setIsSigningOut(true);
    try {
      await signout();
      navigate("/signin");
    } catch (error) {
      // Signout handles errors internally, but we still navigate
      console.error(TOAST_MESSAGES.SIGNOUT_ERROR_CONSOLE, error);
      navigate("/signin");
    } finally {
      setIsSigningOut(false);
    }
  };

  // Dynamic navigation links based on authentication status
  const getNavigationLinks = () => {
    const baseLinks = [
      { label: "Home", to: "/" },
      { label: "Blog", to: "/blog" },
    ];

    if (isAuthenticated) {
      return [...baseLinks, { label: "Dashboard", to: "/dashboard" }];
    }

    return baseLinks;
  };

  const links = getNavigationLinks();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 border-b bg-white/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center px-4">
        {/* Logo/Brand - Extreme Left */}
        <div className="flex-shrink-0">
          <Link
            to="/"
            className="flex items-center gap-2 text-lg font-semibold text-slate-900"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white font-bold">
              B
            </span>
            Blogify
          </Link>
        </div>

        {/* Navigation Links - Center */}
        <div className="flex-1 flex justify-center">
          <div className="hidden items-center gap-6 md:flex">
            {links.map((link) => (
              <Link
                key={`${link.label}-${link.to}`}
                to={link.to}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.to)
                    ? "text-blue-600"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Auth Actions - Extreme Right */}
        <div className="flex-shrink-0">
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="hidden text-sm text-slate-600 sm:inline">
                  Welcome, {user?.name || user?.email}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignout}
                  disabled={isSigningOut}
                >
                  {isSigningOut ? "Signing out..." : "Logout"}
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/signin">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
