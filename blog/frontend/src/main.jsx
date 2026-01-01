import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./contexts/authContext.jsx";
import AppInitializer from "./components/common/AppInitializer.jsx";
import { ErrorBoundary } from "react-error-boundary";
import { AuthFallback } from "./components/common/AuthFallback.jsx";

// Central cache/ data manager
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 minutes - data is fresh for 2 minutes (freshness of data)
      gcTime: 1000 * 60 * 5, // 5 minutes (formerly cacheTime) - unused data kept for 5 minutes (how long the data is kept in memory)
      retry: (failureCount, error) => {
        // Don't retry on 401 (token refresh handles it)
        if (error?.status === 401) return false;

        // Don't retry on client errors (4xx)
        if (error?.status >= 400 && error?.status < 500) return false;

        // Retry once on network errors and server errors (5xx)
        return failureCount < 1;
      },
      refetchOnWindowFocus: false, // by default on switch tabs or comes back to the window → queries refetch automatically(it prevents that)
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary
      FallbackComponent={AuthFallback}
      onReset={() => window.location.reload()} // retry
    >
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<AppInitializer />}>
          <AuthProvider>
            <App />
          </AuthProvider>
        </Suspense>
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>
);
