/**
 * Comment Queries - React Query hooks for comment-related data fetching
 * Follows React 19 best practices with proper cache management
 * Single responsibility: All comment-related query operations (read)
 */
import { useQuery } from "@tanstack/react-query";
import { getPostComments } from "../../services/postService";

// ============================================================================
// Query Key Factory
// ============================================================================

export const postCommentsKeys = {
  all: ["postComments"],
  lists: () => [...postCommentsKeys.all, "list"],
  list: (postId, page, limit) => [
    ...postCommentsKeys.lists(),
    postId,
    page,
    limit,
  ],
};

// ============================================================================
// Query Hooks
// ============================================================================

/**
 * Hook for fetching comments for a specific post
 * @param {number} postId - The ID of the post
 * @param {number} page - Current page number (default: 1)
 * @param {number} limit - Number of comments per page (default: 10)
 * @returns {Object} React Query result with comments data, loading, error states
 */
export const usePostComments = (postId, page = 1, limit = 10) => {
  return useQuery({
    queryKey: postCommentsKeys.list(postId, page, limit),
    queryFn: async () => {
      if (!postId) {
        return { comments: [], meta: { total: 0, page: 1, limit } };
      }
      const result = await getPostComments(postId, { page, limit });
      // Backend returns: { data: { post, comments, meta } }
      // result is already response.data, so we access result.data
      const { data } = result;
      const { comments = [], meta = {} } = data || {};

      return {
        comments: comments || [],
        meta: meta || { total: 0, page: 1, limit },
      };
    },
    enabled: !!postId,
    staleTime: 1000 * 30, // 30 seconds
  });
};

