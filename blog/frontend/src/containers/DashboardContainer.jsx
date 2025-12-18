/**
 * DashboardContainer - Optimized dashboard showing user posts
 * Clean interface with navigation to create post page
 */
import { useRef, useTransition } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import PostList from "../components/posts/PostList";
import EditPostForm from "../components/posts/form/EditPostForm";
import ViewPostDialog from "../components/posts/ViewPostDialog";
import DeletePostDialog from "../components/posts/DeletePostDialog";

/**
 * DashboardContainer - Main dashboard component with minimal local state
 * Shows user posts with navigation to create new posts
 */
export const DashboardContainer = () => {
  const navigate = useNavigate();

  // Single useTransition for all operations
  const [isPending, startTransition] = useTransition();

  // Dialog refs for controlling local dialog components
  const editDialogRef = useRef(null);
  const viewDialogRef = useRef(null);
  const deleteDialogRef = useRef(null);

  // Navigate to create post page
  const handleCreatePost = () => {
    navigate("/create-post");
  };

  // Dialog handlers - each dialog manages its own state
  const handleEditPost = (post) => {
    startTransition(() => {
      editDialogRef.current?.openDialog(post);
    });
  };

  const handleViewPost = (post) => {
    startTransition(() => {
      viewDialogRef.current?.openDialog(post);
    });
  };

  const handleDeletePost = (postId, postTitle) => {
    startTransition(() => {
      deleteDialogRef.current?.openDialog(postId, postTitle);
    });
  };

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
          <PostList onEditPost={handleEditPost} onViewPost={handleViewPost} />
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
