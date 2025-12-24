import { useEffect, forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormField, FormSelect, FormFileInput } from "../../custom";
import { postSchema } from "../../../validations/postSchemas";
import { useUpdatePost } from "../../../hooks/usePostMutations";
import { useImperativeDialog } from "../../../hooks/useImperativeDialog";
import { POST_STATUS, TOAST_MESSAGES } from "../../../utils/constants";
import { createSubmitHandlerWithToast } from "../../../utils/formSubmitWithToast";

const EditPostForm = forwardRef((_props, ref) => {
  // Dialog state via shared hook
  const {
    isOpen,
    payload: currentPost,
    openDialog: openDialogState,
    closeDialog: closeDialogState,
  } = useImperativeDialog(null);

  // React Query mutation - handles API call and cache invalidation automatically
  const updatePostMutation = useUpdatePost();

  // Expose methods to parent via ref
  useImperativeHandle(
    ref,
    () => ({
      openDialog: (post) => {
        if (!post) return;
        openDialogState(post);
      },
      closeDialog: () => {
        if (!updatePostMutation.isPending) {
          closeDialogState();
        }
      },
    }),
    [openDialogState, closeDialogState, updatePostMutation.isPending],
  );

  const form = useForm({
    resolver: yupResolver(postSchema),
    defaultValues: {
      title: "",
      body: "",
      status: POST_STATUS.DRAFT,
      image: null, // Cloudinary upload result: {image: url, imagePublicId: id} or existing URL string
    },
    mode: "onChange",
  });

  // Update form when post changes
  useEffect(() => {
    if (currentPost) {
      form.reset({
        title: currentPost.title || "",
        body: currentPost.body || "",
        status: currentPost.status || POST_STATUS.DRAFT,
        image: currentPost.image || null, // Set existing image URL for preview
      });
    }
  }, [currentPost, form]);

  const onSubmit = async (data) => {
    if (!currentPost?.id) return;

    try {
      // Prepare JSON payload (no FormData needed - image already uploaded to Cloudinary)
      const payload = {
        title: data.title,
        body: data.body,
        status: data.status,
      };

      // Handle image: if new upload (object with image property), include it
      // If unchanged (string URL), don't include (backend keeps existing)
      // If null/removed, set to null
      if (data.image === null) {
        // Image was removed
        payload.image = null;
        payload.imagePublicId = null;
      } else if (data.image && typeof data.image === "object" && data.image.image) {
        // New image uploaded to Cloudinary
        payload.image = data.image.image;
        payload.imagePublicId = data.image.imagePublicId;
      }
      // If data.image is a string (existing URL), don't include in payload (backend keeps existing)

      // React Query mutation handles API call and cache invalidation automatically
      // Pass previousStatus so mutation can check if home posts need invalidation
      await updatePostMutation.mutateAsync({
        postId: currentPost.id,
        data: payload,
        previousStatus: currentPost.status,
      });

      closeDialogState();
    } catch (error) {
      // Error handling is done by React Query and axios interceptor
    }
  };

  const handleSubmit = createSubmitHandlerWithToast(form, onSubmit, {
    successMessage: TOAST_MESSAGES.POST_UPDATED_SUCCESS,
  });

  const handleClose = () => {
    if (!updatePostMutation.isPending) {
      closeDialogState();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Post</DialogTitle>
          <DialogDescription>
            Update the title, content, and status of your post.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              type="text"
              label="Title"
              placeholder="Enter post title"
            />

            <FormField
              control={form.control}
              name="body"
              type="textarea"
              label="Content"
              placeholder="Write your post content here..."
              rows={8}
              className="min-h-[200px]"
            />

            <FormSelect
              control={form.control}
              name="status"
              label="Status"
              placeholder="Select post status"
              options={[
                { value: POST_STATUS.DRAFT, label: "Draft" },
                { value: POST_STATUS.PUBLISHED, label: "Published" },
              ]}
            />

            <FormFileInput
              control={form.control}
              name="image"
              label="Post Image (Optional)"
              maxSizeMB={5}
              existingImageUrl={currentPost?.image || null}
              folder="blog/posts"
            />

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={updatePostMutation.isPending}
                className="flex-1"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={updatePostMutation.isPending}
                className="flex-1"
              >
                {updatePostMutation.isPending ? "Updating..." : "Update Post"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
});

export default EditPostForm;
