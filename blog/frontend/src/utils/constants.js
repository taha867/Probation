/**
 * Application Constants
 * Centralized location for all constants used throughout the application
 */
import { StatusCodes } from "http-status-codes";

export const HTTP_STATUS = StatusCodes;

export const AUTH_ACTIONS = {
  LOGIN_START: "LOGIN_START",
  SIGNUP_START: "SIGNUP_START",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  SIGNUP_SUCCESS: "SIGNUP_SUCCESS",
  AUTH_ERROR: "AUTH_ERROR",
  LOGOUT: "LOGOUT",
  SET_USER_FROM_TOKEN: "SET_USER_FROM_TOKEN",
  CLEAR_MESSAGES: "CLEAR_MESSAGES",
};

export const AUTH_STATUS = {
  IDLE: "idle",
  BUSY: "busy",
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
};


export const VALIDATION_MESSAGES = {
  // Required field messages
  REQUIRED_FIELD: "This field is required",
  EMAIL_REQUIRED: "Email is required",
  PASSWORD_REQUIRED: "Password is required",
  NAME_REQUIRED: "Full name is required",
  PHONE_REQUIRED: "Phone number is required",
  CONFIRM_PASSWORD_REQUIRED: "Please confirm your password",

  // Format validation messages
  INVALID_EMAIL: "Please enter a valid email address",
  INVALID_PHONE: "Please enter a valid phone number",

  // Length validation messages
  NAME_TOO_SHORT: "Name must be at least 2 characters",
  NAME_TOO_LONG: "Name must not exceed 50 characters",
  PASSWORD_TOO_SHORT: "Password must be at least 6 characters",
  PASSWORD_TOO_LONG: "Password must not exceed 128 characters",

  // Password strength messages
  PASSWORD_WEAK:
    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
  PASSWORDS_DONT_MATCH: "Passwords do not match",

  // Phone validation messages
  PHONE_TOO_SHORT: "Phone number must be at least 10 digits",
  PHONE_TOO_LONG: "Phone number must not exceed 15 digits",

  // Email validation messages
  EMAIL_TOO_LONG: "Email must not exceed 254 characters",
};
