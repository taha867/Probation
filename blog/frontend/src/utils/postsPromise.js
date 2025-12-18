//Handles initial posts data loading using cached promises with Suspense

import { fetchUserPosts } from "../services/postService";

// Cache for the posts promise to prevent infinite suspense
// This variable is acting as a cache.
// It lives outside React components, It survives re-renders, It holds the result of a previous operation
let postsPromise = null;

/**
 * Creates a cached promise for initial posts data loading
 * This promise resolves once with the user's posts data
 */
export const createInitialPostsPromise = (userId) => {
  // If no userId, return empty data immediately
  if (!userId) {
    return Promise.resolve({
      posts: [],
      pagination: {
        limit: 10,
        total: 0,
      },
    });
  }

  // Create cache key based on userId to handle user changes
  // This line creates a unique ID for the cache
  const cacheKey = `posts_${userId}`;

  // If promise already exists for this user, reuse it
  if (!postsPromise || postsPromise.cacheKey !== cacheKey) {
    postsPromise = new Promise(async (resolve, reject) => {
      try {
        // Fetch posts data using existing service
        const result = await fetchUserPosts(userId, {
          page: 1,
          limit: 10,
        });
        const { posts = [], pagination: { limit, total } = {} } = result || {};
        resolve({
          posts,
          pagination: {
            limit,
            total,
          },
        });
      } catch (error) {
        console.error("Error loading initial posts data:", error);
        // On error, resolve with empty data instead of rejecting
        // This prevents Suspense from showing error boundary
        // Reject-> Error Boundary
        // Resole-> UI still renders (empty Posts)
        resolve({
          posts: [],
          pagination: {
            limit: 10,
            total: 0,
          },
        });
      }
    });

    // Add cache key to promise for tracking
    postsPromise.cacheKey = cacheKey;
  }

  return postsPromise;
};

/**
 * Invalidates the posts promise cache
 * Call this when user logs out or switches to reset the promise
 */
export const invalidatePostsPromise = () => {
  postsPromise = null;
};

/**
 * Updates the posts promise cache with new data
 * Call this when posts are updated to refresh the cached promise
 */
export const updatePostsPromise = (userId, postsData) => {
  if (userId) {
    const cacheKey = `posts_${userId}`;
    postsPromise = Promise.resolve(postsData);
    postsPromise.cacheKey = cacheKey;
  }
};
