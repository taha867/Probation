import { jwtDecode } from "jwt-decode";
import { STORAGE_KEYS, TOAST_MESSAGES } from "./constants";

//Store access token in localStorage
export const storeToken = (token) => {
  localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
};

//Store refresh token in localStorage
export const storeRefreshToken = (refreshToken) => {
  localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
};

//Store both tokens in localStorage
export const storeTokens = (accessToken, refreshToken) => {
  storeToken(accessToken);
  storeRefreshToken(refreshToken);
};

//Get access token from localStorage
export const getToken = () => {
  return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
};

//Get refresh token from localStorage
export const getRefreshToken = () => {
  return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
};

//Remove access token from localStorage
export const removeToken = () => {
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
};

//Remove refresh token from localStorage
export const removeRefreshToken = () => {
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
};

//Remove both tokens from localStorage
export const removeTokens = () => {
  removeToken();
  removeRefreshToken();
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
    console.error(TOAST_MESSAGES.TOKEN_DECODE_ERROR, error);
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

//Check if refresh token exists and is valid
export const hasValidRefreshToken = () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const decoded = jwtDecode(refreshToken);
    // Check if refresh token is expired
    return decoded.exp * 1000 > Date.now();
  } catch (error) {
    console.error(TOAST_MESSAGES.REFRESH_TOKEN_DECODE_ERROR, error);
    removeRefreshToken(); // Clean up invalid refresh token
    return false;
  }
};

//Get user ID from token (commonly needed)
export const getCurrentUserId = () => {
  const user = getCurrentUser();
  return user?.userId || null;
};
