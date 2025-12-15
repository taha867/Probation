/**
 * DashboardContainer - Handles dashboard business logic
 * Orchestrates dashboard operations and UI state
 */
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/authHooks";
import { TOAST_MESSAGES } from "../utils/constants";
import Dashboard from "../components/Dashboard";

export function DashboardContainer() {
  const { user, signout } = useAuth();
  const navigate = useNavigate();

  // Handle sign out
  const handleSignout = async () => {
    const loadingToast = toast.loading(TOAST_MESSAGES.SIGNING_OUT);

    try {
      await signout();
      toast.dismiss(loadingToast);
      toast.success(TOAST_MESSAGES.SIGNED_OUT_SUCCESS);
      navigate("/auth");
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(TOAST_MESSAGES.SIGNOUT_ERROR);
      console.error(TOAST_MESSAGES.SIGNOUT_ERROR_CONSOLE, error);
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
