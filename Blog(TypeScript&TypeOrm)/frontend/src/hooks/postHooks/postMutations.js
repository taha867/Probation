/**
 * Post Mutations - React Query hooks for post-related mutations
 */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost, updatePost, deletePost } from "../../services/postService";
import { homePostsKeys, userPostsKeys, postDetailKeys } from "./postQueries";
import { POST_STATUS } from "../../utils/constants";

const { PUBLISHED } = POST_STATUS;
/**
 * Hook for creating a new post
 * Automatically invalidates user posts and home posts (if published)
 */
export const useCreatePost = () => {
  const queryClient = useQueryClient();
  const { invalidateQueries } = queryClient;
  return useMutation({
    mutationFn: async (formData) => {
      // FormData middleware handles Content-Type automatically
      return await createPost(formData);
    },
    onSuccess: (newPost) => {
      invalidateQueries({ queryKey: userPostsKeys.all });
      if (newPost?.status === PUBLISHED) {
        invalidateQueries({ queryKey: homePostsKeys.all });
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
  const { invalidateQueries } = queryClient;

  return useMutation({
    mutationFn: async ({ postId, formData, previousStatus }) => {
      // FormData middleware handles Content-Type automatically
      const updatedPost = await updatePost(postId, formData);
      return { updatedPost, previousStatus };
    },
    onSuccess: ({ updatedPost, previousStatus }, variables) => {
      const { postId } = variables;

      // Invalidate post detail cache so the detail page shows updated data immediately
      invalidateQueries({ queryKey: postDetailKeys.detail(postId) });

      // Invalidate user posts list (dashboard)
      invalidateQueries({ queryKey: userPostsKeys.all });

      // Invalidate home posts if status changed to/from published
      const wasPublished = previousStatus === PUBLISHED;
      const isNowPublished = updatedPost?.status === PUBLISHED;
      if (wasPublished || isNowPublished) {
        invalidateQueries({ queryKey: homePostsKeys.all });
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
  const { invalidateQueries } = queryClient;

  return useMutation({
    mutationFn: async ({ postId, wasPublished }) => {
      await deletePost(postId);
      return { postId, wasPublished };
    },
    onSuccess: ({ wasPublished }) => {
      invalidateQueries({ queryKey: userPostsKeys.all });
      if (wasPublished) {
        invalidateQueries({ queryKey: homePostsKeys.all });
      }
    },
  });
};
