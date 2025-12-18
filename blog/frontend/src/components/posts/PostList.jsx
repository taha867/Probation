/**
 * PostList - Optimized component for displaying posts
 * Using local search state with useTransition for smooth filtering
 */
import { memo, useState, useTransition, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2, Edit, Eye, Search } from "lucide-react";
import { usePostsContext } from "../../contexts/postsContext";
import { useAuthContext } from "../../contexts/authContext";
import {
  deletePost,
  changePage,
  filterPosts,
  calculateTotalPages,
} from "../../services/postService";
import { formatDistanceToNow } from "date-fns";
import { POST_STATUS } from "../../utils/constants";

// Memoized Post Item Component for better performance
const PostItem = memo(({ post, onEdit, onView, onDelete }) => {
  const getStatusColor = (status) =>
    status === POST_STATUS.PUBLISHED
      ? "bg-green-100 text-green-800"
      : "bg-yellow-100 text-yellow-800";

  return (
    <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold truncate">{post.title}</h3>
            <Badge className={getStatusColor(post.status)}>{post.status}</Badge>
          </div>

          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
            {post.body}
          </p>

          <div className="text-xs text-muted-foreground">
            Created{" "}
            {formatDistanceToNow(new Date(post.createdAt), {
              addSuffix: true,
            })}
            {post.updatedAt !== post.createdAt && (
              <span>
                {" "}
                • Updated{" "}
                {formatDistanceToNow(new Date(post.updatedAt), {
                  addSuffix: true,
                })}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 ml-4">
          <Button variant="outline" size="sm" onClick={() => onView(post)}>
            <Eye className="h-4 w-4" />
          </Button>

          <Button variant="outline" size="sm" onClick={() => onEdit(post)}>
            <Edit className="h-4 w-4" />
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Post</AlertDialogTitle>

                <AlertDialogDescription>
                  Are you sure you want to delete "{post.title}"? This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>

                <AlertDialogAction
                  onClick={() => onDelete(post.id, post.title)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
});

PostItem.displayName = "PostItem";

const PostList = ({ onEditPost, onViewPost }) => {
  // Context and auth
  const { state, dispatch } = usePostsContext();
  const { state: authState } = useAuthContext();
  const user = authState.user;
  const { posts, pagination } = state;

  // Local UI state with useTransition
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPosts, setFilteredPosts] = useState(posts);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearchPending, startSearchTransition] = useTransition();
  const [isPaginationPending, startPaginationTransition] = useTransition();
  const [isListUpdatePending, startListUpdateTransition] = useTransition();

  // Calculate totalPages using service function
  const totalPages = calculateTotalPages(pagination.total, pagination.limit);

  // Handle search input changes with useTransition
  const handleSearchChange = (e) => {
    const query = e.target.value;
    // Urgent: Update search input immediately
    setSearchQuery(query);

    // Non-urgent: Filter posts in background using service
    startSearchTransition(() => {
      if (query.trim()) {
        const filtered = filterPosts(posts, query);
        setFilteredPosts(filtered);
      } else {
        setFilteredPosts(posts);
      }
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is handled by onChange for better UX
  };

  const handleDeletePost = async (postId) => {
    try {
      await deletePost(postId, dispatch, startListUpdateTransition);
    } catch (error) {
      // Error handling is done in the service
    }
  };

  // Handle page changes using service workflow
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    changePage(
      user?.id,
      newPage,
      pagination,
      dispatch,
      startPaginationTransition,
    );
  };

  // Update filtered posts when posts change
  useEffect(() => {
    if (!searchQuery) {
      setFilteredPosts(posts);
    } else {
      const filtered = filterPosts(posts, searchQuery);
      setFilteredPosts(filtered);
    }
  }, [posts, searchQuery]);

  // Reset to first page when posts change (new data loaded)
  useEffect(() => {
    setCurrentPage(1);
  }, [posts]);

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

        {/* Search Form with Transition Feedback */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Input
              placeholder="Search posts..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="flex-1"
            />
            {isSearchPending && (
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
              </div>
            )}
          </div>
          <Button type="submit" variant="outline" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </form>
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
            {/* Posts List with Transition Feedback */}
            <div
              className={`space-y-4 transition-opacity duration-200 ${
                isSearchPending || isListUpdatePending
                  ? "opacity-70"
                  : "opacity-100"
              }`}
            >
              {filteredPosts.map((post) => (
                <PostItem
                  key={post.id}
                  post={post}
                  onEdit={onEditPost}
                  onView={onViewPost}
                  onDelete={handleDeletePost}
                />
              ))}
            </div>

            {/* Pagination with Transition Feedback */}
            {totalPages > 1 && !searchQuery && (
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                  {isPaginationPending && (
                    <span className="ml-2 text-primary">Loading...</span>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1 || isPaginationPending}
                  >
                    {isPaginationPending ? (
                      <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                    ) : null}
                    Previous
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages || isPaginationPending}
                  >
                    {isPaginationPending ? (
                      <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                    ) : null}
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default memo(PostList);
