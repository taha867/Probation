/**
 * AuthorAvatar - Reusable component for displaying author avatars
 * Handles image display with fallback to initials placeholder
 */
import { memo } from "react";
import { getImageUrl } from "../../utils/imageUtils";
import { getAuthorInitial } from "../../utils/authorUtils";

/**
 * AuthorAvatar component
 * @param {Object} props
 * @param {Object} props.author - Author object with name and image properties
 * @param {string} props.size - Size variant: "sm" (24px), "md" (40px), or "lg" (48px). Defaults to "md"
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.fallbackBgColor - Background color for placeholder (default: "bg-blue-600")
 */
const AuthorAvatar = memo(({ author, size = "md", className = "", fallbackBgColor = "bg-blue-600" }) => {
  const authorName = author?.name || "Unknown";
  const authorImageUrl = getImageUrl(author?.image);
  
  // Determine size classes
  const sizeClasses = {
    sm: "h-6 w-6 text-xs",      // 24px
    md: "h-10 w-10 text-sm",    // 40px
    lg: "h-12 w-12 text-base",  // 48px
  };
  
  const sizeClass = sizeClasses[size] || sizeClasses.md;
  const [heightClass, widthClass, textClass] = sizeClass.split(" ");

  // Get initials - use getAuthorInitial for simple author name strings
  const initials = getAuthorInitial(authorName);

  if (authorImageUrl) {
    return (
      <img
        src={authorImageUrl}
        alt={authorName}
        className={`${heightClass} ${widthClass} rounded-full object-cover flex-shrink-0 ${className}`}
        loading="lazy"
      />
    );
  }

  return (
    <div
      className={`${heightClass} ${widthClass} rounded-full ${fallbackBgColor} flex items-center justify-center flex-shrink-0 ${className}`}
    >
      <span className={`text-white font-medium ${textClass}`}>
        {initials}
      </span>
    </div>
  );
});

AuthorAvatar.displayName = "AuthorAvatar";

export default AuthorAvatar;

