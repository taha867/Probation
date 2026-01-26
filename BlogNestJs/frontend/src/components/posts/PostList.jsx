import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { CardContent } from "@/components/ui/card";
import { useUserPosts } from "../../hooks/postHooks/postQueries";
import { calculateTotalPages } from "../../services/postService";
import { POSTS_PER_PAGE } from "../../utils/constants";
import PostCard from "../common/PostCard.jsx";
import PaginationControls from "../common/PaginationControls.jsx";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { POST_STATUS } from "../../utils/constants";

const PostList = ({ onEditPost, onDeletePost }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState(POST_STATUS.PUBLISHED);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  // Backend-driven pagination + search
  const { data, isLoading, isFetching } = useUserPosts(
    currentPage,
    POSTS_PER_PAGE,
    searchQuery,
    status
  );

  const posts = data?.posts || [];
  const pagination = data?.pagination || {};

  const isPaginationPending = isLoading || isFetching;

  const totalPages = calculateTotalPages(
    pagination.total || 0,
    pagination.limit || POSTS_PER_PAGE
  );

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

  const handleTabChange = (value) => {
    setStatus(value);
    setCurrentPage(1);
  };

  const hasPosts = posts.length > 0;
  const showPagination = hasPosts && totalPages > 1;

  return (
    <div className="flex flex-col min-h-[calc(100vh-18rem)]">
      <Tabs value={status} onValueChange={handleTabChange} className="w-full">
        <div className="flex items-center justify-between mb-8">
          <TabsList className="w-full max-w-md mx-auto grid grid-cols-2 bg-zinc-100 p-1 rounded-xl h-auto">
            <TabsTrigger 
              value={POST_STATUS.PUBLISHED}
              className="rounded-lg py-2.5 text-sm font-semibold transition-all data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-lg"
            >
              Published
            </TabsTrigger>
            <TabsTrigger 
              value={POST_STATUS.DRAFT}
              className="rounded-lg py-2.5 text-sm font-semibold transition-all data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-lg"
            >
              Drafts
            </TabsTrigger>
          </TabsList>
        </div>

        <CardContent className="flex flex-col flex-1 space-y-4 px-0">
        {!hasPosts ? (
          <div className="text-center py-20 text-muted-foreground flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-xl">
            <p className="text-lg">
              {searchQuery
                ? `No posts found matching "${searchQuery}".`
                : "No posts yet. Create your first post!"}
            </p>
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
              <div className="mt-8 pt-8 border-t border-gray-100">
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
      </Tabs>
    </div>
  );
};

export default PostList;
