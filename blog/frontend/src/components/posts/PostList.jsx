import { useState, useEffect, useMemo, useCallback, useTransition } from "react";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserPosts } from "../../hooks/useUserPosts";
import { filterPosts, calculateTotalPages } from "../../services/postService";
import PostCard from "../common/PostCard.jsx";
import PaginationControls from "../common/PaginationControls.jsx";
import PostFilter from "../common/PostFilter.jsx";

const PostList = ({ onEditPost, onDeletePost }) => {
  // Local UI state
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isPendingTransition, startTransition] = useTransition();

  // React Query hook - handles fetching, caching, and refetching automatically
  const { data, isLoading, isFetching } = useUserPosts(currentPage, 10);
  const posts = data?.posts || [];
  const pagination = data?.pagination || {};

  // Combined loading state (initial load + refetching)
  const isPaginationPending = isLoading || isFetching;

  // React 19 best practice: Use useMemo for derived state instead of useState + useEffect
  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) {
      return posts;
    }
    // Non-urgent filtering can be done in transition
    return filterPosts(posts, searchQuery);
  }, [posts, searchQuery]);

  // Calculate totalPages using service function - trivial derivation (no memo needed)
  const totalPages = calculateTotalPages(pagination.total, pagination.limit);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    // Urgent: keep input responsive
    setInputValue(query);
    // Non-urgent: update query used for filtering in a transition
    startTransition(() => {
      setSearchQuery(query);
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is handled by onChange for better UX
  };

  // Stabilized handler - prevents PostCard re-renders
  const handleDeleteClick = useCallback(
    (post) => {
      onDeletePost(post);
    },
    [onDeletePost]
  );

  // Stabilized handler - prevents PostItem re-renders
  const handleEditClick = useCallback(
    (post) => {
      onEditPost(post);
    },
    [onEditPost]
  );

  // Handle page changes - React Query handles fetching automatically
  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage);
  }, []);

  // Reset to first page when posts change (new data loaded)
  useEffect(() => {
    setCurrentPage(1);
  }, [posts]);

  // Simple derived flag - no memoization needed
  const showPagination = !searchQuery;

  return (
    <>
      <CardHeader>

        <PostFilter
          value={inputValue}
          onChange={handleSearchChange}
          onSubmit={handleSearch}
          isPending={isPendingTransition}
        />
      </CardHeader>

      <CardContent className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchQuery
              ? "No posts found matching your search."
              : "No posts yet. Create your first post!"}
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  variant="dashboard"
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>

            {showPagination && totalPages > 1 && (
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                isPending={isPaginationPending}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </CardContent>
    </>
  );
};

export default PostList;
