/**
 * PostsListContent - Presentational component for posts list + pagination
 * Single responsibility: render list of posts and delegate pagination controls.
 * Memoized to prevent re-renders when props haven't changed.
 */
import { memo } from "react";
import PostItem from "./PostItem";
import PaginationControls from "./PaginationControls";

const PostsListContent = ({
  posts,
  currentPage,
  totalPages,
  isPaginationPending,
  showPagination,
  onEdit,
  onView,
  onDelete,
  onPageChange,
}) => {
  return (
    <>
      <div className="space-y-4">
        {posts.map((post) => (
          <PostItem
            key={post.id}
            post={post}
            onEdit={onEdit}
            onView={onView}
            onDelete={onDelete}
          />
        ))}
      </div>

      {showPagination && totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          isPending={isPaginationPending}
          onPageChange={onPageChange}
        />
      )}
    </>
  );
};

// Memoize PostsListContent to prevent re-renders when props haven't changed
export default memo(PostsListContent);


