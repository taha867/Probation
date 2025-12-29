/**
 * CommentItem - Component for displaying a single comment with nested replies
 * Supports edit and delete functionality for comment authors
 */
import { memo, useState, useCallback, useRef, useEffect, useMemo } from "react";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import CommentForm from "./CommentForm";
import CommentActionsMenu from "./CommentActionsMenu";
import DeleteCommentDialog from "./DeleteCommentDialog";
import { useAuth } from "../../hooks/authHooks/authHooks";
import { formatPostDate, getAuthorInfo } from "../../utils/postUtils";
import AuthorAvatar from "../common/AuthorAvatar";
import { useUpdateComment } from "../../hooks/commentHooks/commentMutations";
import { createCommentComparison } from "../../utils/memoComparisons";

const CommentItem = memo(({ comment, postId, onReplySuccess }) => {
  const { isAuthenticated, user } = useAuth();
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const deleteDialogRef = useRef(null);
  // Use ref to store comment for handleDelete to avoid dependency on comment object
  const commentRef = useRef(comment);

  // Keep ref in sync with comment prop
  useEffect(() => {
    commentRef.current = comment;
  }, [comment]);

  // Destructure with safe defaults - use undefined (not {}) so utility functions handle them correctly
  const {
    author,
    createdAt,
    body,
    id,
    replies: commentReplies = [],
  } = comment || {};

  // Simple derived values - no need for memoization (overhead > benefit)
  const { name: authorName } = getAuthorInfo(author);
  const hasReplies = commentReplies.length > 0;
  const isCommentAuthor = user?.id === author?.id;
  const formattedDate = formatPostDate(createdAt);

  // Memoize timeAgo since it creates a new Date object - this is worth memoizing
  const timeAgo = useMemo(() => {
    if (!createdAt) return "";
    return formatDistanceToNow(new Date(createdAt), { addSuffix: true });
  }, [createdAt]);

  // React Query mutation for updating comment
  const updateCommentMutation = useUpdateComment();

  // useCallback avoids re-creating function on each render
  const toggleReplies = useCallback(() => {
    setShowReplies((prev) => !prev);
  }, []);

  const toggleReplyForm = useCallback(() => {
    setShowReplyForm((prev) => !prev);
  }, []);

  const handleReplySuccess = useCallback(() => {
    setShowReplyForm(false);
    setShowReplies(true); // Show replies after successful reply
    if (onReplySuccess) {
      onReplySuccess();
    }
  }, [onReplySuccess]);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
  }, []);

  const handleUpdate = useCallback(
    async (updatedBody) => {
      if (!id) return;

      try {
        await updateCommentMutation.mutateAsync({
          commentId: id,
          body: updatedBody,
        });
        setIsEditing(false);
        // Call onReplySuccess to refresh comments if provided
        if (onReplySuccess) {
          onReplySuccess();
        }
      } catch (error) {
        // Error handling is done by React Query and axios interceptor
        // Re-throw to prevent form from closing on error
        throw error;
      }
    },
    [id, updateCommentMutation, onReplySuccess]
  );

  // Use ref to access comment without making handleDelete depend on comment object
  // This prevents CommentActionsMenu from re-rendering when comment object reference changes
  const handleDelete = useCallback(() => {
    if (deleteDialogRef.current && commentRef.current) {
      deleteDialogRef.current.openDialog(commentRef.current);
    }
  }, []); // Empty deps - commentRef is stable, deleteDialogRef is stable

  const isPending = updateCommentMutation.isPending;

  return (
    <div className="border-b border-gray-100 pb-4 last:border-b-0">
      {/* Main Comment */}
      <div className="flex gap-3">
        {/* Author Avatar */}
        <div className="flex-shrink-0">
          <AuthorAvatar author={author} size="md" />
        </div>

        {/* Comment Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">{authorName}</span>
              <span className="text-xs text-gray-500">{timeAgo}</span>
            </div>
            {/* Comment Actions Menu - Only show for comment author */}
            {isAuthenticated && isCommentAuthor && !isEditing && (
              <CommentActionsMenu
                onEdit={handleEdit}
                onDelete={handleDelete}
                disabled={isPending}
              />
            )}
          </div>

          {/* Edit Mode or View Mode */}
          {isEditing ? (
            <div className="mt-2">
              <CommentForm
                initialValue={body}
                onUpdate={handleUpdate}
                onCancel={handleCancelEdit}
                placeholder="Edit your comment..."
              />
            </div>
          ) : (
            <p className="text-gray-700 text-sm whitespace-pre-wrap break-words">
              {body}
            </p>
          )}

          {/* Reply Button - Only show when not editing */}
          {isAuthenticated && !isEditing && (
            <div className="mt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={toggleReplyForm}
                className="h-7 text-xs"
              >
                <MessageSquare className="h-3 w-3 mr-1" />
                Reply
              </Button>
            </div>
          )}

          {/* Reply Form */}
          {showReplyForm && isAuthenticated && (
            <div className="mt-3 pl-4 border-l-2 border-gray-200">
              <CommentForm
                postId={postId}
                parentId={id}
                onSuccess={handleReplySuccess}
                placeholder="Write a reply..."
              />
            </div>
          )}

          {/* Replies Section */}
          {hasReplies && (
            <div className="mt-4">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={toggleReplies}
                className="h-7 text-xs text-gray-600 hover:text-gray-900"
              >
                {showReplies ? (
                  <>
                    <ChevronUp className="h-3 w-3 mr-1" />
                    Hide replies ({commentReplies.length})
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3 w-3 mr-1" />
                    Show replies ({commentReplies.length})
                  </>
                )}
              </Button>

              {showReplies && (
                <div className="mt-3 pl-4 border-l-2 border-gray-200 space-y-4">
                  {commentReplies.map((reply) => (
                    <CommentItem
                      key={reply.id}
                      comment={reply}
                      postId={postId}
                      onReplySuccess={onReplySuccess}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete Comment Dialog */}
      <DeleteCommentDialog ref={deleteDialogRef} />
    </div>
  );
}, createCommentComparison());

export default CommentItem;
