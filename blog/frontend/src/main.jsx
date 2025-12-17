import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./contexts/authContext.jsx";
import AppInitializer from "./components/common/AppInitializer.jsx";
import { ErrorBoundary } from "react-error-boundary";
import { AuthFallback } from "./components/common/AuthFallback.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary
      FallbackComponent={AuthFallback}
      onReset={() => window.location.reload()} // retry
    >
      <Suspense fallback={<AppInitializer />}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </Suspense>
    </ErrorBoundary>
  </StrictMode>
);
