
import {
  getToken,
  decodeAndValidateToken,
  getRefreshToken,
  hasValidRefreshToken,
  storeToken,
  removeTokens,
} from "./tokenUtils";
import { TOAST_MESSAGES } from "./constants";
import { fetchCurrentUserProfile } from "../services/userService";

// Cache for the auth promise to prevent infinite suspense
let authPromise = null;


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
  //If Promise already exists reuse it , Prevents multiple auth checks
  if (!authPromise) {
    authPromise = new Promise(async (resolve) => {
      try {
        
        let token = getToken();

        if (token) {
          let decodedUser = decodeAndValidateToken(token);

          if (decodedUser) {
            // Access token is valid, fetch full user profile from backend
            try {
              const response = await fetchCurrentUserProfile();
              const { data: { user: fullUser } = {} } = response;

              if (fullUser) {
                // Merge token data with full user profile
                const user = {
                  ...fullUser,
                  tokenVersion: decodedUser.tokenVersion,
                };
                resolve({ user });
                return;
              } else {
                console.warn("User not found in database");
                removeTokens();
                resolve({ user: null });
                return;
              }
            } catch (error) {
              
              console.warn(
                "Failed to fetch user profile, using token data:",
                error
              );
              const { userId, email, tokenVersion } = decodedUser;
              const user = {
                id: userId,
                email,
                tokenVersion,
              };
              resolve({ user });
              return;
            }
          } else {
            // Access token is expired/invalid, try to refresh
            console.log(
              "Access token expired during initialization, attempting refresh..."
            );

            const newAccessToken = await refreshTokenDuringInit();

            if (newAccessToken) {
              // Successfully refreshed, decode the new token
              decodedUser = decodeAndValidateToken(newAccessToken);

              if (decodedUser) {
                // Fetch full user profile from backend with refreshed token
                try {
                  const response = await fetchCurrentUserProfile();
                  const { data: { user: fullUser } = {} } = response;

                  if (fullUser) {
                    // Merge token data with full user profile
                    const user = {
                      ...fullUser,
                      tokenVersion: decodedUser.tokenVersion,
                    };
                    console.log("User authenticated with refreshed token");
                    resolve({ user });
                    return;
                  } else {
                    // User not found in database, clear tokens
                    console.warn(
                      "User not found in database after token refresh"
                    );
                    removeTokens();
                    resolve({ user: null });
                    return;
                  }
                } catch (error) {
                  // If API call fails, fall back to minimal user object from token
                  console.warn(
                    "Failed to fetch user profile after refresh, using token data:",
                    error
                  );
                  const { userId, email, tokenVersion } = decodedUser;
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
            }

            // Refresh failed or new token is invalid
            console.log("Token refresh failed, user will be logged out");
            removeTokens(); // Clean up invalid tokens
            resolve({ user: null });
          }
        } else {
          
          resolve({ user: null });
        }
      } catch (error) {
        console.error("Error during auth initialization:", error);
        removeTokens();
        resolve({ user: null });
      }
    });
  }

  return authPromise;
};
