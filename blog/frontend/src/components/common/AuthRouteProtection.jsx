import { useAuth } from "../../hooks/authHooks.js";
import { Navigate } from "react-router-dom";

// Component to handle auth route protection
const AuthRoute = ({ children }) => {
  // isAuthenticated → user logged in?
  const { isAuthenticated } = useAuth();

  // Redirect authenticated users to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Show the specific auth page for non-authenticated users
  return children;
};

export default AuthRoute;
