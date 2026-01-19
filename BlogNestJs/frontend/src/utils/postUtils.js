
import { format } from "date-fns";


export const calculateReadTime = (body) => {
  if (!body) return "0 Min. To Read";
  const wordCount = body.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / 200);
  return `${minutes} Min. To Read`;
};

/**
 * Format post creation date to a readable string
 * returns Formatted date string (e.g., "25 December 2024")
 */
export const formatPostDate = (date) => {
  if (!date) return "";
  try {
    return format(new Date(date), "dd MMMM yyyy");
  } catch {
    return "";
  }
};

/**
 * Handles both absolute URLs and relative paths
 * returns  Full image URL or null
 */
export const getPostImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  return `${baseURL}${imagePath}`;
};

/**
 * Extract author information with defaults
 */
export const getAuthorInfo = (author) => {
  return {
    name: author?.name || "Unknown",
    image: author?.image || null,
  };
};

