import { useQuery } from "@tanstack/react-query";
import { getPostComments } from "../../services/commentService";

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

/**
 * Hook for fetching comments for a specific post
 */
export const usePostComments = (postId, page = 1, limit = 10) => {
  return useQuery({
    queryKey: postCommentsKeys.list(postId, page, limit),
    queryFn: async () => {
      // getPostComments returns { post, comments, meta } (fetchClient already extracts data)
      const result = await getPostComments(postId, { page, limit });
      const { comments = [], meta = {} } = result || {};

      return {
        comments: comments || [],
        meta: meta || {},
      };
    },
    enabled: !!postId,
    staleTime: 1000 * 30, // 30 seconds
    // Removed refetchOnMount: true - React Query handles refetching intelligently
    // It will refetch when data is stale, but not when fresh (within staleTime)
  });
};
