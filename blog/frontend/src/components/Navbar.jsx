/**
 * Navigation bar component
 * Shows different navigation based on authentication status
 * Optimized with React 19 best practices
 */
import { memo, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "../hooks/authHooks";
import UserProfileMenu from "./profile/UserProfileMenu";

const Navbar = memo(() => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Dynamic navigation links based on authentication status
  const links = useMemo(() => {
    const baseLinks = [{ label: "Home", to: "/" }];
    if (isAuthenticated) {
      return [...baseLinks, { label: "Dashboard", to: "/dashboard" }];
    }
    return baseLinks;
  }, [isAuthenticated]);

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
              <UserProfileMenu />
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
});

Navbar.displayName = "Navbar";

export default Navbar;
