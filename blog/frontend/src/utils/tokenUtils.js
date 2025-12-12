import { jwtDecode } from "jwt-decode";
import { STORAGE_KEYS } from "./constants";

//Store token in localStorage
export const storeToken = (token) => {
  localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
};

//Get token from localStorage
export const getToken = () => {
  return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
};

//Remove token from localStorage
export const removeToken = () => {
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
};

// Decode JWT token and validate expiration
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

//Check if user is authenticated
export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;

  const decodedUser = decodeAndValidateToken(token);
  return !!decodedUser;
};

//Get current user from token
export const getCurrentUser = () => {
  const token = getToken();
  if (!token) return null;

  return decodeAndValidateToken(token);
};
