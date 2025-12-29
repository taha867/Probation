import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormSelect, FormFileInput } from "../../custom";
import { postSchema } from "../../../validations/postSchemas";
import { useCreatePost } from "../../../hooks/postHooks/postMutations";
import { POST_STATUS } from "../../../utils/constants";
import { createSubmitHandlerWithToast } from "../../../utils/formSubmitWithToast";

const CreatePostForm = ({ onPostCreated }) => {
  const [isFormPending, startFormTransition] = useTransition();

  // React Query mutation - handles API call and cache invalidation automatically
  const createPostMutation = useCreatePost();

  const form = useForm({
    resolver: yupResolver(postSchema),
    defaultValues: {
      title: "",
      body: "",
      status: POST_STATUS.DRAFT,
      image: null, // Cloudinary upload result: {image: url, imagePublicId: id} or null
    },
    mode: "onChange", //validates fields as the user types
  });

  const onSubmit = async (data) => {
    try {
      // Prepare JSON payload (no FormData needed - image already uploaded to Cloudinary)
      const payload = {
        title: data.title,
        body: data.body,
        status: data.status,
      };

      // Add image URL and publicId if image was uploaded
      if (data.image && typeof data.image === "object" && data.image.image) {
        payload.image = data.image.image;
        payload.imagePublicId = data.image.imagePublicId;
      }

      // React Query mutation handles API call and cache invalidation automatically
      await createPostMutation.mutateAsync(payload);

      // Non-urgent: Form reset and tab switch can be deferred for smooth UX
      startFormTransition(() => {
        form.reset();
        // Switch to list tab after successful creation
        onPostCreated?.();
      });
    } catch (error) {
      // Error handling is done by React Query and axios interceptor
    }
  };

  // Success message is shown automatically by axios interceptor from backend message
  const handleSubmit = createSubmitHandlerWithToast(form, onSubmit);

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

            <FormFileInput
              control={form.control}
              name="image"
              label="Post Image (Optional)"
              maxSizeMB={5}
              folder="blog/posts"
            />

            <Button
              type="submit"
              variant="success"
              disabled={createPostMutation.isPending || isFormPending}
              className="w-full"
            >
              {createPostMutation.isPending
                ? "Creating..."
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
