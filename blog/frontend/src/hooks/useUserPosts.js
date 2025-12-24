/**
 * useUserPosts - React Query hook for fetching user-specific posts
 * Fetches posts for authenticated user's dashboard
 * Automatically handles caching, refetching, and error states
 */
import { useQuery } from "@tanstack/react-query";
import { fetchUserPosts } from "../services/postService";
import { useAuthContext } from "../contexts/authContext";

// Query key factory for type-safe cache management
// Create unique query keys for caching and invalidation.
export const userPostsKeys = {
  all: ["userPosts"], // Base key for user posts cache. all user posts queries
  lists: () => [...userPostsKeys.all, "list"], // all lists
  // individual list pages, include search so each search has its own cache entry
  list: (userId, page, limit, search) => [
    ...userPostsKeys.lists(),
    userId,
    page,
    limit,
    search || "",
  ],
};

/**
 * Custom hook for fetching user's posts
 * @param {number} page - Current page number (default: 1)
 * @param {number} limit - Number of posts per page (default: 10)
 * @returns {Object} React Query result with posts data, loading, error states
 */
export const useUserPosts = (page = 1, limit, search) => {
  const { state: { user } } = useAuthContext();
  const userId = user?.id;

  return useQuery({
    queryKey: userPostsKeys.list(userId, page, limit, search),
    queryFn: async () => {
      if (!userId) {
        return { posts: [], pagination: { limit, total: 0 } };
      }
      const result = await fetchUserPosts(userId, {
        page,
        limit,
        search: search || undefined,
      });
      return {
        posts: result.posts || [],
        pagination: result.pagination || { limit, total: 0 },
      };
    },
    enabled: !!userId, // Only run query if user is authenticated
    staleTime: 1000 * 60 * 2, // 2 minutes - posts are fresh for 2 minutes
  });
};

