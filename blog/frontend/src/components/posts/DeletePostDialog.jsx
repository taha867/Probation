/**
 * DeletePostDialog - Local dialog component for delete confirmation
 * Uses a small imperative dialog hook to keep state minimal and focused.
 */
import { memo, useState, useTransition, forwardRef, useImperativeHandle } from "react";
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
import { usePostsContext } from "../../contexts/postsContext";
import { deletePost } from "../../services/postService";
import { useImperativeDialog } from "../../hooks/useImperativeDialog";
import { invalidateHomePostsPromise } from "../../utils/postsPromise";
import { POST_STATUS } from "../../utils/constants";

const DeletePostDialog = forwardRef((props, ref) => {
  // Local dialog state via shared hook
  const {
    isOpen,
    payload: postToDelete,
    openDialog: openDialogState,
    closeDialog: closeDialogState,
  } = useImperativeDialog(null);

  const [isDeleting, setIsDeleting] = useState(false);
  const [, startTransition] = useTransition();

  const { dispatch, state } = usePostsContext();

  // Expose methods to parent via ref
  useImperativeHandle(
    ref,
    () => ({
      openDialog: (postId, postTitle) => {
        openDialogState({ id: postId, title: postTitle });
      },
      closeDialog: () => {
        if (!isDeleting) {
          closeDialogState();
        }
      },
    }),
    [openDialogState, closeDialogState, isDeleting],
  );

  const handleConfirmDelete = async () => {
    if (!postToDelete?.id) return;

    setIsDeleting(true);

    try {
      // Check if the post being deleted is published (to invalidate home posts)
      const post = state.posts.find((p) => p.id === postToDelete.id);
      const isPublished = post?.status === POST_STATUS.PUBLISHED;

      await deletePost(postToDelete.id, dispatch, startTransition);

      // If deleted post was published, invalidate home posts promise
      if (isPublished) {
        invalidateHomePostsPromise();
      }

      // Close dialog after successful deletion
      closeDialogState();
    } catch (error) {
      // Error handling is done in the service
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    if (!isDeleting) {
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
          <AlertDialogCancel disabled={isDeleting}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirmDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
});

DeletePostDialog.displayName = "DeletePostDialog";

export default memo(DeletePostDialog);
