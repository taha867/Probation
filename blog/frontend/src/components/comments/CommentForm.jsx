/**
 * CommentForm - Form component for adding comments and replies
 * Follows React 19 best practices with proper form handling
 */
import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormField } from "../custom";
import { useCreateComment } from "../../hooks/commentHooks/commentMutations";
import { createSubmitHandlerWithToast } from "../../utils/formSubmitWithToast";
import { commentSchema } from "../../validations/commentSchemas";

const CommentForm = ({
  postId,
  parentId = null,
  onSuccess,
  placeholder = "Add comment...",
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createCommentMutation = useCreateComment();

  const form = useForm({
    resolver: yupResolver(commentSchema),
    defaultValues: {
      body: "",
    },
    mode: "onChange",
  });

  const onSubmit = useCallback(
    async (data) => {
      if (!postId && !parentId) return;

      setIsSubmitting(true);
      try {
        await createCommentMutation.mutateAsync({
          body: data.body,
          postId: parentId ? undefined : postId,
          parentId: parentId || undefined,
        });

        // Reset form on success
        form.reset({ body: "" });

        // Call optional success callback
        if (onSuccess) {
          onSuccess();
        }
      } catch (error) {
        // Error handling is done by axios interceptor
      } finally {
        setIsSubmitting(false);
      }
    },
    [postId, parentId, createCommentMutation, form, onSuccess]
  );

  const handleSubmit = createSubmitHandlerWithToast(form, onSubmit);

  const isPending = isSubmitting || createCommentMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <FormField
          control={form.control}
          name="body"
          type="textarea"
          placeholder={placeholder}
          rows={3}
          disabled={isPending}
        />
        <div className="flex justify-end">
          <Button type="submit" variant="success" disabled={isPending} size="sm">
            {isPending ? "Posting..." : parentId ? "Reply" : "Post"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CommentForm;
