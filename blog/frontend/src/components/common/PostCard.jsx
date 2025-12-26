import { memo, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ImageIcon, Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  calculateReadTime,
  formatPostDate,
  getPostImageUrl,
  getAuthorInfo,
} from "../../utils/postUtils";
import AuthorAvatar from "./AuthorAvatar";

const PostCard = ({ post, variant = "public", onView, onEdit, onDelete }) => {
  const navigate = useNavigate();
  // Track if image failed to load to prevent infinite retries
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const isDashboard = variant === "dashboard";

  // Handle post click - navigate to post detail page (only if not clicking on action buttons)
  const handlePostClick = useCallback(
    (e) => {
      // Don't navigate if clicking on action buttons or their children
      const clickedButton = e.target.closest("button");
      if (clickedButton) {
        return;
      }
      if (id) {
        navigate(`/posts/${id}`);
      }
    },
    [navigate, id]
  );

  // Destructure with safe defaults - use undefined (not {}) so utility functions handle them correctly
  const { author, createdAt, body, image, title, status, id } = post || {};
  // Get author info using utility function
  const { name: authorName } = getAuthorInfo(author);

  const formattedDate = useMemo(() => formatPostDate(createdAt), [createdAt]);

  const readTime = useMemo(() => calculateReadTime(body), [body]);

  const excerpt = useMemo(() => {
    if (!body) return "";
    // Show first 120 characters for excerpt
    return body.length > 120 ? `${body.slice(0, 120)}...` : body;
  }, [body]);

  // Get post image URL using utility function
  const imageUrl = getPostImageUrl(image);

  // Check if we should show placeholder (no image or image failed to load)
  const showPlaceholder = !imageUrl || imageError;

  // Handle image load error - set error state once to prevent infinite loop
  const handleImageError = () => {
    if (!imageError) {
      setImageError(true);
    }
  };

  // Handle successful image load
  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  return (
    <div
      className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow border border-gray-200 cursor-pointer"
      onClick={handlePostClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handlePostClick(e);
        }
      }}
      aria-label={`View post: ${title}`}
    >
      <div className="flex flex-col sm:flex-row gap-4 p-4">
        {/* Image on left */}
        <div className="flex-shrink-0">
          <div className="w-full sm:w-48 h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden relative">
            {showPlaceholder ? (
              // CSS-based placeholder - no external requests
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
                <div className="text-center">
                  <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs text-gray-500 px-2 line-clamp-2">
                    {title || "No Image"}
                  </p>
                </div>
              </div>
            ) : (
              // Show actual image
              <img
                src={imageUrl}
                alt={title}
                className={`w-full h-full object-cover ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                } transition-opacity duration-300`}
                onError={handleImageError}
                onLoad={handleImageLoad}
              />
            )}
          </div>
        </div>

        {/* Content on right */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            {/* Status / category + action buttons (dashboard only) */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500 uppercase tracking-wide">
                {isDashboard
                  ? (status || "draft").toString().toUpperCase()
                  : "Published"}
              </span>
              {isDashboard && (onView || onEdit || onDelete) && (
                <div
                  className="flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  {onView && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onView(post);
                      }}
                      className="h-7 w-7"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                  {onEdit && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(post);
                      }}
                      className="h-7 w-7"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(post);
                      }}
                      className="h-7 w-7"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
              {title}
            </h2>

            {/* Metadata: Author avatar + name, Date, Read Time */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-3">
              <div className="flex items-center gap-2 min-w-0">
                <AuthorAvatar
                  author={author}
                  size="sm"
                  fallbackBgColor="bg-gray-200"
                />
                <span className="text-gray-700 font-medium truncate">
                  {authorName}
                </span>
              </div>
              <span>•</span>
              <span>{formattedDate}</span>
              <span>•</span>
              <span>{readTime}</span>
            </div>

            {/* Description/Excerpt */}
            <p className="text-gray-600 text-sm line-clamp-2">{excerpt}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Memoize PostCard to prevent re-renders when parent re-renders but post data hasn't changed
export default memo(PostCard);
