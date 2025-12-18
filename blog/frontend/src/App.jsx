import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage.jsx";
import CreatePostPage from "./pages/CreatePostPage.jsx";
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
import ToastNotification from "./components/common/ToastNotification.jsx";

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

            {/* Protected create post route */}
            <Route
              path="/create-post"
              element={
                <ProtectedRoute>
                  <CreatePostPage />
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
      <ToastNotification />
    </Router>
  );
};

export default App;
