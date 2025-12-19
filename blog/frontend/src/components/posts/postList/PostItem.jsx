/**
 * PostItem - Presentational component for a single post row
 * Pure UI: receives handlers from parent, no local state or side effects.
 * Memoized to prevent re-renders when parent re-renders but post data hasn't changed.
 */
import { memo, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { POST_STATUS } from "../../../utils/constants";

const PostItem = ({ post, onEdit, onView, onDelete }) => {
  const getStatusColor = (status) =>
    status === POST_STATUS.PUBLISHED
      ? "bg-green-100 text-green-800"
      : "bg-yellow-100 text-yellow-800";

  // Memoize date formatting to prevent recalculation on every render
  const createdDate = useMemo(
    () =>
      formatDistanceToNow(new Date(post.createdAt), {
        addSuffix: true,
      }),
    [post.createdAt]
  );

  const updatedDate = useMemo(
    () =>
      post.updatedAt !== post.createdAt
        ? formatDistanceToNow(new Date(post.updatedAt), {
            addSuffix: true,
          })
        : null,
    [post.updatedAt, post.createdAt]
  );

  return (
    <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold truncate">{post.title}</h3>
            <Badge className={getStatusColor(post.status)}>{post.status}</Badge>
          </div>

          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
            {post.body}
          </p>

          <div className="text-xs text-muted-foreground">
            Created {createdDate}
            {updatedDate && <span> • Updated {updatedDate}</span>}
          </div>
        </div>

        <div className="flex items-center gap-2 ml-4">
          <Button variant="outline" size="sm" onClick={() => onView(post)}>
            <Eye className="h-4 w-4" />
          </Button>

          <Button variant="outline" size="sm" onClick={() => onEdit(post)}>
            <Edit className="h-4 w-4" />
          </Button>

          {/* Uses shared delete dialog from DashboardContainer via onDelete prop */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(post.id, post.title)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// Memoize PostItem to prevent re-renders when parent re-renders but post data hasn't changed
export default memo(PostItem);
