/**
 * Navigation bar component
 * Shows different navigation based on authentication status
 */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "../hooks/authHooks";

export default function Navbar() {
  const { user, isAuthenticated, signout } = useAuth();
  const navigate = useNavigate();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignout = async () => {
    setIsSigningOut(true);
    try {
      await signout();
      navigate("/auth");
    } catch (error) {
      // Signout handles errors internally, but we still navigate
      console.error("Signout error:", error);
      navigate("/auth");
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-xl font-bold">
              React 19 Auth
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Dashboard
                </Link>
                <span className="text-sm text-muted-foreground">
                  Welcome, {user?.name || user?.email}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignout}
                  disabled={isSigningOut}
                >
                  {isSigningOut ? "Signing out..." : "Sign Out"}
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button variant="default" size="sm">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
