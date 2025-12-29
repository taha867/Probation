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
      
      const result = await getPostComments(postId, { page, limit });
      const { data } = result;
      const { comments = [], meta = {} } = data || {};

      return {
        comments: comments || [],
        meta: meta || {},
      };
    },
    enabled: !!postId,
    staleTime: 1000 * 30, // 30 seconds
    refetchOnMount: true, // Always refetch when component mounts to ensure fresh data
  });
};

