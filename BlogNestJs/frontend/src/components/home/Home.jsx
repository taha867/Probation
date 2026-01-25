import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useHomePosts } from "../../hooks/postHooks/postQueries";
import { calculateTotalPages } from "../../services/postService";
import PostCard from "../common/PostCard.jsx";
import PaginationControls from "../common/PaginationControls.jsx";
import AppInitializer from "../common/AppInitializer.jsx";

const Home = () => {
  // Pagination + URL search params
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const limit = 3; // Posts per page

  // React Query hook - handles fetching, caching, and refetching automatically
  // It will refetch automatically when searchQuery (from URL) changes
  const { data, isLoading, isFetching } = useHomePosts(
    currentPage,
    limit,
    searchQuery
  );
  const posts = data?.posts || [];
  const pagination = data?.pagination || {};

  const { total, limit: pageLimit } = pagination;

  const hasPosts = posts.length > 0;
  const totalPages = calculateTotalPages(total || 0, pageLimit || limit);
  const showPagination = hasPosts && totalPages > 1;

  // Handle page changes - React Query handles fetching automatically
  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage);
  }, []);

  // Reset to first page when search query changes (URL param)
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Combined loading state (initial load + refetching)
  const isPaginationPending = isLoading || isFetching;

  // Show loading state on initial load
  if (isLoading) {
    return <AppInitializer />;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 flex flex-col min-h-[calc(100vh-4rem)]">
        {/* Blog Posts */}
        <div className="space-y-6 flex-1">
          {!hasPosts ? (
            <div className="flex flex-col items-center justify-center py-20">
              <p className="text-gray-500 text-center text-lg">
                {searchQuery 
                  ? `No posts found matching "${searchQuery}".` 
                  : "No posts found. Check back later."}
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>

        {/* Pagination Controls - pinned to bottom area when present */}
        {showPagination && (
          <div className="mt-12 pt-8 border-t border-gray-100">
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              isPending={isPaginationPending}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
