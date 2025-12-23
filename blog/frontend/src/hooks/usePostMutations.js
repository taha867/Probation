/**
 * usePostMutations - React Query hooks for post mutations (create, update, delete)
 * Automatically invalidates relevant queries to keep UI in sync
 * Follows React 19 best practices with proper cache invalidation
 */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosInstance";
import { homePostsKeys } from "./useHomePosts";
import { userPostsKeys } from "./useUserPosts";
import { POST_STATUS } from "../utils/constants";

/**
 * Hook for creating a new post
 * Automatically invalidates user posts and home posts (if published)
 * Sends JSON payload (image already uploaded to Cloudinary)
 */
export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const response = await axiosInstance.post("/posts", payload);
      const { data: { data } = {} } = response;
      return data;
    },
    onSuccess: (newPost) => {
      // Invalidate user posts to refetch dashboard
      queryClient.invalidateQueries({ queryKey: userPostsKeys.all });
      
      // If post is published, invalidate home posts too
      if (newPost?.status === POST_STATUS.PUBLISHED) {
        queryClient.invalidateQueries({ queryKey: homePostsKeys.all });
      }
    },
  });
};

/**
 * Hook for updating an existing post
 * Automatically invalidates user posts and home posts (if status changed)
 * Sends JSON payload (image already uploaded to Cloudinary)
 */
export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, data, previousStatus }) => {
      const response = await axiosInstance.put(`/posts/${postId}`, data);
      const { data: { data: updatedPost } = {} } = response;
      return { updatedPost, previousStatus };
    },
    onSuccess: ({ updatedPost, previousStatus }) => {
      // Invalidate user posts to refetch dashboard
      queryClient.invalidateQueries({ queryKey: userPostsKeys.all });
      
      // If post status changed to/from published, invalidate home posts
      const wasPublished = previousStatus === POST_STATUS.PUBLISHED;
      const isNowPublished = updatedPost?.status === POST_STATUS.PUBLISHED;
      
      if (wasPublished || isNowPublished) {
        queryClient.invalidateQueries({ queryKey: homePostsKeys.all });
      }
    },
  });
};

/**
 * Hook for deleting a post
 * Automatically invalidates user posts and home posts (if was published)
 */
export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, wasPublished }) => {
      await axiosInstance.delete(`/posts/${postId}`);
      return { postId, wasPublished }; // Return for onSuccess context
    },
    onSuccess: ({ wasPublished }) => {
      // Invalidate user posts to refetch dashboard
      queryClient.invalidateQueries({ queryKey: userPostsKeys.all });
      
      // If deleted post was published, invalidate home posts
      if (wasPublished) {
        queryClient.invalidateQueries({ queryKey: homePostsKeys.all });
      }
    },
  });
};

