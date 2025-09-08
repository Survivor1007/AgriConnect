import axios from 'axios';
import type { AuthContextType } from '../context/authContext';

// Create a custom Axios instance with a base URL
const API = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// A variable to store the authentication context to be used in the interceptors
let authStore: AuthContextType | null = null;

// Function to initialize the Axios interceptors with the authentication store
// This is necessary because hooks like `useAuth` cannot be called outside of a component
export const setupInterceptors = (store: AuthContextType) => {
  authStore = store;

  // Add a request interceptor to attach the access token to every request
  API.interceptors.request.use(
    (config) => {
      const token = authStore?.accessToken;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add a response interceptor to handle token expiration and refreshing
  API.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      // Check if the error is a 401 Unauthorized and it hasn't been retried yet
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const newAccessToken = await authStore?.refresh();
          if (newAccessToken) {
            // Update the header with the new token and retry the original request
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return API(originalRequest);
          }
        } catch (refreshError) {
          // If the refresh fails, log the user out
          authStore?.logout();
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );
};

// Export the configured Axios instance
export default API;