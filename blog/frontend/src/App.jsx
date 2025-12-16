/**
 * App component with React Router setup
 * Main application component with routing configuration
 */
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import DashboardPage from "./pages/DashboardPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import BlogPage from "./pages/BlogPage.jsx";
import SignInPage from "./pages/AuthPages/SignInPage.jsx";
import SignUpPage from "./pages/AuthPages/SignUpPage.jsx";
import ForgotPasswordPage from "./pages/AuthPages/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./pages/AuthPages/ResetPasswordPage.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";
import AuthRoute from "./components/common/AuthRouteProtection.jsx";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            {/* Home route */}
            <Route path="/" element={<HomePage />} />

            {/* Blog route */}
            <Route path="/blog" element={<BlogPage />} />

            {/* Authentication routes - redirect if already authenticated */}
            <Route
              path="/signin"
              element={
                <AuthRoute>
                  <SignInPage />
                </AuthRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <AuthRoute>
                  <SignUpPage />
                </AuthRoute>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <AuthRoute>
                  <ForgotPasswordPage />
                </AuthRoute>
              }
            />
            <Route
              path="/reset-password"
              element={
                <AuthRoute>
                  <ResetPasswordPage />
                </AuthRoute>
              }
            />

            {/* Legacy auth route - redirect to signin */}
            <Route
              path="/auth"
              element={
                <AuthRoute>
                  <SignInPage />
                </AuthRoute>
              }
            />

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
        <Footer />
      </div>

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#fff",
            color: "#363636",
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            padding: "16px",
            fontSize: "14px",
            fontWeight: "500",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
            style: {
              border: "1px solid #10b981",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
            style: {
              border: "1px solid #ef4444",
            },
          },
          loading: {
            iconTheme: {
              primary: "#3b82f6",
              secondary: "#fff",
            },
          },
        }}
      />
    </Router>
  );
};

export default App;
