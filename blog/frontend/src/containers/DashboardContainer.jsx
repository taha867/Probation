/**
 * DashboardContainer - Optimized dashboard with centralized state management
 * Following React 19 best practices with context and custom hooks
 */
import {
  usePosts,
  usePostOperations,
  usePostDialogs,
} from "../hooks/postsHooks";
import { POST_TABS } from "../utils/constants";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import CreatePostForm from "../components/posts/CreatePostForm";
import PostList from "../components/posts/PostList";
import EditPostForm from "../components/posts/EditPostForm";
import ViewPostDialog from "../components/posts/ViewPostDialog";

/**
 * DashboardContainer - Main dashboard component
 * Uses posts context provided by DashboardPage
 */
export const DashboardContainer = () => {
  const { activeTab, setActiveTab } = usePosts();
  const { deletePost } = usePostOperations();
  const {
    editDialog,
    viewDialog,
    deleteDialog,
    openEditDialog,
    closeEditDialog,
    openViewDialog,
    closeViewDialog,
    openDeleteDialog,
    closeDeleteDialog,
  } = usePostDialogs();

  // Handle delete confirmation
  const handleConfirmDelete = async () => {
    if (!deleteDialog.postId) return;

    try {
      await deletePost(deleteDialog.postId);
      closeDeleteDialog();
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-10 px-4">
      <div className="space-y-6">
        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value={POST_TABS.LIST}>My Posts</TabsTrigger>
              <TabsTrigger value={POST_TABS.CREATE}>Create Post</TabsTrigger>
            </TabsList>

            <TabsContent value={POST_TABS.LIST} className="space-y-4">
              <PostList
                onEditPost={openEditDialog}
                onViewPost={openViewDialog}
              />
            </TabsContent>

            <TabsContent value={POST_TABS.CREATE} className="space-y-4">
              <CreatePostForm />
            </TabsContent>
          </Tabs>

          {/* Edit Post Dialog */}
          <EditPostForm
            post={editDialog.post}
            isOpen={editDialog.isOpen}
            onClose={closeEditDialog}
          />

          {/* View Post Dialog */}
          <ViewPostDialog
            post={viewDialog.post}
            fullPost={viewDialog.fullPost}
            loading={viewDialog.loading}
            isOpen={viewDialog.isOpen}
            onClose={closeViewDialog}
            onEditPost={openEditDialog}
            onDeletePost={openDeleteDialog}
          />

          {/* Delete Confirmation Dialog */}
          <AlertDialog
            open={deleteDialog.isOpen}
            onOpenChange={closeDeleteDialog}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Post</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this post? This action cannot
                  be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleConfirmDelete}
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
};

export default DashboardContainer;
