/**
 * ViewPostDialog - Optimized component for viewing post details
 * Using centralized state management and memoization
 */
import { memo, useCallback } from "react";
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

const ViewPostDialog = ({
  post,
  fullPost,
  loading,
  isOpen,
  onClose,
  onEditPost,
  onDeletePost,
}) => {
  const getStatusColor = useCallback((status) => {
    return status === POST_STATUS.PUBLISHED
      ? "bg-green-100 text-green-800"
      : "bg-yellow-100 text-yellow-800";
  }, []);

  const displayPost = fullPost || post;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>View Post</span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEditPost(displayPost)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onDeletePost(displayPost.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </DialogTitle>
          <DialogDescription>
            View the complete post details, edit content, or delete the post.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">Loading post details...</div>
          </div>
        ) : displayPost ? (
          <div className="space-y-6">
            {/* Post Header */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{displayPost.title}</h1>
                <Badge className={getStatusColor(displayPost.status)}>
                  {displayPost.status}
                </Badge>
              </div>

              <div className="text-sm text-muted-foreground space-y-1">
                <div>
                  Created{" "}
                  {formatDistanceToNow(new Date(displayPost.createdAt), {
                    addSuffix: true,
                  })}
                </div>
                {displayPost.updatedAt !== displayPost.createdAt && (
                  <div>
                    Updated{" "}
                    {formatDistanceToNow(new Date(displayPost.updatedAt), {
                      addSuffix: true,
                    })}
                  </div>
                )}
                {displayPost.author && (
                  <div>
                    By {displayPost.author.name} ({displayPost.author.email})
                  </div>
                )}
              </div>
            </div>

            {/* Post Content */}
            <div className="border-t pt-6">
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {displayPost.body}
                </div>
              </div>
            </div>

            {/* Post Stats */}
            {fullPost && (
              <div className="border-t pt-4">
                <div className="text-sm text-muted-foreground">
                  <div>Post ID: {fullPost.id}</div>
                  {fullPost.comments && (
                    <div>Comments: {fullPost.comments.length}</div>
                  )}
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
};

export default memo(ViewPostDialog);
