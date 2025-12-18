/**
 * CreatePostForm - Optimized form component for creating new posts with useTransition
 * Using centralized state management and custom hooks
 */
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormSelect } from "../../custom";
import { postSchema } from "../../../validations/postSchemas";
import { usePostsContext } from "../../../contexts/postsContext";
import { createPost } from "../../../services/postService";
import { POST_STATUS, TOAST_MESSAGES } from "../../../utils/constants";
import { createSubmitHandlerWithToast } from "../../../utils/formSubmitWithToast";
import { invalidatePostsPromise } from "../../../utils/postsPromise";

const CreatePostForm = ({ onPostCreated }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormPending, startFormTransition] = useTransition();
  const [isListUpdatePending, startListUpdateTransition] = useTransition();
  const { dispatch } = usePostsContext();

  const form = useForm({
    resolver: yupResolver(postSchema),
    defaultValues: {
      title: "",
      body: "",
      status: POST_STATUS.DRAFT,
    },
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      await createPost(data, dispatch, startListUpdateTransition);

      // Ensure next dashboard mount fetches fresh posts including this one
      invalidatePostsPromise();

      // Non-urgent: Form reset and tab switch can be deferred for smooth UX
      startFormTransition(() => {
        form.reset();
        // Switch to list tab after successful creation
        onPostCreated?.();
      });
    } catch (error) {
      // Error handling is done in the service
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = createSubmitHandlerWithToast(form, onSubmit, {
    successMessage: TOAST_MESSAGES.POST_CREATED_SUCCESS,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Post</CardTitle>
      </CardHeader>
      <CardContent>
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

            <Button
              type="submit"
              disabled={isSubmitting || isFormPending}
              className="w-full"
            >
              {isSubmitting
                ? "Creating..."
                : isListUpdatePending
                ? "Updating list..."
                : isFormPending
                ? "Processing..."
                : "Create Post"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreatePostForm;
