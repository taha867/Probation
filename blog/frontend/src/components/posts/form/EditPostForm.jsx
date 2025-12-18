/**
 * EditPostForm - Local dialog component with useTransition optimization
 * Self-contained dialog state management for better performance
 */
import {
  memo,
  useState,
  useEffect,
  useTransition,
  forwardRef,
  useImperativeHandle,
} from "react";
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
import { FormField, FormSelect } from "../../custom";
import { postSchema } from "../../../validations/postSchemas";
import { usePostsContext } from "../../../contexts/postsContext";
import { updatePost } from "../../../services/postService";
import { POST_STATUS, TOAST_MESSAGES } from "../../../utils/constants";
import { createSubmitHandlerWithToast } from "../../../utils/formSubmitWithToast";

const EditPostForm = forwardRef((_props, ref) => {
  // Local dialog state (no global state needed)
  const [isOpen, setIsOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormPending, startFormTransition] = useTransition();
  const [isDialogPending, startDialogTransition] = useTransition();
  const [isListUpdatePending, startListUpdateTransition] = useTransition();

  const { dispatch } = usePostsContext();

  // Expose methods to parent via ref
  useImperativeHandle(
    ref,
    () => ({
      openDialog: (post) => {
        // Urgent: Show dialog immediately
        setIsOpen(true);

        // Non-urgent: Populate form data in background
        startDialogTransition(() => {
          setCurrentPost(post);
        });
      },
      closeDialog: () => {
        // Non-urgent: Close dialog smoothly
        startDialogTransition(() => {
          setIsOpen(false);
          setCurrentPost(null);
        });
      },
    }),
    [startDialogTransition],
  );

  const form = useForm({
    resolver: yupResolver(postSchema),
    defaultValues: {
      title: "",
      body: "",
      status: POST_STATUS.DRAFT,
    },
    mode: "onChange",
  });

  // Update form when post changes with useTransition
  useEffect(() => {
    if (currentPost) {
      // Non-urgent: Form population can be deferred for smooth dialog opening
      startFormTransition(() => {
        form.reset({
          title: currentPost.title || "",
          body: currentPost.body || "",
          status: currentPost.status || POST_STATUS.DRAFT,
        });
      });
    }
  }, [currentPost, form, startFormTransition]);

  const onSubmit = async (data) => {
    if (!currentPost?.id) return;

    setIsSubmitting(true);

    try {
      await updatePost(
        currentPost.id,
        data,
        dispatch,
        startListUpdateTransition,
      );

      // Non-urgent: Dialog closing can be deferred for smooth UX
      startFormTransition(() => {
        setIsOpen(false);
        setCurrentPost(null);
      });
    } catch (error) {
      // Error handling is done in the service
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = createSubmitHandlerWithToast(form, onSubmit, {
    successMessage: TOAST_MESSAGES.POST_UPDATED_SUCCESS,
  });

  const handleClose = () => {
    if (!isSubmitting && !isFormPending) {
      startDialogTransition(() => {
        setIsOpen(false);
        setCurrentPost(null);
      });
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

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting || isFormPending || isDialogPending}
                className="flex-1"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting || isFormPending || isDialogPending}
                className="flex-1"
              >
                {isSubmitting
                  ? "Updating..."
                  : isListUpdatePending
                    ? "Updating list..."
                    : isFormPending
                      ? "Processing..."
                      : isDialogPending
                        ? "Loading..."
                        : "Update Post"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
});

export default memo(EditPostForm);
