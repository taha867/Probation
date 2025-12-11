/**
 * Authentication service for API calls
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Generic API Request Function
 * @param {string} endpoint - API endpoint (e.g. "/auth/login")
 * @param {object} body - Request body
 * @param {string} method - HTTP method (default: POST)
 * @param {boolean} auth - Whether to send auth token
 */
export const apiRequest = async (
  endpoint,
  body = {},
  method = "POST",
  auth = false
) => {
  const token = localStorage.getItem("auth_token");

  const headers = {
    "Content-Type": "application/json",
  };

  if (auth && token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: method !== "GET" ? JSON.stringify(body) : null,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Request failed");
  }

  return response.json();
};

/**
 * Login user
 */
export const loginUser = async ({ email, password }) => {
  return apiRequest("/auth/login", { email, password });
};

/**
 * Register new user
 */
export const registerUser = async ({ name, email, phone, password }) => {
  return apiRequest("/auth/register", {
    name,
    email,
    phone,
    password,
  });
};

/**
 * Logout user
 * (Client-side only unless backend endpoint exists)
 */
export const logoutUser = async () => {
  return Promise.resolve({ success: true });
};
