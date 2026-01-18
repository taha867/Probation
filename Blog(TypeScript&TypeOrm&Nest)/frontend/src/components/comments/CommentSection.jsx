import { useState, useCallback, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { usePostComments } from "../../hooks/commentHooks/commentQueries";
import { useAuth } from "../../hooks/authHooks/authHooks";
import { COMMENTS_PER_PAGE } from "../../utils/constants";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";
import { Button } from "@/components/ui/button";
import AppInitializer from "../common/AppInitializer";

const CommentSection = ({ postId }) => {
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  // stores all loaded comments so far : pag1 + page2 + .....
  const [accumulatedComments, setAccumulatedComments] = useState([]);
  // total no of comments from backend used to decide when to stop "Load More"
  const [totalComments, setTotalComments] = useState(0);
  
  const { data, isLoading, isFetching } = usePostComments(
    postId,
    currentPage,
    COMMENTS_PER_PAGE
  );
  const { comments: pageComments = [], meta: { total = 0 } = {} } = data || {};

  // Reset when postId changes - must happen first to clear previous post's comments
  useEffect(() => {
    setCurrentPage(1);
    setAccumulatedComments([]);
    setTotalComments(0);
  }, [postId]);

  // Update accumulated comments when new page data arrives
  // This effect runs after the reset effect to populate comments for the new postId
  useEffect(() => {
    // Skip if postId is not set or data is not available
    if (!postId || !data) return;

    // Extract values from data inside the effect to avoid stale closure issues
    
    const comments = data.comments || [];
    const totalCount = data.meta?.total || 0;

    // Only update if we have comments or it's the first page (to handle empty states)
    if (comments.length > 0 || currentPage === 1) {
      if (currentPage === 1) {
        // First page: replace all comments (this ensures fresh data when navigating back)
        setAccumulatedComments(comments);
      } else {
        // Subsequent pages: append new comments (prevent duplicates)
        setAccumulatedComments((prev) => {
          const existingIds = new Set(prev.map((c) => c.id));
          const newComments = comments.filter((c) => !existingIds.has(c.id));
          return newComments.length > 0 ? [...prev, ...newComments] : prev;
        });
      }
      setTotalComments(totalCount);
    }
  }, [data, currentPage, postId]); // Depend on data object reference - React Query provides stable references

  // Memoize derived value to prevent recalculation
  const hasMoreComments = useMemo(
    () => accumulatedComments.length < totalComments,
    [accumulatedComments.length, totalComments]
  );

  // Memoize comments text to prevent recalculation on every render
  const commentsText = useMemo(
    () => `${totalComments} ${totalComments === 1 ? "comment" : "comments"}`,
    [totalComments]
  );

  // Stable callback - reset to page 1 after comment creation
  // React Query automatically refetches after mutation invalidates queries
  const handleCommentSuccess = useCallback(() => {
    // Reset to page 1 to get fresh comment list
    setAccumulatedComments([]);
    setCurrentPage(1);
    // No manual refetch needed - React Query handles it automatically after invalidation
  }, []);

  const handleLoadMore = useCallback(() => {
    setCurrentPage((prev) => prev + 1);
  }, []);

  if (isLoading) {
    return (
      <div className="py-8">
        <AppInitializer />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Comments Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          {commentsText}
        </h3>
        {!isAuthenticated && (
          <Link
            to="/signin"
            className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
          >
            Sign in to comment
          </Link>
        )}
      </div>

      {/* Add Comment Form (only for authenticated users) */}
      {isAuthenticated && (
        <div className="bg-gray-50 rounded-lg p-4">
          <CommentForm
            postId={postId}
            onSuccess={handleCommentSuccess}
            placeholder="Add comment..."
          />
        </div>
      )}

      {/* Comments List */}
      {accumulatedComments.length === 0 && !isLoading ? (
        <div className="text-center py-8 text-gray-500">
          <p>No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {accumulatedComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={postId}
              onReplySuccess={handleCommentSuccess}
            />
          ))}
        </div>
      )}

      {/* Load More Comments Button */}
      {hasMoreComments && (
        <div className="flex justify-center pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleLoadMore}
            disabled={isFetching}
          >
            {isFetching ? "Loading..." : "Load More Comments"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default CommentSection;
