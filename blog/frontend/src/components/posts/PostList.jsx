/**
 * PostList - Optimized component for displaying posts
 * Using centralized state management and memoization
 */
import { memo, useCallback } from "react";
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
import { usePosts, usePostOperations } from "../../hooks/postsHooks";
import { formatDistanceToNow } from "date-fns";
import { POST_STATUS } from "../../utils/constants";

// Memoized Post Item Component for better performance
const PostItem = memo(({ post, onEdit, onView, onDelete }) => {
  const getStatusColor = useCallback((status) => {
    return status === POST_STATUS.PUBLISHED
      ? "bg-green-100 text-green-800"
      : "bg-yellow-100 text-yellow-800";
  }, []);

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
                  onClick={() => onDelete(post.id)}
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

function PostList({ onEditPost, onViewPost }) {
  const {
    filteredPosts,
    loading,
    pagination,
    searchQuery,
    setSearchQuery,
    changePage,
  } = usePosts();
  const { deletePost } = usePostOperations();

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    // Client-side search is handled by the hook
  }, []);

  const handleDeletePost = useCallback(
    async (postId) => {
      try {
        await deletePost(postId);
      } catch (error) {
        // Error handling is done in the hook
      }
    },
    [deletePost],
  );

  if (loading && filteredPosts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">Loading posts...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

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
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
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
            {/* Posts List */}
            <div className="space-y-4">
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

            {/* Pagination - hide when searching since we're doing client-side filtering */}
            {pagination.totalPages > 1 && !searchQuery && (
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Page {pagination.page} of {pagination.totalPages}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => changePage(pagination.page - 1)}
                    disabled={pagination.page <= 1 || loading}
                  >
                    Previous
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => changePage(pagination.page + 1)}
                    disabled={
                      pagination.page >= pagination.totalPages || loading
                    }
                  >
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
}

export default memo(PostList);
