/**
 * HomeContainer - Handles home page business logic
 * Orchestrates authentication-based routing and UI state
 */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/authHooks";
import LoadingSpinner from "../components/LoadingSpinner";

function HomeContainer() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  // Handle authentication-based routing
  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        // User is authenticated, redirect to dashboard
        navigate("/dashboard", { replace: true });
      } else {
        // User is not authenticated, redirect to auth page
        navigate("/auth", { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Show loading component while determining redirect
  return <LoadingSpinner message="Loading..." />;
}

export default HomeContainer;
