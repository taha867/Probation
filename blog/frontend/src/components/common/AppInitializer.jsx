/**
 * AppInitializer - Global loading component for app-level Suspense fallback
 * Shows while the app is loading any async data (auth, posts, etc.)
 * Single global Suspense boundary for consistent loading experience
 */

const AppInitializer = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
        <h2 className="mt-6 text-xl font-semibold text-gray-900">
          Loading Blogify
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Please wait while we load your data...
        </p>
      </div>
    </div>
  );
};

export default AppInitializer;
