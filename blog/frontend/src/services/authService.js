// Authentication service using Axios instance

import apiClient from "../utils/axiosInstance";

export const loginUser = async ({ email, password }) => {
  const response = await apiClient.post("/auth/login", { email, password });
  return response.data;
};

export const registerUser = async ({ name, email, phone, password }) => {
  const response = await apiClient.post("/auth/register", {
    name,
    email,
    phone,
    password,
  });
  return response.data;
};

export const logoutUser = async () => {
  const response = await apiClient.post("/auth/logout");
  return response.data;
};

export const forgotPassword = async ({ email }) => {
  const response = await apiClient.post("/auth/forgotPassword", { email });
  return response.data;
};

export const resetPassword = async ({
  token,
  newPassword,
  confirmPassword,
}) => {
  const response = await apiClient.post("/auth/resetPassword", {
    token,
    newPassword,
    confirmPassword,
  });
  return response.data;
};

export const refreshAccessToken = async (refreshToken) => {
  const response = await apiClient.post("/auth/refreshToken", {
    refreshToken,
  });
  return response.data;
};
