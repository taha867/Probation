/**
 * Axios instance with interceptors for API requests
 * Handles authentication, error responses, and automatic token refresh using axios-auth-refresh
 */
import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import { HTTP_STATUS } from "./constants";
import {
  getToken,
  getRefreshToken,
  storeToken,
  removeTokens,
  hasValidRefreshToken,
} from "./tokenUtils";

// Create axios instance with base configuration
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000, // 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Function to refresh the access token
 * Called automatically by axios-auth-refresh when a 401 is received
 */
const refreshAuthLogic = async (failedRequest) => {
  console.warn("Access token expired, attempting to refresh...");

  // Check if we have a valid refresh token
  if (!hasValidRefreshToken()) {
    console.warn("No valid refresh token available, logging out...");
    removeTokens();
    window.location.href = "/auth";
    return Promise.reject(new Error("Session expired. Please login again."));
  }

  try {
    const refreshToken = getRefreshToken();
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/auth/refreshToken`,
      { refreshToken },
      {
        headers: { "Content-Type": "application/json" },
      },
    );

    const { accessToken } = response.data.data;

    // Store new access token
    storeToken(accessToken);

    // Update the authorization header for the failed request
    failedRequest.response.config.headers.Authorization = `Bearer ${accessToken}`;

    console.log("Token refreshed successfully");
    return Promise.resolve();
  } catch (refreshError) {
    console.error("Token refresh failed:", refreshError);

    // Clear tokens and redirect to login
    removeTokens();
    window.location.href = "/auth";

    return Promise.reject(new Error("Session expired. Please login again."));
  }
};

//runs automatically before response interceptor continues.
// Initialize axios-auth-refresh interceptor
createAuthRefreshInterceptor(apiClient, refreshAuthLogic, {
  statusCodes: [401], // Refresh on 401 Unauthorized
  pauseInstanceWhileRefreshing: true, // Pause requests while refreshing
});

//runs before every request is sent
// Request interceptor - automatically add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

//runs after every request is sent
// Response interceptor - handle errors globally (401 handled by axios-auth-refresh)
apiClient.interceptors.response.use(
  (response) => {
    // Return successful responses as-is
    return response;
  },
  (error) => {
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status (4xx, 5xx)
      const { status, data } = error.response;

      // Extract error message from different possible response structures
      const errorMessage =
        data.message ||
        data.data?.message ||
        data.error ||
        `Request failed with status ${status}`;

      // Handle specific status codes using HTTP_STATUS constants
      // Note: 401 is handled automatically by axios-auth-refresh
      if (status === HTTP_STATUS.FORBIDDEN) {
        // Insufficient permissions
        console.warn("Access forbidden - insufficient permissions");
      } else if (status === HTTP_STATUS.NOT_FOUND) {
        // Resource not found
        console.warn("Resource not found");
      } else if (status === HTTP_STATUS.UNPROCESSABLE_ENTITY) {
        // Validation errors
        console.warn("Validation error");
      } else if (status === HTTP_STATUS.INTERNAL_SERVER_ERROR) {
        // Server error
        console.error("Internal server error");
      }

      // Create a more descriptive error
      const enhancedError = new Error(errorMessage);
      enhancedError.status = status;
      enhancedError.response = error.response;

      return Promise.reject(enhancedError);
    } else if (error.request) {
      // Network error - no response received
      return Promise.reject(
        new Error("Network error. Please check your connection."),
      );
    } else {
      // Request setup error
      return Promise.reject(new Error("Request configuration error"));
    }
  },
);
