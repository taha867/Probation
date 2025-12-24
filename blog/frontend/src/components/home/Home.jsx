import { useState, useCallback, useMemo, useTransition } from "react";
import { useHomePosts } from "../../hooks/useHomePosts";
import { calculateTotalPages } from "../../services/postService";
import PostCard from "../common/PostCard.jsx";
import PaginationControls from "../common/PaginationControls.jsx";
import AppInitializer from "../common/AppInitializer.jsx";
import PostFilter from "../common/PostFilter.jsx";

const Home = () => {
  // Pagination + filter state
  const [currentPage, setCurrentPage] = useState(1);
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isPendingTransition, startTransition] = useTransition();
  const limit = 3; // Posts per page

  // React Query hook - handles fetching, caching, and refetching automatically
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

  const handleSearchChange = useCallback(
    (e) => {
      const query = e.target.value;
      setInputValue(query);
      startTransition(() => {
        setSearchQuery(query);
      });
      // whenever search changes, reset to first page
      setCurrentPage(1);
    },
    [startTransition]
  );

  const handleSearch = useCallback((e) => {
    e.preventDefault();
  }, []);

  // Combined loading state (initial load + refetching)
  const isPaginationPending = isLoading || isFetching;
  const isFilterPending = isPendingTransition || isFetching;

  // Show loading state on initial load
  if (isLoading) {
    return <AppInitializer />;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 flex flex-col min-h-[calc(100vh-4rem)]">
        {/* Filter + Blog Posts */}
        <div className="space-y-6 flex-1">
          <div className="w-full">
            <PostFilter
              value={inputValue}
              onChange={handleSearchChange}
              onSubmit={handleSearch}
              isPending={isFilterPending}
              placeholder="Search blog posts..."
            />
          </div>

          {!hasPosts ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 text-center">
                No posts found. Check back later.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>

        {/* Pagination Controls - pinned to bottom area when present */}
        {showPagination && (
          <div className="mt-8 pt-6 border-t border-gray-200">
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
