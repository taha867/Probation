/**
 * DeletePostDialog - Local dialog component for delete confirmation
 * Uses a small imperative dialog hook to keep state minimal and focused.
 */
import { forwardRef, useImperativeHandle } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeletePost } from "../../hooks/postHooks/postMutations";
import { useImperativeDialog } from "../../hooks/useImperativeDialog";
import { POST_STATUS } from "../../utils/constants";

const DeletePostDialog = forwardRef((props, ref) => {
  // Local dialog state via shared hook
  const {
    isOpen,
    payload: postToDelete,
    openDialog: openDialogState,
    closeDialog: closeDialogState,
  } = useImperativeDialog(null);

  // React Query mutation - handles API call and cache invalidation automatically
  const deletePostMutation = useDeletePost();

  // Expose methods to parent via ref
  useImperativeHandle(
    ref,
    () => ({
      // Expect full post object so we don't need extra queries here
      openDialog: (post) => {
        if (!post) return;
        openDialogState({
          id: post.id,
          title: post.title,
          status: post.status,
        });
      },
      closeDialog: () => {
        if (!deletePostMutation.isPending) {
          closeDialogState();
        }
      },
    }),
    [openDialogState, closeDialogState, deletePostMutation.isPending]
  );

  const handleConfirmDelete = async () => {
    if (!postToDelete?.id) return;

    try {
      // Check if the post being deleted is published (to invalidate home posts)
      const isPublished = postToDelete?.status === POST_STATUS.PUBLISHED;

      // React Query mutation handles API call and cache invalidation automatically
      // Pass wasPublished so mutation can invalidate home posts if needed
      await deletePostMutation.mutateAsync({
        postId: postToDelete.id,
        wasPublished: isPublished || false,
      });

      // Close dialog after successful deletion
      closeDialogState();
    } catch (error) {
      // Error handling is done by React Query and axios interceptor
    }
  };

  const handleCancel = () => {
    if (!deletePostMutation.isPending) {
      closeDialogState();
    }
  };

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open) => {
        // Only handle close events from the dialog
        if (!open) {
          handleCancel();
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Post</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "
            {postToDelete?.title || "this post"}"? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deletePostMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirmDelete}
            disabled={deletePostMutation.isPending}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            {deletePostMutation.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
});

DeletePostDialog.displayName = "DeletePostDialog";

export default DeletePostDialog;
