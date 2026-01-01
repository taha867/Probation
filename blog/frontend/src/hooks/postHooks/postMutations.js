/**
 * Post Mutations - React Query hooks for post-related mutations
 */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../utils/axiosInstance";
import { homePostsKeys, userPostsKeys, postDetailKeys } from "./postQueries";
import { POST_STATUS } from "../../utils/constants";

/**
 * Hook for creating a new post
 * Automatically invalidates user posts and home posts (if published)
 */
export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData) => {
      // Send FormData (multipart/form-data)
      // Axios automatically sets Content-Type with boundary when FormData is passed
      const response = await axiosInstance.post("/posts", formData);
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
    mutationFn: async ({ postId, formData, previousStatus }) => {
      // Send FormData (multipart/form-data)
      // Axios automatically sets Content-Type with boundary when FormData is passed
      const response = await axiosInstance.put(`/posts/${postId}`, formData);
      const { data: { data: updatedPost } = {} } = response;
      return { updatedPost, previousStatus };
    },
    onSuccess: ({ updatedPost, previousStatus }, variables) => {
      const { postId } = variables;
      
      // Invalidate post detail cache so the detail page shows updated data immediately
      queryClient.invalidateQueries({ queryKey: postDetailKeys.detail(postId) });
      
      // Invalidate user posts list (dashboard)
      queryClient.invalidateQueries({ queryKey: userPostsKeys.all });
      
      // Invalidate home posts if status changed to/from published
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

