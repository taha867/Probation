/**
 * AuthorAvatar - Reusable component for displaying author avatars
 * Handles image display with fallback to initials placeholder
 * Supports click-to-preview for profile images
 */
import { memo, useState, useCallback, useMemo } from "react";
import { getImageUrl } from "../../utils/imageUtils";
import { getAuthorInitial } from "../../utils/authorUtils";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { createAuthorComparison } from "../../utils/memoComparisons";


const AuthorAvatar = memo(({ author, size = "md", className = "", fallbackBgColor = "bg-blue-600" }) => {
  const authorName = author?.name || "Unknown";
  const authorImageUrl = getImageUrl(author?.image);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  
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

  // Handle avatar click - open preview dialog
  const handleAvatarClick = useCallback((e) => {
    e.stopPropagation(); // Prevent triggering parent click handlers
    if (authorImageUrl) {
      setIsPreviewOpen(true);
      setImageLoading(true);
      setImageError(false);
    }
  }, [authorImageUrl]);

  // Handle image load in preview
  const handleImageLoad = useCallback(() => {
    setImageLoading(false);
  }, []);

  // Handle image error in preview
  const handleImageError = useCallback(() => {
    setImageLoading(false);
    setImageError(true);
  }, []);

  // Reset image state when dialog closes
  const handleDialogChange = useCallback((open) => {
    setIsPreviewOpen(open);
    if (!open) {
      // Reset states when dialog closes
      setImageLoading(true);
      setImageError(false);
    }
  }, []);

  if (authorImageUrl) {
    return (
      <>
        <img
          src={authorImageUrl}
          alt={authorName}
          onClick={handleAvatarClick}
          className={`${heightClass} ${widthClass} rounded-full object-cover flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity ${className}`}
          loading="lazy"
          role="button"
          tabIndex={0}
          aria-label={`View ${authorName}'s profile picture`}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleAvatarClick(e);
            }
          }}
        />
        
        {/* Image Preview Dialog */}
        <Dialog open={isPreviewOpen} onOpenChange={handleDialogChange}>
          <DialogContent className="max-w-2xl p-0 bg-transparent border-none shadow-none">
            {/* Visually hidden title and description for accessibility */}
            <DialogTitle className="sr-only">
              {authorName}'s Profile Picture
            </DialogTitle>
            <DialogDescription className="sr-only">
              Large preview of {authorName}'s profile picture. Click outside or press Escape to close.
            </DialogDescription>
            
            <div className="relative bg-white rounded-lg overflow-hidden shadow-xl">
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              )}
              {imageError ? (
                <div className="flex flex-col items-center justify-center p-12 bg-gray-100 min-h-[400px]">
                  <p className="text-gray-500 text-sm">Failed to load image</p>
                </div>
              ) : (
                <img
                  src={authorImageUrl}
                  alt={`${authorName}'s profile picture`}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  className={`w-full h-auto max-h-[80vh] object-contain ${imageLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
                />
              )}
            </div>
            {/* Optional: Author name below image */}
            {!imageError && (
              <div className="mt-3 text-center">
                <p className="text-sm text-white font-medium drop-shadow-lg">{authorName}</p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </>
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
}, createAuthorComparison());

export default AuthorAvatar;

