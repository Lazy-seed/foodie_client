/**
 * JWT API Client
 * 
 * This module provides an axios-based API client that automatically
 * includes authentication tokens in requests.
 * 
 * Features:
 * - Automatically adds JWT token to Authorization header
 * - Sends cookies with requests (withCredentials)
 * - Handles 401 errors (token expiration)
 * - Provides convenient methods for all HTTP verbs
 */

import axios from "axios";
import store from '../app/store';

const baseURL = `${process.env.REACT_APP_API_URL}/api`;

// Base Axios instance
const api = axios.create({
  baseURL,
  timeout: 50000,
  withCredentials: true, // Enables sending cookies with requests
});

// Request interceptor to add auth token to headers
api.interceptors.request.use(
  (config) => {
    // Get the current auth token from Redux store
    const state = store.getState();
    const token = state.auth?.token;

    // Add Authorization header if token exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle token expiration or unauthorized errors
    if (error.response?.status === 401) {
      console.error("Unauthorized request - token may be expired");
      // You can dispatch a logout action here if needed
      // store.dispatch(logOut());
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Reusable API functions
const JwtApi = {
  /**
   * GET request
   * @param {string} url - API endpoint
   * @param {object} params - Query parameters
   */
  get: async (url, params = {}) => {
    try {
      const response = await api.get(url, { params });
      return response.data;
    } catch (err) {
      console.error("GET Error:", err.message);
      throw err;
    }
  },

  /**
   * POST request
   * @param {string} url - API endpoint
   * @param {object} data - Request body
   * @param {object} config - Additional axios config
   */
  post: async (url, data = {}, config = {}) => {
    try {
      const response = await api.post(url, data, config);
      return response.data;
    } catch (err) {
      console.error("POST Error:", err.message);
      throw err;
    }
  },

  /**
   * PUT request
   * @param {string} url - API endpoint
   * @param {object} data - Request body
   * @param {object} config - Additional axios config
   */
  put: async (url, data = {}, config = {}) => {
    try {
      const response = await api.put(url, data, config);
      return response.data;
    } catch (err) {
      console.error("PUT Error:", err.message);
      throw err;
    }
  },

  /**
   * PATCH request
   * @param {string} url - API endpoint
   * @param {object} data - Request body
   * @param {object} config - Additional axios config
   */
  patch: async (url, data = {}, config = {}) => {
    try {
      const response = await api.patch(url, data, config);
      return response.data;
    } catch (err) {
      console.error("PATCH Error:", err.message);
      throw err;
    }
  },

  /**
   * DELETE request
   * @param {string} url - API endpoint
   * @param {object} params - Query parameters
   * @param {object} config - Additional axios config
   */
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
