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
  return Promise.resolve({ success: true });
};
