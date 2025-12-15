/**
 * App component with React Router setup
 * Main application component with routing configuration
 */
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/common/ProtectedRoute";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <Routes>
            {/* Home route - redirects based on auth status */}
            <Route path="/" element={<HomePage />} />

            {/* Authentication route */}
            <Route path="/auth" element={<AuthPage />} />

            {/* Reset password route */}
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* Protected dashboard route */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            {/* Catch all route - redirect to home */}
            <Route path="*" element={<HomePage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
