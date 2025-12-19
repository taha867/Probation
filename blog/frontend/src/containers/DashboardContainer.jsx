/**
 * DashboardContainer - Optimized dashboard with React 19 best practices
 * Uses useCallback to stabilize handlers and prevent unnecessary re-renders
 * 
 */
import { useRef, useTransition, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import PostList from "../components/posts/PostList";
import EditPostForm from "../components/posts/form/EditPostForm";
import ViewPostDialog from "../components/posts/ViewPostDialog";
import DeletePostDialog from "../components/posts/DeletePostDialog";

/**
 * DashboardContainer - Main dashboard component with React 19 optimizations
 * - Stable handlers via useCallback prevent child re-renders
 * - useRef for dialogs (no re-renders)
 * - useTransition for smooth UX
 */
export const DashboardContainer = () => {
  const navigate = useNavigate();

  // Single useTransition for all operations
  const [isPending, startTransition] = useTransition();

  // Dialog refs for controlling local dialog components (refs don't cause re-renders)
  const editDialogRef = useRef(null);
  const viewDialogRef = useRef(null);
  const deleteDialogRef = useRef(null);

  // Navigate to create post page - stable reference
  const handleCreatePost = useCallback(() => {
    navigate("/create-post");
  }, [navigate]);

  // Dialog handlers - stabilized with useCallback to prevent child re-renders
  // React 19 best practice: stabilize handlers passed as props
  const handleEditPost = useCallback(
    (post) => {
      startTransition(() => {
        editDialogRef.current?.openDialog(post);
      });
    },
    [startTransition]
  );

  const handleViewPost = useCallback(
    (post) => {
      startTransition(() => {
        viewDialogRef.current?.openDialog(post);
      });
    },
    [startTransition]
  );

  const handleDeletePost = useCallback(
    (postId, postTitle) => {
      startTransition(() => {
        deleteDialogRef.current?.openDialog(postId, postTitle);
      });
    },
    [startTransition]
  );

  return (
    <div className="container max-w-4xl mx-auto py-10 px-4">
      <div className="space-y-6">
        {/* Header with Create Post Button */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">My Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your posts and create new content
            </p>
          </div>
          <Button
            onClick={handleCreatePost}
            disabled={isPending}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Post
          </Button>
        </div>

        {/* Posts List */}
        <div
          className={`transition-opacity duration-200 ${
            isPending ? "opacity-90" : "opacity-100"
          }`}
        >
          <PostList
            onEditPost={handleEditPost}
            onViewPost={handleViewPost}
            onDeletePost={handleDeletePost}
          />
        </div>

        {/* Local Dialog Components - Each manages its own state */}
        <EditPostForm ref={editDialogRef} />

        <ViewPostDialog
          ref={viewDialogRef}
          onEditPost={handleEditPost}
          onDeletePost={handleDeletePost}
        />

        <DeletePostDialog ref={deleteDialogRef} />
      </div>
    </div>
  );
};

export default DashboardContainer;
