import { useQuery } from "@tanstack/react-query";
import { fetchAllPosts } from "../services/postService";
import { POST_STATUS } from "../utils/constants";

// Query key factory for type-safe cache management
export const homePostsKeys = {
  all: ["homePosts"],
  lists: () => [...homePostsKeys.all, "list"],
  list: (page, limit, search) => [
    ...homePostsKeys.lists(),
    page,
    limit,
    search || "",
  ],
};

/**
 * Custom hook for fetching home page posts
 * @param {number} page - Current page number (default: 1)
 * @param {number} limit - Number of posts per page (default: 3)
 * @returns {Object} React Query result with posts data, loading, error states
 */
export const useHomePosts = (page = 1, limit, search) => {
  // gives access to central cache and query management
  return useQuery({
    queryKey: homePostsKeys.list(page, limit, search),
    queryFn: async () => {
      // Fetch only published posts from backend
      const result = await fetchAllPosts({
        page,
        limit,
        status: POST_STATUS.PUBLISHED,
        search: search || undefined,
      });
      return {
        posts: result.posts || [],
        pagination: result.pagination || {},
      };
    },
  });
};

