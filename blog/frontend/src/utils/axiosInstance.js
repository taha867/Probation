/**
 * Axios instance with interceptors for API requests
 * Handles authentication, error responses, and automatic token refresh using axios-auth-refresh
 * Global success/error message handling via toast notifications
 */
import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import toast from "react-hot-toast";
import { HTTP_STATUS, TOAST_MESSAGES } from "./constants";
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

/**
 * Function to refresh the access token
 * Called automatically by axios-auth-refresh when a 401 is received
 */
const refreshAuthLogic = async (failedRequest) => {
  const url = failedRequest?.response?.config?.url || "";

  // Do NOT try to refresh for auth endpoints like login/register/forgot/reset
  if (
    url.includes("/auth/login") ||
    url.includes("/auth/register") ||
    url.includes("/auth/forgotPassword") ||
    url.includes("/auth/resetPassword")
  ) {
    return Promise.reject(failedRequest.error || failedRequest);
  }

  console.warn(TOAST_MESSAGES.ACCESS_TOKEN_EXPIRED);

  // Check if we have a valid refresh token
  if (!hasValidRefreshToken()) {
    console.warn(TOAST_MESSAGES.NO_REFRESH_TOKEN);
    removeTokens();
    window.location.href = "/auth";
    return Promise.reject(new Error(TOAST_MESSAGES.SESSION_EXPIRED));
  }

  try {
    const refreshToken = getRefreshToken();
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/auth/refreshToken`,
      { refreshToken },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    const { accessToken } = response.data.data;

    // Store new access token
    storeToken(accessToken);

    // Update the authorization header for the failed request
    failedRequest.response.config.headers.Authorization = `Bearer ${accessToken}`;

    console.log(TOAST_MESSAGES.TOKEN_REFRESHED);
    return Promise.resolve();
  } catch (refreshError) {
    console.error(TOAST_MESSAGES.TOKEN_REFRESH_FAILED, refreshError);

    // Clear tokens and redirect to login
    removeTokens();
    window.location.href = "/auth";

    return Promise.reject(new Error(TOAST_MESSAGES.SESSION_EXPIRED));
  }
};

// This function is used by axios-auth-refresh to automatically refresh the token whenever a request gets a 401 Unauthorized.
// Initialize axios-auth-refresh interceptor
createAuthRefreshInterceptor(apiClient, refreshAuthLogic, {
  statusCodes: [401], // Refresh on 401 Unauthorized
  pauseInstanceWhileRefreshing: true, // Pause requests while refreshing
});

//runs before every request is sent
// Request interceptor - automatically add auth token to requests and handle FormData
apiClient.interceptors.request.use(
  (config) => {
    // If FormData is being sent, let axios set Content-Type automatically with boundary
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }
    
    // Add auth token to all requests
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//runs after every request is sent
// Response interceptor - handle success/error messages globally
apiClient.interceptors.response.use(
  (response) => {
    // Handle success messages globally via toast
    const {
      data: {
        data: { message: nestedMessage } = {},
        message: topLevelMessage,
      } = {},
    } = response;

    const successMessage = nestedMessage || topLevelMessage;

    if (successMessage) {
      toast.success(successMessage);
    }

    return response;
  },
  (error) => {
    // Handle different error scenarios
    const { response } = error;
    if (response) {
      // Server responded with error status (4xx, 5xx)
      // Extract error message from different possible response structures
      const {
        status,
        data: {
          message: topLevelMessage,
          data: { message: nestedMessage } = {},
          error: errorField,
        } = {},
      } = response;

      // Pick the first available message
      const errorMessage =
        nestedMessage ||
        topLevelMessage ||
        errorField ||
        `Request failed with status ${status}`;

      // Show error message globally via toast
      toast.error(errorMessage);

      // Handle specific status codes using HTTP_STATUS constants
      // Note: 401 is handled automatically by axios-auth-refresh
      if (status === HTTP_STATUS.FORBIDDEN) {
        // Insufficient permissions
        console.warn("Access forbidden");
      } else if (status === HTTP_STATUS.NOT_FOUND) {
        // Resource not found
        console.warn("Resource not found");
      } else if (status === HTTP_STATUS.UNPROCESSABLE_ENTITY) {
        // Validation errors
        console.warn(TOAST_MESSAGES.VALIDATION_ERROR);
      } else if (status === HTTP_STATUS.INTERNAL_SERVER_ERROR) {
        // Server error
        console.error(TOAST_MESSAGES.INTERNAL_SERVER_ERROR);
      }

      // Create a more descriptive error
      const enhancedError = new Error(errorMessage);
      enhancedError.status = status;
      enhancedError.response = error.response;

      return Promise.reject(enhancedError);
    } else if (error.request) {
      // Network error - no response received
      toast.error(TOAST_MESSAGES.NETWORK_ERROR);
      return Promise.reject(new Error(TOAST_MESSAGES.NETWORK_ERROR));
    } else {
      // Request setup error
      toast.error(TOAST_MESSAGES.REQUEST_CONFIG_ERROR);
      return Promise.reject(new Error(TOAST_MESSAGES.REQUEST_CONFIG_ERROR));
    }
  }
);

export default apiClient;
