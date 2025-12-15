import { useAuth } from "../../hooks/authHooks.js";
import { Navigate } from "react-router-dom";
import AuthPage from "../../pages/AuthPage.jsx";

// Component to handle auth route protection
export default function AuthRoute() {

  // isAuthenticated → user logged in?
  // isInitialized → did we finish checking localStorage token?
  const { isAuthenticated, isInitialized } = useAuth();

  // Show loading while initializing
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect authenticated users to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Show auth page for non-authenticated users
  return <AuthPage />;
}
