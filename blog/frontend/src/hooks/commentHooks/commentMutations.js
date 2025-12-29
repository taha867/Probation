
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createComment,
  updateComment,
  deleteComment,
} from "../../services/commentService";
import { postCommentsKeys } from "./commentQueries";
import { postDetailKeys } from "../postHooks/postQueries";

/**
 * Hook for creating a new comment or reply
 * Automatically invalidates post comments and post detail
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
        queryClient.invalidateQueries({
          queryKey: postCommentsKeys.lists(),
        });
        queryClient.invalidateQueries({
          queryKey: postDetailKeys.detail(postId),
        });
      }
    },
  });
};

/**
 * Hook for updating an existing comment
 * Automatically invalidates post comments and post detail
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
        queryClient.invalidateQueries({
          queryKey: postCommentsKeys.lists(),
        });
        queryClient.invalidateQueries({
          queryKey: postDetailKeys.detail(postId),
        });
      }
    },
  });
};

/**
 * Hook for deleting a comment
 * Automatically invalidates post comments and post detail
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
      // Also invalidate all post details to refresh comment counts
      queryClient.invalidateQueries({
        queryKey: postDetailKeys.all,
      });
    },
  });
};

