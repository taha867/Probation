/**
 * Auth Promise Utility for React 19 use() hook
 * Handles initial authentication state resolution using cached promises
 * Includes automatic token refresh during app initialization
 */
import {
  getToken,
  decodeAndValidateToken,
  getRefreshToken,
  hasValidRefreshToken,
  storeToken,
  removeTokens,
} from "./tokenUtils";
import { TOAST_MESSAGES } from "./constants";

// Cache for the auth promise to prevent infinite suspense
let authPromise = null;

/**
 * Refreshes access token using refresh token during app initialization
 * @returns {Promise<string|null>} New access token or null if refresh failed
 */
const refreshTokenDuringInit = async () => {
  try {
    const refreshToken = getRefreshToken();

    if (!refreshToken || !hasValidRefreshToken()) {
      console.warn(TOAST_MESSAGES.NO_REFRESH_TOKEN);
      return null;
    }

    console.log(
      "Attempting to refresh access token during app initialization..."
    );

    // Make direct API call to refresh endpoint (not using axios instance to avoid circular dependency)
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/auth/refreshToken`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      }
    );

    const { ok, status } = response;

    if (!ok) {
      console.error("Token refresh failed during initialization:", status);
      return null;
    }

    const data = await response.json();
    const { data: { accessToken: newAccessToken } = {} } = data;

    if (newAccessToken) {
      // Store the new access token
      storeToken(newAccessToken);
      console.log(TOAST_MESSAGES.INIT_TOKEN_REFRESH_SUCCESS);
      return newAccessToken;
    }

    return null;
  } catch (error) {
    console.error("Error refreshing token during initialization:", error);
    return null;
  }
};

/**
 * Creates a cached promise for initial auth state resolution
 * This promise resolves once with the user's authentication status
 * Includes automatic token refresh if access token is expired
 */
export const createInitialAuthPromise = () => {
  //If Promise already exists → reuse it , Prevents multiple auth checks
  if (!authPromise) {
    authPromise = new Promise(async (resolve) => {
      try {
        // Perform localStorage check
        let token = getToken();

        if (token) {
          let decodedUser = decodeAndValidateToken(token);

          const { userId, email, tokenVersion } = decodedUser;

          if (decodedUser) {
            // Access token is valid
            const user = {
              id: userId,
              email,
              tokenVersion,
            };
            resolve({ user });
            return;
          } else {
            // Access token is expired/invalid, try to refresh
            console.log(
              "Access token expired during initialization, attempting refresh..."
            );

            const newAccessToken = await refreshTokenDuringInit();

            if (newAccessToken) {
              // Successfully refreshed, decode the new token
              decodedUser = decodeAndValidateToken(newAccessToken);
              const { userId, email, tokenVersion } = decodedUser;
              if (decodedUser) {
                const user = {
                  id: userId,
                  email,
                  tokenVersion,
                };
                console.log("User authenticated with refreshed token");
                resolve({ user });
                return;
              }
            }

            // Refresh failed or new token is invalid
            console.log("Token refresh failed, user will be logged out");
            removeTokens(); // Clean up invalid tokens
            resolve({ user: null });
          }
        } else {
          // No access token found
          resolve({ user: null });
        }
      } catch (error) {
        console.error("Error during auth initialization:", error);
        // On any error, clear tokens and resolve with no user
        removeTokens();
        resolve({ user: null });
      }
    });
  }

  return authPromise;
};

/**
 * Invalidates the auth promise cache
 * Call this when user logs out to reset the promise for next login
 */
export const invalidateAuthPromise = () => {
  authPromise = null;
};

/**
 * Updates the auth promise cache with new user data
 * Call this when user logs in to update the cached promise
 */
export const updateAuthPromise = (user) => {
  authPromise = Promise.resolve({ user });
};
