import axios from "axios";
import { getToken } from "../utils/auth.js";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const getApiErrorMessage = (error) => {
  const backendMessage = error?.response?.data?.message;

  if (typeof backendMessage === "string" && backendMessage.trim()) {
    return backendMessage;
  }

  if (!error?.response) {
    return "Unable to connect to server. Please try again.";
  }

  return "Something went wrong. Please try again.";
};

export { getApiErrorMessage };
export default api;