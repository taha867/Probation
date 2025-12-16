/**
 * CreatePostForm - Optimized form component for creating new posts
 * Using centralized state management and custom hooks
 */
import { memo, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { postSchema } from "../../validations/postSchemas";
import { usePostOperations } from "../../hooks/postsHooks";
import { POST_STATUS } from "../../utils/constants";

const CreatePostForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createPost } = usePostOperations();

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
      await createPost(data);
      // Reset form on success
      form.reset();
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Post</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter post title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your post content here..."
                      className="min-h-[200px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select post status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={POST_STATUS.DRAFT}>Draft</SelectItem>
                      <SelectItem value={POST_STATUS.PUBLISHED}>
                        Published
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Creating..." : "Create Post"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default memo(CreatePostForm);
