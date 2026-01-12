
import { forwardRef } from "react";
import DeleteDialog from "../common/DeleteDialog";
import { useDeleteComment } from "../../hooks/commentHooks/commentMutations";

const DeleteCommentDialog = forwardRef((props, ref) => {
  return (
    <DeleteDialog
      ref={ref}
      config={{
        title: "Delete Comment",
        descriptionFormatter: (payload) => {
          const hasReplies = payload?.replies && payload.replies.length > 0;

          return (
            <>
              Are you sure you want to delete this comment? This action cannot be
              undone.
              {hasReplies && (
                <span className="block mt-1 text-xs text-gray-500">
                  This comment has {payload.replies.length}{" "}
                  {payload.replies.length === 1 ? "reply" : "replies"} that will
                  also be deleted.
                </span>
              )}
            </>
          );
        },
        mutationHook: useDeleteComment,
        mutationCall: (payload) => {
          // Backend handles cascading delete for child comments
          return payload.id;
        },
        payloadFormatter: (comment) => ({
          id: comment.id,
          replies: comment.replies || [],
        }),
      }}
    />
  );
});

export default DeleteCommentDialog;

