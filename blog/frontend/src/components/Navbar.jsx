import { memo, useMemo, useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useAuth } from "../hooks/authHooks/authHooks";
import UserProfileMenu from "./profile/UserProfileMenu";

const Navbar = memo(() => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Dynamic navigation links based on authentication status
  const links = useMemo(() => {
    const baseLinks = [{ label: "Home", to: "/" }];
    if (isAuthenticated) {
      return [...baseLinks, { label: "Dashboard", to: "/dashboard" }];
    }
    return baseLinks;
  }, [isAuthenticated]);

  const isActive = (path) => location.pathname === path;

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMobileMenuOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  return (
    <>
      <nav className="sticky top-0 z-40 border-b bg-white/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center px-4">
          {/* Mobile Menu Button + Logo/Brand - Extreme Left */}
          <div className="flex-shrink-0 flex items-center gap-3">
            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>

            {/* Logo/Brand */}
            <Link
              to="/"
              className="flex items-center gap-2 text-lg font-semibold text-slate-900 hover:opacity-80 transition-opacity"
              onClick={closeMobileMenu}
            >
              <img
                src="/AppLogo.jpeg"
                alt="Blogify Logo"
                className="h-16 w-auto object-contain"
              />
              <span className="hidden sm:inline">Blogify</span>
            </Link>
          </div>

          {/* Navigation Links - Center (Desktop) */}
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
          <div className="flex-shrink-0 flex items-center gap-3">
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
      </nav>

      {/* Mobile Menu Overlay & Menu */}
      <div
        className={`fixed inset-0 z-50 md:hidden ${
          isMobileMenuOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
            isMobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={closeMobileMenu}
          aria-hidden="true"
        />

        {/* Mobile Menu Panel */}
        <div
          className={`absolute left-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Menu Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <span className="text-lg font-semibold text-slate-900">Menu</span>
              <button
                type="button"
                onClick={closeMobileMenu}
                className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 overflow-y-auto py-6">
              <div className="flex flex-col">
                {links.map((link, index) => (
                  <Link
                    key={`${link.label}-${link.to}`}
                    to={link.to}
                    onClick={closeMobileMenu}
                    className={`px-6 py-4 text-base font-medium transition-all duration-200 mobile-menu-item ${
                      isActive(link.to)
                        ? "text-blue-600 bg-blue-50 border-r-4 border-blue-600"
                        : "text-slate-700 hover:text-blue-600 hover:bg-slate-50"
                    }`}
                    style={{
                      animationDelay: `${index * 50}ms`,
                      opacity: isMobileMenuOpen ? 1 : 0,
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
});

export default Navbar;
