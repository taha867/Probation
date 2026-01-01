
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createComment,
  updateComment,
  deleteComment,
} from "../../services/commentService";
import { postCommentsKeys } from "./commentQueries";

/**
 * Hook for creating a new comment or reply
 * Automatically invalidates post comments for the affected post
 */
export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentData) => {
      const result = await createComment(commentData);
      return result;
    },
    onSuccess: (newComment, variables) => {
      const postId = variables.postId || newComment?.postId;
      if (postId) {
        // Invalidate only this specific post's comments (all pages)
        // Using predicate to match all queries for this postId
        queryClient.invalidateQueries({
          predicate: (query) => {
            const key = query.queryKey;
            return (
              key[0] === "postComments" &&
              key[1] === "list" &&
              key[2] === postId
            );
          },
        });
        // Post detail doesn't display comment count, so no need to invalidate it
      }
    },
  });
};

/**
 * Hook for updating an existing comment
 * Automatically invalidates post comments for the affected post
 */
export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ commentId, body }) => {
      const result = await updateComment(commentId, body);
      return result;
    },
    onSuccess: (updatedComment) => {
      const postId = updatedComment?.postId;
      if (postId) {
        // Invalidate only this specific post's comments (all pages)
        queryClient.invalidateQueries({
          predicate: (query) => {
            const key = query.queryKey;
            return (
              key[0] === "postComments" &&
              key[1] === "list" &&
              key[2] === postId
            );
          },
        });
        // Post detail doesn't display comment count, so no need to invalidate it
      }
    },
  });
};

/**
 * Hook for deleting a comment
 * Automatically invalidates all post comments (since postId is unknown)
 * Note: Backend handles cascading delete for child comments
 */
export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentId) => {
      const result = await deleteComment(commentId);
      return result;
    },
    onSuccess: () => {
      // Invalidate all comment queries since we don't know which post
      queryClient.invalidateQueries({
        queryKey: postCommentsKeys.lists(),
      });
      // Post detail doesn't display comment count, so no need to invalidate it
    },
  });
};

