/**
 * CommentItem - Component for displaying a single comment with nested replies
 * Follows React 19 best practices with proper memoization
 */
import { memo, useState, useCallback } from "react";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import CommentForm from "./CommentForm";
import { useAuth } from "../../hooks/authHooks/authHooks";
import { formatPostDate, getAuthorInfo } from "../../utils/postUtils";
import AuthorAvatar from "../common/AuthorAvatar";

const CommentItem = memo(({ comment, postId, onReplySuccess }) => {
  const { isAuthenticated } = useAuth();
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);

  // Destructure with safe defaults - use undefined (not {}) so utility functions handle them correctly
  const {
    author,
    createdAt,
    body,
    id,
    replies: commentReplies = [],
  } = comment || {};

  const { name: authorName } = getAuthorInfo(author);
  const hasReplies = commentReplies.length > 0;

  const formattedDate = formatPostDate(createdAt);

  // Produces: “5 minutes ago”, “2 days ago”
  const timeAgo = createdAt
    ? formatDistanceToNow(new Date(createdAt), { addSuffix: true })
    : "";

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
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-gray-900">{authorName}</span>
            <span className="text-xs text-gray-500">{timeAgo}</span>
          </div>
          <p className="text-gray-700 text-sm whitespace-pre-wrap break-words">
            {body}
          </p>

          {/* Reply Button */}
          {isAuthenticated && (
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
    </div>
  );
});

export default CommentItem;
