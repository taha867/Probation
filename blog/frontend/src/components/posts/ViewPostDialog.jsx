/**
 * ViewPostDialog - Local dialog component for viewing a post in detail.
 * Uses a shared imperative dialog hook with minimal local state.
 */
import { memo, useState, forwardRef, useImperativeHandle } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { POST_STATUS } from "../../utils/constants";
import { getPostDetails } from "../../services/postService";
import { useImperativeDialog } from "../../hooks/useImperativeDialog";

const ViewPostDialog = forwardRef(({ onEditPost, onDeletePost }, ref) => {
  // Local dialog state via shared hook
  const {
    isOpen,
    payload: currentPost,
    openDialog: openDialogState,
    closeDialog: closeDialogState,
  } = useImperativeDialog(null);

  const [fullPost, setFullPost] = useState(null);

  // Expose methods to parent via ref
  useImperativeHandle(
    ref,
    () => ({
      openDialog: (post) => {
        // Show dialog with basic info immediately
        openDialogState(post);
        setFullPost(null);

        // Fetch full post details in the background
        (async () => {
          try {
            const fullPostData = await getPostDetails(post.id);
            setFullPost(fullPostData);
          } catch (error) {
            console.error("Failed to fetch full post details:", error);
          }
        })();
      },
      closeDialog: () => {
        closeDialogState();
        setFullPost(null);
      },
    }),
    [openDialogState, closeDialogState]
  );

  const getStatusColor = (status) =>
    status === POST_STATUS.PUBLISHED
      ? "bg-green-100 text-green-800"
      : "bg-yellow-100 text-yellow-800";

  // Prefer fullPost when available, otherwise fall back to basic currentPost
  const displayPost = fullPost || currentPost;

  const handleEdit = () => {
    if (displayPost && onEditPost) {
      onEditPost(displayPost);
    }
  };

  const handleDelete = () => {
    if (displayPost && onDeletePost) {
      onDeletePost(displayPost.id, displayPost.title);
    }
  };

  const handleClose = (open) => {
    if (!open) {
      closeDialogState();
      setFullPost(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>View Post</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>

              <Button variant="outline" size="sm" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </DialogTitle>
          <DialogDescription>
            View the complete post details, edit content, or delete the post.
          </DialogDescription>
        </DialogHeader>

        {displayPost ? (
          <div className="space-y-6">
            {/*
              Destructure only when displayPost is guaranteed to be non-null.
              Use optional chaining for nested author to avoid runtime errors.
            */}
            {(() => {
              const {
                title,
                status,
                createdAt,
                updatedAt,
                author,
                body,
              } = displayPost;
              const {name:authorName, email:authorEmail}={} = author;

              return (
                <>
                  {/* Post Header */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl font-bold">{title}</h1>
                      <Badge className={getStatusColor(status)}>{status}</Badge>
                    </div>

                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>
                        Created{" "}
                        {formatDistanceToNow(new Date(createdAt), {
                          addSuffix: true,
                        })}
                      </div>
                      {updatedAt !== createdAt && (
                        <div>
                          Updated{" "}
                          {formatDistanceToNow(new Date(updatedAt), {
                            addSuffix: true,
                          })}
                        </div>
                      )}
                      {author && (
                        <div>
                          By {authorName} ({authorEmail})
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="border-t pt-6">
                    <div className="prose max-w-none">
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">
                        {body}
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}

            {/* Post Stats */}
            {fullPost ? (
              <div className="border-t pt-4">
                <div className="text-sm text-muted-foreground">
                  <div>Post ID: {fullPost.id}</div>
                  {Array.isArray(fullPost.comments) && (
                    <div>Comments: {fullPost.comments.length}</div>
                  )}
                </div>
              </div>
            ) : (
              <div className="border-t pt-4">
                <div className="text-sm text-muted-foreground">
                  Loading full post details...
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Post not found.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
});

export default memo(ViewPostDialog);
