/**
 * Post-specific utility functions
 * Centralized logic for post-related data transformations
 */
import { format } from "date-fns";

/**
 * Calculate estimated reading time for a post body
 * Assumes average reading speed of 200 words per minute
 * @param {string} body - Post body content
 * @returns {string} - Formatted read time string (e.g., "5 Min. To Read")
 */
export const calculateReadTime = (body) => {
  if (!body) return "0 Min. To Read";
  const wordCount = body.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / 200);
  return `${minutes} Min. To Read`;
};

/**
 * Format post creation date to a readable string
 * @param {string|Date} date - Date string or Date object
 * @returns {string} - Formatted date string (e.g., "25 December 2024")
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
 * Get full image URL from post image path
 * Handles both absolute URLs and relative paths
 * @param {string} imagePath - Image path from post
 * @returns {string|null} - Full image URL or null
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
 * @param {Object} author - Author object from post/comment
 * @returns {Object} - Object with name and image properties
 */
export const getAuthorInfo = (author) => {
  return {
    name: author?.name || "Unknown",
    image: author?.image || null,
  };
};

