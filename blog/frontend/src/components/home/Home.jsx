/**
 * Home - Main UI component for home page (React 19 optimized)
 * Uses use() hook with Suspense for data fetching
 * Optimized with memo, useMemo, useCallback for minimal re-renders
 * Includes pagination support
 */
import { use, useMemo, memo, useState, useTransition, useCallback } from "react";
import {
  createHomePostsPromise,
  invalidateHomePostsPromise,
} from "../../utils/postsPromise";
import { calculateTotalPages } from "../../services/postService";
import PostCard from "./PostCard";
import PaginationControls from "../posts/postList/PaginationControls";

const Home = () => {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [isPaginationPending, startPaginationTransition] = useTransition();
  const limit = 3; // Increased to show more posts per page (matching design reference)

  // use() hook suspends until promise resolves
  // Pass currentPage to fetch correct page data
  const { posts, pagination } = use(createHomePostsPromise(currentPage, limit));

  // Memoize empty state check to prevent recalculation
  const hasPosts = useMemo(() => posts.length > 0, [posts.length]);

  // Calculate total pages from pagination metadata 
  const totalPages = useMemo(
    () => calculateTotalPages(pagination.total || 0, pagination.limit || limit),
    [pagination.total, pagination.limit, limit]
  );

  // Handle page changes with React 19 useTransition
  const handlePageChange = useCallback(
    (newPage) => {
      // Invalidate promise to force new fetch
      invalidateHomePostsPromise();

      // Non-urgent: Update page in background for smooth UX
      startPaginationTransition(() => {
        setCurrentPage(newPage);
      });
    },
    [startPaginationTransition]
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        {/* Blog Posts */}
        <div className="space-y-6">
          {!hasPosts ? (
            <div className="text-center py-12 text-gray-500">
              No posts found. Check back later.
            </div>
          ) : (
            <>
              {/* Posts List */}
              <div className="space-y-6">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>

              {/* Pagination Controls - Always at bottom */}
              {totalPages > 1 && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    isPending={isPaginationPending}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Memoize Home component to prevent unnecessary re-renders
export default memo(Home);

