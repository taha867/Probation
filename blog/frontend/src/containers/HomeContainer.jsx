/**
 * HomeContainer - Home page container
 * Business logic: Fetches posts using postService
 * UI: Delegates to Home component
 */
import { useState, useEffect } from "react";
import { isAuthenticated as checkAuth } from "../utils/tokenUtils";
import { fetchAllPosts } from "../services/postService";
import Home from "../components/home/Home";

const HomeContainer = () => {
  const isAuthenticated = checkAuth();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setIsLoading(true);
        const result = await fetchAllPosts();
        setPosts(result.posts || []);
      } catch (error) {
        console.error("Failed to load posts:", error);
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading posts...</p>
        </div>
      </div>
    );
  }

  return <Home posts={posts} isAuthenticated={isAuthenticated} />;
};

export default HomeContainer;
