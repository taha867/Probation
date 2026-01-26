import {
  getToken,
  getRefreshToken,
  storeToken,
  removeTokens,
  hasValidRefreshToken,
} from "../utils/tokenUtils";
import toast from "react-hot-toast";
import { HTTP_STATUS, TOAST_MESSAGES } from "../utils/constants";

const {
  NO_REFRESH_TOKEN,
  TOKEN_REFRESH_FAILED,
  NETWORK_ERROR,
  ACCESS_TOKEN_EXPIRED,
  SESSION_EXPIRED,
  VALIDATION_ERROR,
} = TOAST_MESSAGES;

const { FORBIDDEN, NOT_FOUND, UNPROCESSABLE_ENTITY, INTERNAL_SERVER_ERROR } =
  HTTP_STATUS;

//Prevents multiple refresh token requests. 5 API requests fail with 401 at the same time
// Without this → 5 refresh calls, With this → only 1 refresh request, others wait
let isRefreshing = false;
let refreshPromise = null;


/**
 * Refreshes the access token using refresh token
 */
const refreshToken = async () => {
  const refreshTokenValue = getRefreshToken();

  if (!refreshTokenValue || !hasValidRefreshToken()) {
    throw new Error(NO_REFRESH_TOKEN);
  }

  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/auth/refreshToken`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken: refreshTokenValue }),
    }
  );

  if (!response.ok) {
    throw new Error(TOKEN_REFRESH_FAILED);
  }

  const data = await response.json();
  const { accessToken } = data.data || {};

  if (accessToken) {
    storeToken(accessToken);
    return accessToken;
  }

  throw new Error(TOKEN_REFRESH_FAILED);
};

/**
 * Extracts error message from error object
 * Convert any backend error shape into one readable message
 */
const extractErrorMessage = async (error) => {
  const { response, message } = error;
  if (response) {
    try {
      const data = await response.clone().json(); // response.json() reads the response body once, if we try again error occurs so we make copy of it 
      const {
        message: rootMessage,
        data: { message: dataMessage } = {},
        error: errorField,
      } = data || {};

      return (
        dataMessage ||
        rootMessage ||
        errorField ||
        `Request failed with status ${error.status}`
      );
    } catch {
      return `Request failed with status ${error.status}`;
    }
  }

  if (message) {
    return message;
  }

  return NETWORK_ERROR;
};

/**
=> Adds headers
=> Adds token
=> Handles 401
=> Retries request after refresh
 */
const makeRequest = async (url, options = {}) => {
  const token = getToken();

  // Prepare headers
  const headers = {};

  // Handle FormData - don't set Content-Type, browser will set it with boundary
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  // Add auth token if available
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Merge with user-provided headers
  const finalHeaders = { ...headers, ...options.headers };

  // Log request in development
  if (import.meta.env.DEV) {
    console.log(`[Request] ${options.method || "GET"} ${url}`);
  }

  const response = await fetch(url, {
    ...options,
    headers: finalHeaders,
  });
  const { status, ok } = response;

  // Handle 401 - token refresh
  if (status === 401 && !url.includes("/auth/")) {
    // Don't try to refresh for auth endpoints
    if (
      url.includes("/auth/login") ||
      url.includes("/auth/register") ||
      url.includes("/auth/forgotPassword") ||
      url.includes("/auth/resetPassword") ||
      url.includes("/auth/refreshToken")
    ) {
      const error = new Error(`Request failed with status ${status}`);
      error.status = status;
      error.response = response;
      throw error;
    }

    console.warn(ACCESS_TOKEN_EXPIRED);

    // If refresh is already in progress, wait for it and retry
    if (isRefreshing && refreshPromise) {
      try {
        await refreshPromise;
        const newToken = getToken();
        if (newToken) {
          // Retry original request with new token
          return makeRequest(url, options);
        }
        throw new Error(TOKEN_REFRESH_FAILED);
      } catch (refreshError) {
        removeTokens();
        throw new Error(SESSION_EXPIRED);
      }
    }

    // Start refresh process
    isRefreshing = true;
    refreshPromise = refreshToken();

    try {
      await refreshPromise;
      // Retry original request with new token
      return makeRequest(url, options);
    } catch (refreshError) {
      removeTokens();
      throw new Error(SESSION_EXPIRED);
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  }

  // Log response in development
  if (import.meta.env.DEV) {
    console.log(`[Response] ${status} ${url}`);
  }

  // Check for errors
  if (!ok) {
    const error = new Error(`Request failed with status ${response.status}`);
    error.status = status;
    error.response = response;

    // Log specific error scenarios
    if (status === FORBIDDEN) {
      console.warn("Access forbidden");
    } else if (status === NOT_FOUND) {
      console.warn("Resource not found");
    } else if (status === UNPROCESSABLE_ENTITY) {
      console.warn(VALIDATION_ERROR);
    } else if (status === INTERNAL_SERVER_ERROR) {
      console.error(TOAST_MESSAGES.INTERNAL_SERVER_ERROR);
    }

    throw error;
  }

  return response;
};

/**
 * Main fetch client function
 * @param {string} url - API endpoint (relative or absolute)
 * @param {RequestInit} options - Fetch API options
 * @param {Record<string, any>} metadata - Additional metadata (e.g., { showToast: false })
 * @returns {Promise<{data: any, status: number, ok: boolean, headers: Headers}>}
 */
export const fetchClient = async (url, options = {}, metadata = {}) => {
  // Add base URL if relative URL
  const fullUrl = url.startsWith("http")
    ? url
    : `${import.meta.env.VITE_API_BASE_URL}${url}`;

  // Add timeout using AbortController
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // cancels request after 10 seconds

  try {
    // Execute request
    const response = await makeRequest(fullUrl, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Parse response
    const responseData = await response.json();
    const { data } = responseData;
    const { status, ok, headers } = response;

    // Show success toast (if message exists and not disabled)
    if (metadata.showToast !== false) {
      const { message: rootMessage, data: { message: dataMessage } = {} } =
        responseData || {};

      const successMessage = dataMessage || rootMessage;

      if (successMessage) {
        toast.success(successMessage);
      }
    }

    return {
      data: data || responseData,
      status,
      ok,
      headers,
      response, // Full response object for advanced use cases
    };
  } catch (error) {
    clearTimeout(timeoutId);

    // Log error in development
    if (import.meta.env.DEV) {
      console.error(`[Error] ${error.message} ${fullUrl}`);
    }

    // Handle timeout error
    if (error.name === "AbortError") {
      const timeoutError = new Error("Request timeout");
      timeoutError.status = 408;

      if (metadata.showToast !== false) {
        toast.error("Request timeout. Please try again.");
      }

      throw timeoutError;
    }

    // Handle network errors
    if (!error.status && error.message.includes("fetch")) {
      const networkError = new Error(
        "Network error. Please check your connection."
      );
      networkError.status = 0;

      if (metadata.showToast !== false) {
        toast.error(NETWORK_ERROR);
      }

      throw networkError;
    }

    // Show error toast (if not disabled)
    if (metadata.showToast !== false) {
      const errorMessage = await extractErrorMessage(error);
      toast.error(errorMessage);
    }

    // Re-throw error for React Query to handle
    throw error;
  }
};
