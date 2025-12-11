import { jwtDecode } from "jwt-decode";

export const TOKEN_KEY = "auth_token";

/**
 * Store token in localStorage
 * @param {string} token - JWT token to store
 */
export const storeToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Get token from localStorage
 * @returns {string|null} - JWT token or null if not found
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Remove token from localStorage
 */
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * Decode JWT token and validate expiration
 * @param {string} token - JWT token to decode
 * @returns {object|null} - Decoded user data or null if invalid/expired
 */
export const decodeAndValidateToken = (token) => {
  try {
    const decodedUser = jwtDecode(token);
    
    // Check if token is expired
    if (decodedUser.exp * 1000 < Date.now()) {
      removeToken(); // Clean up expired token
      return null;
    }
    
    return decodedUser;
  } catch (error) {
    console.error("Token decode error:", error);
    removeToken(); // Clean up invalid token
    return null;
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean} - True if user has valid token
 */
export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;
  
  const decodedUser = decodeAndValidateToken(token);
  return !!decodedUser;
};

/**
 * Get current user from token
 * @returns {object|null} - Current user data or null
 */
export const getCurrentUser = () => {
  const token = getToken();
  if (!token) return null;
  
  return decodeAndValidateToken(token);
};