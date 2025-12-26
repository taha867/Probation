import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { usePostComments } from "../../hooks/commentHooks/commentQueries";
import { useAuth } from "../../hooks/authHooks/authHooks";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";
import { Button } from "@/components/ui/button";
import AppInitializer from "../common/AppInitializer";

const COMMENTS_PER_PAGE = 10;

const CommentSection = ({ postId }) => {
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);

  const { data, isLoading, isFetching, refetch } = usePostComments(
    postId,
    currentPage,
    COMMENTS_PER_PAGE
  );
  const { comments = [], meta: { total: totalComments = 0 } = {} } = data || {};

  const hasMoreComments = totalComments > COMMENTS_PER_PAGE;

  const handleCommentSuccess = useCallback(() => {
    // Refetch comments after successful comment creation
    setRefreshKey((prev) => prev + 1);
    refetch();
  }, [refetch]);

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
          {totalComments} {totalComments === 1 ? "comment" : "comments"}
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
      {comments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
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
