/**
 * Author utility functions
 * Centralized logic for author-related data transformations
 */

/**
 * Get user initials from name or email
 * Handles multi-word names (uses first and last initial) or single word names
 * @param {Object} user - User object with name and/or email
 * @returns {string} - Uppercase initials (e.g., "JD" for "John Doe" or "J" for "John")
 */
export const getUserInitials = (user) => {
  if (user?.name) {
    const names = user.name.trim().split(/\s+/);
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return user.name[0]?.toUpperCase() || "U";
  }
  if (user?.email) {
    return user.email[0]?.toUpperCase() || "U";
  }
  return "U";
};

/**
 * Get author initials from author name
 * Simpler version for author objects that only have a name
 * @param {string} name - Author name
 * @returns {string} - Uppercase initial
 */
export const getAuthorInitial = (name) => {
  if (!name) return "U";
  return name.charAt(0).toUpperCase();
};

