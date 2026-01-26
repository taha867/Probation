import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../authHooks/authHooks";
import {
  fetchAllPosts,
  fetchUserPosts,
  getPostDetails,
} from "../../services/postService";
import { POST_STATUS } from "../../utils/constants";

const { PUBLISHED } = POST_STATUS;
import {
  homePostsKeys,
  userPostsKeys,
  postDetailKeys,
} from "../../utils/queryKeys";


export const useHomePosts = (page = 1, limit, search) => {
  return useQuery({
    queryKey: homePostsKeys.list(page, limit, search),
    queryFn: async () => {
      const result = await fetchAllPosts({
        page,
        limit,
        status: PUBLISHED,
        search: search || undefined,
      });
      const { posts = [], pagination = {} } = result;
      return {
        posts,
        pagination,
      };
    },
    staleTime: 1000 * 60 * 1, // 1 minute - home posts refresh more frequently
  });
};

/**
 * Hook for fetching user's posts (dashboard)
 */
export const useUserPosts = (page = 1, limit, search, status) => {
  const { user: { id: userId } = {} } = useAuth();

  return useQuery({
    queryKey: userPostsKeys.list(userId, page, limit, search, status),
    queryFn: async () => {

      // No need for null check here - enabled option prevents query when userId is falsy
      const result = await fetchUserPosts(userId, {
        page,
        limit,
        search: search || undefined,
        status: status || undefined,
      });
      const { posts = [], pagination = {} } = result;
      return {
        posts,
        pagination,
      };
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

/**
 * Hook for fetching a single post by ID
 */
export const usePostDetail = (postId) => {
  return useQuery({
    queryKey: postDetailKeys.detail(postId),
    queryFn: async () => {
      return await getPostDetails(postId);
    },
    enabled: !!postId,
    staleTime: 1000 * 60 * 5, // 5 minutes - post details change less frequently
  });
};
