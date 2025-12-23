
import { useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import PostList from "../components/posts/PostList";
import EditPostForm from "../components/posts/form/EditPostForm";
import DeletePostDialog from "../components/posts/DeletePostDialog";


export const DashboardContainer = () => {
  const navigate = useNavigate();

  // Dialog refs for controlling local dialog components (refs don't cause re-renders)
  const editDialogRef = useRef(null);
  const deleteDialogRef = useRef(null);

  // Navigate to create post page - stable reference
  const handleCreatePost = useCallback(() => {
    navigate("/create-post");
  }, [navigate]);

  // Dialog handlers - stabilized with useCallback to prevent child re-renders
  // React 19 best practice: stabilize handlers passed as props
  const handleEditPost = useCallback((post) => {
    editDialogRef.current?.openDialog(post);
  }, []);

  const handleDeletePost = useCallback((post) => {
    deleteDialogRef.current?.openDialog(post);
  }, []);

  return (
    <div className="container max-w-4xl mx-auto py-10 px-4">
      <div className="space-y-6">
        {/* Header with Create Post Button */}
        <div className="flex items-center justify-between">
          <div>
            
          </div>
          <Button
            onClick={handleCreatePost}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Post
          </Button>
        </div>

        {/* Posts List */}
        <div>
          <PostList onEditPost={handleEditPost} onDeletePost={handleDeletePost} />
        </div>

        {/* Local Dialog Components - Each manages its own state */}
        <EditPostForm ref={editDialogRef} />
        <DeletePostDialog ref={deleteDialogRef} />
      </div>
    </div>
  );
};

export default DashboardContainer;
