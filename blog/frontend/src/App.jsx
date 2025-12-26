import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage.jsx";
import CreatePostPage from "./pages/CreatePostPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import PostDetailPage from "./pages/PostDetailPage.jsx";
import SignInPage from "./pages/AuthPages/SignInPage.jsx";
import SignUpPage from "./pages/AuthPages/SignUpPage.jsx";
import ForgotPasswordPage from "./pages/AuthPages/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./pages/AuthPages/ResetPasswordPage.jsx";
import ChangePasswordPage from "./pages/AuthPages/ChangePasswordPage.jsx";
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
            {/* ---------- Public routes ---------- */}
            <Route path="/" element={<HomePage />} />
            <Route path="/posts/:id" element={<PostDetailPage />} />

            {/* Authentication routes - redirect if already authenticated */}
            <Route element={<AuthRoute />}>
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/auth" element={<SignInPage />} />
            </Route>

            {/* ---------- Protected routes (auth required) ---------- */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/create-post" element={<CreatePostPage />} />
              <Route path="/change-password" element={<ChangePasswordPage />} />
            </Route>

            {/* ---------- Fallback route ---------- */}
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
