/**
 * Post Mutations - React Query hooks for post-related mutations
 * Follows React 19 best practices with proper cache invalidation
 * Single responsibility: All post-related mutation operations (write)
 */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../utils/axiosInstance";
import { homePostsKeys, userPostsKeys } from "./postQueries";
import { POST_STATUS } from "../../utils/constants";

/**
 * Hook for creating a new post
 * Automatically invalidates user posts and home posts (if published)
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
      queryClient.invalidateQueries({ queryKey: userPostsKeys.all });
      if (newPost?.status === POST_STATUS.PUBLISHED) {
        queryClient.invalidateQueries({ queryKey: homePostsKeys.all });
      }
    },
  });
};

/**
 * Hook for updating an existing post
 * Automatically invalidates user posts and home posts (if status changed)
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
      queryClient.invalidateQueries({ queryKey: userPostsKeys.all });
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
      return { postId, wasPublished };
    },
    onSuccess: ({ wasPublished }) => {
      queryClient.invalidateQueries({ queryKey: userPostsKeys.all });
      if (wasPublished) {
        queryClient.invalidateQueries({ queryKey: homePostsKeys.all });
      }
    },
  });
};

