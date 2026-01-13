// Authentication service using fetchClient

import { fetchClient } from "../middleware/fetchClient";

export const loginUser = async ({ email, password }) => {
  const response = await fetchClient("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  return response;
};

export const registerUser = async ({ name, email, phone, password }) => {
  const response = await fetchClient("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      name,
      email,
      phone,
      password,
    }),
  });
  return response;
};

export const logoutUser = async () => {
  const response = await fetchClient("/auth/logout", {
    method: "POST",
  });
  return response;
};

export const forgotPassword = async ({ email }) => {
  const response = await fetchClient("/auth/forgotPassword", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
  return response;
};

export const resetPassword = async ({ token, newPassword, confirmPassword }) => {
  const response = await fetchClient("/auth/resetPassword", {
    method: "POST",
    body: JSON.stringify({
      token,
      newPassword,
      confirmPassword,
    }),
  });
  return response;
};

export const refreshAccessToken = async ({ refreshToken }) => {
  const response = await fetchClient("/auth/refreshToken", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });
  return response;
};
