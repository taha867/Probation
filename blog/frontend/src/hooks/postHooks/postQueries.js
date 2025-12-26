import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../../contexts/authContext";
import { fetchAllPosts, fetchUserPosts, getPostDetails } from "../../services/postService";
import { POST_STATUS } from "../../utils/constants";


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

export const userPostsKeys = {
  all: ["userPosts"],
  lists: () => [...userPostsKeys.all, "list"],
  list: (userId, page, limit, search) => [
    ...userPostsKeys.lists(),
    userId,
    page,
    limit,
    search || "",
  ],
};

export const postDetailKeys = {
  all: ["postDetail"],
  detail: (postId) => [...postDetailKeys.all, postId],
};


/**
 * Hook for fetching home page posts (published only)
 * @param {number} page - Current page number (default: 1)
 * @param {number} limit - Number of posts per page
 * @param {string} search - Search query string
 * @returns {Object} React Query result with posts data, loading, error states
 */
export const useHomePosts = (page = 1, limit, search) => {
  return useQuery({
    queryKey: homePostsKeys.list(page, limit, search),
    queryFn: async () => {
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

/**
 * Hook for fetching user's posts (dashboard)
 * @param {number} page - Current page number (default: 1)
 * @param {number} limit - Number of posts per page
 * @param {string} search - Search query string
 * @returns {Object} React Query result with posts data, loading, error states
 */
export const useUserPosts = (page = 1, limit, search) => {
  const {
    state: { user },
  } = useAuthContext();
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
    enabled: !!userId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

/**
 * Hook for fetching a single post by ID
 * @param {number} postId - The ID of the post to fetch
 * @returns {Object} React Query result with post data, loading, error states
 */
export const usePostDetail = (postId) => {
  return useQuery({
    queryKey: postDetailKeys.detail(postId),
    queryFn: async () => {
      if (!postId) {
        return null;
      }
      const post = await getPostDetails(postId);
      return post;
    },
    enabled: !!postId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

