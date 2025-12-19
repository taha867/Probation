/**
 * PostCard - Memoized presentational component for a single post card
 * Prevents unnecessary re-renders when parent re-renders
 */
import { memo, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

const PostCard = ({ post }) => {
  // Memoize expensive calculations to prevent recalculation on every render
  const authorName = useMemo(
    () => post.author?.name ?? "Unknown author",
    [post.author?.name]
  );

  const createdAtLabel = useMemo(
    () =>
      post.createdAt
        ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })
        : "",
    [post.createdAt]
  );

  const excerpt = useMemo(() => {
    if (!post.body) return "";
    return post.body.length > 160 ? `${post.body.slice(0, 160)}...` : post.body;
  }, [post.body]);

  return (
    <Card className="hover:shadow-lg transition-shadow bg-white">
      <CardHeader>
        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
          <span>{authorName}</span>
          <span>{createdAtLabel}</span>
        </div>
        <CardTitle className="text-2xl hover:text-blue-600 cursor-pointer">
          {post.title}
        </CardTitle>
        <CardDescription className="text-base">{excerpt}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="outline" size="sm">
          Read More
        </Button>
      </CardContent>
    </Card>
  );
};

// Memoize PostCard to prevent re-renders when parent re-renders but post data hasn't changed
export default memo(PostCard);

