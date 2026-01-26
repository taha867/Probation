import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { getPostComments } from "../../services/commentService";
import { COMMENTS_PER_PAGE } from "../../utils/constants";

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
 * Hook for fetching comments for a specific post with infinite scrolling/load more support
 */
export const usePostComments = (postId, limit = COMMENTS_PER_PAGE) => {
  return useInfiniteQuery({ //STORES DATA AS ARRAY OF PAGES
    queryKey: postCommentsKeys.list(postId, "infinite", limit),
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const result = await getPostComments(postId, { page: pageParam, limit });
      return result || { comments: [], meta: {} };
    },
    getNextPageParam: (lastPage, allPages) => {
      const { meta } = lastPage;
      if (!meta || !meta.total) return undefined;
      
      const loadedCount = allPages.length * limit;
      return loadedCount < meta.total ? allPages.length + 1 : undefined;
    },
    enabled: !!postId,
    staleTime: 1000 * 30,
  });
};
