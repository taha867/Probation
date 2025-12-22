/**
 * PostCard - Memoized presentational component for a single post card
 * Displays post with image on left, content on right (matching design reference)
 * Prevents unnecessary re-renders when parent re-renders
 */
import { memo, useMemo, useState } from "react";
import { format } from "date-fns";
import { ImageIcon } from "lucide-react";

const PostCard = ({ post }) => {
  // Track if image failed to load to prevent infinite retries
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Memoize expensive calculations to prevent recalculation on every render
  const authorName = useMemo(
    () => post.author?.name ?? "Unknown author",
    [post.author?.name]
  );

  const formattedDate = useMemo(() => {
    if (!post.createdAt) return "";
    try {
      return format(new Date(post.createdAt), "dd MMMM yyyy");
    } catch {
      return "";
    }
  }, [post.createdAt]);

  // Calculate read time: average reading speed is ~200 words per minute
  const readTime = useMemo(() => {
    if (!post.body) return "0 Min. To Read";
    const wordCount = post.body.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / 200);
    return `${minutes} Min. To Read`;
  }, [post.body]);

  const excerpt = useMemo(() => {
    if (!post.body) return "";
    // Show first 120 characters for excerpt
    return post.body.length > 120 ? `${post.body.slice(0, 120)}...` : post.body;
  }, [post.body]);

  // Check if we should show placeholder (no image or image failed to load)
  const showPlaceholder = !post.image || imageError;

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
    <div className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow border border-gray-200">
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
                    {post.title || "No Image"}
                  </p>
                </div>
              </div>
            ) : (
              // Show actual image
              <img
                src={post.image}
                alt={post.title}
                className={`w-full h-full object-cover ${imageLoaded ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}
                onError={handleImageError}
                onLoad={handleImageLoad}
              />
            )}
          </div>
        </div>

        {/* Content on right */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            {/* Category label */}
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">
              Published
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-blue-600 cursor-pointer">
              {post.title}
            </h2>

            {/* Metadata: Author, Date, Read Time */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-3">
              <span>By {authorName}</span>
              <span>•</span>
              <span>{formattedDate}</span>
              <span>•</span>
              <span>{readTime}</span>
            </div>

            {/* Description/Excerpt */}
            <p className="text-gray-600 text-sm line-clamp-2">
              {excerpt}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Memoize PostCard to prevent re-renders when parent re-renders but post data hasn't changed
export default memo(PostCard);

