import axios from "axios";
import toast from "react-hot-toast";

// Base Axios instance
const api = axios.create({
  baseURL: "http://localhost:5000/api", // Replace with your API base URL
  timeout: 50000, // Optional: timeout for requests
  withCredentials: true, // Important: enables sending cookies with requests
});

// Add a response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle token expiration or unauthorized errors
    if (error.response?.status === 401) {
      // toast.error("Unauthorized! Redirecting to login in 3 seconds...");x
      // Perform logout or redirect to login logic here
      // setTimeout(() => {
      //   window.location.href="/"
      // }, 3000)
    }
    return Promise.reject(error);
  }
);

// Reusable API functions
const JwtApi = {
  get: async (url, params = {}) => {
    try {
      const response = await api.get(url, { params });
      return response.data;
    } catch (err) {
      console.error("GET Error:", err.message);
      throw err;
    }
  },

  post: async (url, data = {}, config = {}) => {
    try {
      const response = await api.post(url, data, config);
      return response.data;
    } catch (err) {
      console.error("POST Error:", err.message);
      throw err;
    }
  },

  put: async (url, data = {}, config = {}) => {
    try {
      const response = await api.put(url, data, config);
      return response.data;
    } catch (err) {
      console.error("PUT Error:", err.message);
      throw err;
    }
  },

  patch: async (url, data = {}, config = {}) => {
    try {
      const response = await api.patch(url, data, config);
      return response.data;
    } catch (err) {
      console.error("PATCH Error:", err.message);
      throw err;
    }
  },

  delete: async (url, params = {}, config = {}) => {
    try {
      const response = await api.delete(url, { params }, config);
      return response.data;
    } catch (err) {
      console.error("DELETE Error:", err.message);
      throw err;
    }
  },
};

export default JwtApi;
