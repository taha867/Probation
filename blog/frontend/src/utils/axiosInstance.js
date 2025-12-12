/**
 * Axios instance with interceptors for API requests
 * Handles authentication, error responses, and request/response transformation
 */
import axios from "axios";
import { STORAGE_KEYS, HTTP_STATUS } from "./constants";

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000, // 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

//runs before every request is sent
// Request interceptor - automatically add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
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
// Response interceptor - handle errors globally
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
      if (status === HTTP_STATUS.UNAUTHORIZED) {
        // Token expired or invalid credentials
        console.warn("Unauthorized access - token may be expired");
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
