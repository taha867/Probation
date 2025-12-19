/**
 * PostList - Container component for displaying posts (React 19 best practices)
 * - Keeps data + UI logic
 * - Delegates pure UI to small presentational components
 */
import { useState, useTransition, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";
import { usePostsContext } from "../../contexts/postsContext";
import { useAuthContext } from "../../contexts/authContext";
import {
  changePage,
  filterPosts,
  calculateTotalPages,
} from "../../services/postService";
import EmptyPostsState from "./postList/EmptyPostsState";
import PostsListContent from "./postList/PostsListContent";

const PostList = ({ onEditPost, onViewPost, onDeletePost }) => {
  // Context and auth
  const { state, dispatch } = usePostsContext();
  const { state: authState } = useAuthContext();
  const user = authState.user;
  const { posts, pagination } = state;

  // Local UI state
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isPaginationPending, startPaginationTransition] = useTransition();

  // React 19 best practice: Use useMemo for derived state instead of useState + useEffect
  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) {
      return posts;
    }
    // Non-urgent filtering can be done in transition
    return filterPosts(posts, searchQuery);
  }, [posts, searchQuery]);

  // Calculate totalPages using service function - memoized to prevent recalculation
  const totalPages = useMemo(
    () => calculateTotalPages(pagination.total, pagination.limit),
    [pagination.total, pagination.limit]
  );

  // Handle search input changes - no useCallback needed (not passed to memoized child)
  const handleSearchChange = (e) => {
    const query = e.target.value;
    // Urgent: Update search input immediately
    setSearchQuery(query);
    // Filtering happens automatically via useMemo
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is handled by onChange for better UX
  };

  // Stabilized handler - prevents PostItem re-renders
  const handleDeleteClick = useCallback(
    (postId, postTitle) => {
      onDeletePost(postId, postTitle);
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

  // Stabilized handler - prevents PostItem re-renders
  const handleViewClick = useCallback(
    (post) => {
      onViewPost(post);
    },
    [onViewPost]
  );

  // Handle page changes using service workflow
  const handlePageChange = useCallback(
    (newPage) => {
      setCurrentPage(newPage);
      changePage(
        user?.id,
        newPage,
        pagination,
        dispatch,
        startPaginationTransition,
      );
    },
    [user?.id, pagination, dispatch, startPaginationTransition]
  );

  // Reset to first page when posts change (new data loaded)
  useEffect(() => {
    setCurrentPage(1);
  }, [posts]);

  // Memoize showPagination to prevent recalculation
  const showPagination = useMemo(() => !searchQuery, [searchQuery]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Your Posts ({searchQuery ? filteredPosts.length : pagination.total})
          {searchQuery && (
            <span className="text-sm font-normal text-muted-foreground ml-2">
              (filtered from {pagination.total})
            </span>
          )}
        </CardTitle>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            placeholder="Search posts..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="flex-1"
          />
          <Button type="submit" variant="outline" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </form>
      </CardHeader>

      <CardContent className="space-y-4">
        {filteredPosts.length === 0 ? (
          <EmptyPostsState searchQuery={searchQuery} />
        ) : (
          <PostsListContent
            posts={filteredPosts}
            currentPage={currentPage}
            totalPages={totalPages}
            isPaginationPending={isPaginationPending}
            showPagination={showPagination}
            onEdit={handleEditClick}
            onView={handleViewClick}
            onDelete={handleDeleteClick}
            onPageChange={handlePageChange}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default PostList;
