import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/authHooks.js";
import AppInitializer from "./AppInitializer.jsx";

// Component to handle auth route protection
const AuthRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show global app initializer while checking authentication
  if (isLoading) {
    return <AppInitializer />;
  }

  // Redirect authenticated users to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Show the specific auth page for non-authenticated users
  return <Outlet />;
};

export default AuthRoute;
