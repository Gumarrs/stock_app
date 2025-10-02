import axios from "axios";
import Router from "next/router";

const api = axios.create({
  baseURL: "http://localhost:3001",
});

// Attach token
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        Router.push("/");
      }
    }
    return Promise.reject(error);
  }
);

export default api;
