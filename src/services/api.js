import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

// Flag to prevent multiple redirects on 401 errors
let isRedirecting = false;

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("No token found. Proceeding without authentication.");
    }

    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);

    if (!error.response) {
      console.error("Network error: Check if the server is running.");
      return Promise.reject("Network error. Please check your connection.");
    }

    const { status, data } = error.response;
    const errorMessage = data?.message || "An error occurred. Please try again.";

    if (status === 401) {
      console.warn("Unauthorized! Redirecting to login...");

      // Prevent multiple redirects
      if (!isRedirecting) {
        isRedirecting = true;
        localStorage.removeItem("token");

        setTimeout(() => {
          window.location.href = "/login";
          isRedirecting = false;
        }, 1000);
      }
    }

    if (status === 403) {
      console.warn("Access denied. You don't have permission.");
    }

    if (status >= 500) {
      console.error("Server error. Please try again later.");
    }

    return Promise.reject(errorMessage);
  }
);

export default api;
