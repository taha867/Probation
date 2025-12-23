/**
 * ProtectedRoute component for authentication checks
 * Redirects to auth page if user is not authenticated
 */

import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/authHooks";
import AppInitializer from "./AppInitializer.jsx";

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  // useLocation() is used to capture the current URL so you can remember it and potentially redirect
  // the user back there after they authenticate
  const location = useLocation();

  // Show global app initializer while checking authentication
  if (isLoading) {
    return <AppInitializer />;
  }

  // Redirect to auth page if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
