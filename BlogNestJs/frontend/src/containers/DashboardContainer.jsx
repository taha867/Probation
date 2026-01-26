
import { useRef, useCallback } from "react";
import PostList from "../components/posts/PostList";
import EditPostForm from "../components/posts/form/EditPostForm";
import DeletePostDialog from "../components/posts/DeletePostDialog";


export const DashboardContainer = () => {

  
  const editDialogRef = useRef(null);
  const deleteDialogRef = useRef(null);

  

  const handleEditPost = useCallback((post) => {
    editDialogRef.current?.openDialog(post);
  }, []);

  const handleDeletePost = useCallback((post) => {
    deleteDialogRef.current?.openDialog(post);
  }, []);

  return (
    <div className="container max-w-4xl mx-auto py-10 px-4">
      <div className="space-y-6">
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
