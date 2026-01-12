import { useState, useEffect, useCallback, useTransition } from "react";
import { CardContent, CardHeader} from "@/components/ui/card";
import { useUserPosts } from "../../hooks/postHooks/postQueries";
import { calculateTotalPages } from "../../services/postService";
import { POSTS_PER_PAGE } from "../../utils/constants";
import PostCard from "../common/PostCard.jsx";
import PaginationControls from "../common/PaginationControls.jsx";
import PostFilter from "../common/PostFilter.jsx";

const PostList = ({ onEditPost, onDeletePost }) => {
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isPendingTransition, startTransition] = useTransition();

  // Backend-driven pagination + search
  const { data, isLoading, isFetching } = useUserPosts(
    currentPage,
    POSTS_PER_PAGE,
    searchQuery
  );

  const posts = data?.posts || [];
  const pagination = data?.pagination || {};

  const isPaginationPending = isLoading || isFetching;

  const totalPages = calculateTotalPages(
    pagination.total || 0,
    pagination.limit || POSTS_PER_PAGE
  );

  const handleSearchChange = useCallback(
    (e) => {
      const query = e.target.value;
      // Urgent: keep input responsive
      setInputValue(query);
      // Non-urgent: update query used for backend search
      startTransition(() => {
        setSearchQuery(query);
      });
    },
    [startTransition]
  );

  const handleSearch = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleDeleteClick = useCallback(
    (post) => {
      onDeletePost(post);
    },
    [onDeletePost]
  );

  const handleEditClick = useCallback(
    (post) => {
      onEditPost(post);
    },
    [onEditPost]
  );

  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage);
  }, []);

  // Reset to first page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const hasPosts = posts.length > 0;
  const showPagination = hasPosts && totalPages > 1;

  return (
    <div className="flex flex-col min-h-[calc(100vh-18rem)]">
      <CardHeader>
        <PostFilter
          value={inputValue}
          onChange={handleSearchChange}
          onSubmit={handleSearch}
          isPending={isPendingTransition}
        />
      </CardHeader>

      <CardContent className="flex flex-col flex-1 space-y-4">
        {!hasPosts ? (
          <div className="text-center py-8 text-muted-foreground flex-1 flex items-center justify-center">
            {searchQuery
              ? "No posts found matching your search."
              : "No posts yet. Create your first post!"}
          </div>
        ) : (
          <>
            <div className="space-y-4 flex-1">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  variant="dashboard"
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>

            {showPagination && (
              <div className="mt-auto pt-6 border-t border-gray-200">
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
      </CardContent>
    </div>
  );
};

export default PostList;
