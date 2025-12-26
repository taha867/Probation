/**
 * Comment Mutations - React Query hooks for comment-related mutations
 * Follows React 19 best practices with proper cache invalidation
 * Single responsibility: All comment-related mutation operations (write)
 */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment } from "../../services/postService";
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

