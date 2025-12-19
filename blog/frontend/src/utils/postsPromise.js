//Handles initial posts data loading using cached promises with Suspense

import { fetchUserPosts, fetchAllPosts } from "../services/postService";

// Cache for the posts promise to prevent infinite suspense
// This variable is acting as a cache.
// It lives outside React components, It survives re-renders, It holds the result of a previous operation
let postsPromise = null;

// Cache for the home posts promise to prevent infinite suspense
let homePostsPromise = null;

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

/**
 * Creates a cached promise for home page posts (all published posts)
 * Uses React 19 Suspense pattern with use() hook
 * This promise resolves once with all published posts for a specific page
 */
export const createHomePostsPromise = (page = 1, limit = 10) => {
  // Create cache key based on page to handle page changes
  const cacheKey = `home_posts_${page}_${limit}`;

  // If promise already exists for this page, reuse it
  if (!homePostsPromise || homePostsPromise.cacheKey !== cacheKey) {
    homePostsPromise = new Promise(async (resolve, reject) => {
      try {
        // Fetch posts for specific page using service (service filters published posts)
        const result = await fetchAllPosts({ page, limit });
        const { posts = [], pagination = {} } = result || {};
        resolve({
          posts,
          pagination,
        });
      } catch (error) {
        console.error("Error loading home posts:", error);
        // On error, resolve with empty data instead of rejecting
        // This prevents Suspense from showing error boundary
        resolve({
          posts: [],
          pagination: {
            limit,
            total: 0,
            page,
          },
        });
      }
    });

    // Add cache key to promise for tracking
    homePostsPromise.cacheKey = cacheKey;
  }

  return homePostsPromise;
};

/**
 * Invalidates the home posts promise cache
 * Call this when posts are created/updated/deleted to refresh home page
 */
export const invalidateHomePostsPromise = () => {
  homePostsPromise = null;
};
