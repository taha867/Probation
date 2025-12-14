/**
 * DashboardContainer - Handles dashboard business logic
 * Orchestrates dashboard operations and UI state
 */
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/authHooks";
import Dashboard from "../components/Dashboard";

export function DashboardContainer() {
  const { user, signout } = useAuth();
  const navigate = useNavigate();

  // Handle sign out
  const handleSignout = async () => {
    try {
      await signout();
      navigate("/auth");
    } catch (error) {
      // Signout handles errors internally, but we still navigate
      console.error("Signout error:", error);
      navigate("/auth");
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-10 px-4">
      <Dashboard user={user} onSignout={handleSignout} />
    </div>
  );
}

export default DashboardContainer;
