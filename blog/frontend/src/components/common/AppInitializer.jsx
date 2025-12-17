/**
 * AppInitializer - Loading component for app-level Suspense fallback
 * Shows while the app is initializing authentication state
 */

const AppInitializer = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
        <h2 className="mt-6 text-xl font-semibold text-gray-900">
          Initializing Blogify
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Setting up your experience...
        </p>
      </div>
    </div>
  );
};

export default AppInitializer;
