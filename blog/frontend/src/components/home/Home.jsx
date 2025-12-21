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
  const limit = 5; // Default limit

  // use() hook suspends until promise resolves
  // Pass currentPage to fetch correct page data
  const { posts, pagination } = use(createHomePostsPromise(currentPage, limit));

  // Memoize empty state check to prevent recalculation
  const hasPosts = useMemo(() => posts.length > 0, [posts.length]);

  // Calculate total pages from pagination metadata 
  const totalPages = useMemo(
    () => 
    {
      calculateTotalPages(pagination.total || 0, pagination.limit || limit)
    },
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Recent Posts</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover stories, thinking, and expertise from writers on any topic.
          </p>
        </div>

        {/* Blog Posts */}
        <div className="space-y-8">
          {!hasPosts ? (
            <div className="text-center py-12 text-gray-500">
              No posts found. Check back later.
            </div>
          ) : (
            <>
              <div className="space-y-8">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  isPending={isPaginationPending}
                  onPageChange={handlePageChange}
                />
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

