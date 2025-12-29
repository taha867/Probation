import { memo, useMemo, useState } from "react";
import { ImageIcon } from "lucide-react";
import { usePostDetail } from "../../hooks/postHooks/postQueries";
import AppInitializer from "../common/AppInitializer";
import {
  calculateReadTime,
  formatPostDate,
  getPostImageUrl,
  getAuthorInfo,
} from "../../utils/postUtils";
import AuthorAvatar from "../common/AuthorAvatar";

const PostDetailContent = memo(({ postId }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const { data: post, isLoading, error } = usePostDetail(postId);

  // Destructure with safe defaults - use undefined (not {}) so utility functions handle them correctly
  const { createdAt, body, author, image, title, status } = post || {};

  const formattedDate = useMemo(() => formatPostDate(createdAt), [createdAt]);

  const readTime = useMemo(() => calculateReadTime(body), [body]);

  const { name: authorName } = getAuthorInfo(author);

  const imageUrl = getPostImageUrl(image);

  const showPlaceholder = !imageUrl || imageError;

  if (isLoading) {
    return <AppInitializer />;
  }

  if (error || !post) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Post not found or failed to load.</p>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* Tags/Status */}
      <div className="mb-4">
        <span className="text-xs text-gray-500 uppercase tracking-wide">
          {status === "published" ? "Published" : "Draft"}
        </span>
        <span className="mx-2 text-gray-300">•</span>
        <span className="text-xs text-gray-500">{readTime}</span>
      </div>

      {/* Title */}
      <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>

      {/* Author Info */}
      <div className="flex items-center gap-3 mb-6">
        <AuthorAvatar author={author} size="md" />
        <div>
          <p className="font-semibold text-gray-900">{authorName}</p>
          <p className="text-sm text-gray-500">{formattedDate}</p>
        </div>
      </div>

      {/* Main Image */}
      {showPlaceholder ? (
        <div className="w-full min-h-[400px] bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 rounded-lg mb-8 flex items-center justify-center">
          <div className="text-center">
            <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No Image</p>
          </div>
        </div>
      ) : (
        <div className="w-full rounded-lg overflow-hidden mb-8 bg-gray-100">
          <img
            src={imageUrl}
            alt={title}
            className={`w-full h-auto max-h-[70vh] object-contain mx-auto block ${
              imageLoaded ? "opacity-100" : "opacity-0"
            } transition-opacity duration-300`}
            onError={() => setImageError(true)}
            onLoad={() => setImageLoaded(true)}
          />
        </div>
      )}

      {/* Post Body */}
      <div className="prose prose-lg max-w-none">
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
          {body}
        </p>
      </div>
    </article>
  );
});

export default PostDetailContent;
