/**
 * Post Mutations - React Query hooks for post-related mutations
 */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost, updatePost, deletePost } from "../../services/postService";
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
      // FormData middleware handles Content-Type automatically
      return await createPost(formData);
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
      // FormData middleware handles Content-Type automatically
      const updatedPost = await updatePost(postId, formData);
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
      await deletePost(postId);
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

