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

  const { createdAt, body, author, image, title} = post || {};

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
    <article className="max-w-4xl mx-auto px-4 py-12 md:py-16">
      {/* Header Section */}
      <header className="mb-10 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
          {title}
        </h1>

        {/* Author & Meta Info */}
        <div className="flex items-center justify-center md:justify-start gap-4">
          <AuthorAvatar author={author} size="lg" className="h-12 w-12 ring-2 ring-white shadow-sm" />
          <div className="text-left">
            <p className="font-bold text-gray-900 text-lg leading-none mb-1">
              {authorName}
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
              <time dateTime={createdAt}>{formattedDate}</time>
              <span>•</span>
              <span>{readTime}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Image - Cinematic */}
      {showPlaceholder ? (
        <div className="w-full aspect-[21/9] bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl mb-12 flex items-center justify-center shadow-inner">
          <div className="text-center">
            <ImageIcon className="w-16 h-16 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-400 font-medium tracking-wide">No Cover Image</p>
          </div>
        </div>
      ) : (
        <div className="relative w-full rounded-2xl overflow-hidden mb-12 shadow-xl bg-gray-100 group">
          <img
            src={imageUrl}
            alt={title}
            className={`w-full h-auto object-cover max-h-[600px] transition-transform duration-700 hover:scale-105 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onError={() => setImageError(true)}
            onLoad={() => setImageLoaded(true)}
          />
        </div>
      )}

      {/* Post Body - Typography Enhanced */}
      <div className="prose prose-lg md:prose-xl prose-slate max-w-none mx-auto">
        <p className="text-gray-800 leading-relaxed whitespace-pre-wrap break-words">
          {body}
        </p>
      </div>
    </article>
  );
});

export default PostDetailContent;
