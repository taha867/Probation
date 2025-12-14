/**
 * Axios instance with interceptors for API requests
 * Handles authentication, error responses, and automatic token refresh
 */
import axios from "axios";
import { STORAGE_KEYS, HTTP_STATUS } from "./constants";
import {
  getToken,
  getRefreshToken,
  storeToken,
  removeTokens,
  hasValidRefreshToken,
} from "./tokenUtils";

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000, // 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

// Track if we're currently refreshing token to avoid multiple refresh calls
let isRefreshing = false;
// Queue to store failed requests while token is being refreshed
let failedQueue = [];

// Helper function to process queued requests
const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

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
// Response interceptor - handle errors globally and automatic token refresh
apiClient.interceptors.response.use(
  (response) => {
    // Return successful responses as-is
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

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
      if (status === HTTP_STATUS.UNAUTHORIZED && !originalRequest._retry) {
        // Token expired - attempt to refresh
        console.warn("Access token expired, attempting to refresh...");

        // Mark this request as retried to avoid infinite loops
        originalRequest._retry = true;

        // Check if we have a valid refresh token
        if (!hasValidRefreshToken()) {
          console.warn("No valid refresh token available, logging out...");
          removeTokens();
          // Redirect to login or trigger logout in your app
          window.location.href = "/auth";
          return Promise.reject(
            new Error("Session expired. Please login again."),
          );
        }

        // If we're already refreshing, queue this request
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return apiClient(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        // Start the refresh process
        isRefreshing = true;

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

          // Update the authorization header for the original request
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;

          // Process all queued requests with the new token
          processQueue(null, accessToken);

          // Retry the original request
          return apiClient(originalRequest);
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);

          // Process queue with error
          processQueue(refreshError, null);

          // Clear tokens and redirect to login
          removeTokens();
          window.location.href = "/auth";

          return Promise.reject(
            new Error("Session expired. Please login again."),
          );
        } finally {
          isRefreshing = false;
        }
      } else if (status === HTTP_STATUS.FORBIDDEN) {
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

export default apiClient;
