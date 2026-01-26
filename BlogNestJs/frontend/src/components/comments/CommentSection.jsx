import { useCallback, useMemo, useTransition } from "react";
import { Link } from "react-router-dom";
import { usePostComments } from "../../hooks/commentHooks/commentQueries";
import { useAuth } from "../../hooks/authHooks/authHooks";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";
import { Button } from "@/components/ui/button";
import AppInitializer from "../common/AppInitializer";

const CommentSection = ({ postId }) => {
  const { isAuthenticated } = useAuth();
  const [isPending, startTransition] = useTransition();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = usePostComments(postId);

  // Flatten nested pages into a single array of comments
  const allComments = useMemo(
    () => data?.pages.flatMap((page) => page.comments || []) || [],
    [data]
  );

  // Get total comments count from the first page metadata
  const totalComments = data?.pages[0]?.meta?.total || 0;

  const commentsText = useMemo(
    () => `${totalComments} ${totalComments === 1 ? "comment" : "comments"}`,
    [totalComments]
  );

  // React 19: Use startTransition to keep the UI interactive while loading next page
  const handleLoadMore = useCallback(() => {
    startTransition(() => {
      fetchNextPage();
    });
  }, [fetchNextPage]);

  // Handle success - simple refetch to page 1
  const handleCommentSuccess = useCallback(() => {
    refetch();
  }, [refetch]);

  if (isLoading) {
    return (
      <div className="py-8">
        <AppInitializer />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <h3 className="text-xl font-bold text-gray-900">{commentsText}</h3>
        {!isAuthenticated && (
          <Link
            to="/signin"
            className="text-blue-600 hover:text-blue-700 font-semibold text-sm hover:underline"
          >
            Sign in to comment
          </Link>
        )}
      </div>

      {/* Form */}
      {isAuthenticated && (
        <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
          <CommentForm
            postId={postId}
            onSuccess={handleCommentSuccess}
            placeholder="Write a thoughtful comment..."
          />
        </div>
      )}

      {/* List */}
      {allComments.length === 0 ? (
        <div className="text-center py-12 text-gray-400 bg-gray-50/50 rounded-xl border border-dashed">
          <p className="text-lg font-medium">No comments yet.</p>
          <p className="text-sm">Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {allComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={postId}
              onReplySuccess={handleCommentSuccess}
            />
          ))}
        </div>
      )}

      {/* Actions */}
      {hasNextPage && (
        <div className="flex justify-center pt-8">
          <Button
            type="button"
            variant="outline"
            onClick={handleLoadMore}
            disabled={isFetchingNextPage || isPending}
            className="rounded-full px-8 font-semibold hover:bg-slate-900 hover:text-white transition-all shadow-sm"
          >
            {isFetchingNextPage || isPending ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Loading...
              </span>
            ) : (
              "Load More Comments"
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default CommentSection;
