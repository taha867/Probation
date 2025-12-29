import { forwardRef } from "react";
import DeleteDialog from "../common/DeleteDialog";
import { useDeletePost } from "../../hooks/postHooks/postMutations";
import { POST_STATUS } from "../../utils/constants";

const DeletePostDialog = forwardRef((props, ref) => {
  return (
    <DeleteDialog
      ref={ref}
      config={{
        title: "Delete Post",
        descriptionFormatter: (payload) =>
          `Are you sure you want to delete "${
            payload?.title || "this post"
          }"? This action cannot be undone.`,
        mutationHook: useDeletePost,
        mutationCall: (payload) => {
          // Check if the post being deleted is published (to invalidate home posts)
          const isPublished = payload?.status === POST_STATUS.PUBLISHED;
          return {
            postId: payload.id,
            wasPublished: isPublished || false,
          };
        },
        payloadFormatter: (post) => ({
          id: post.id,
          title: post.title,
          status: post.status,
        }),
      }}
    />
  );
});



export default DeletePostDialog;
