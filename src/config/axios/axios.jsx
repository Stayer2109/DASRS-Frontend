/** @format */
import axios from "axios";
import Cookies from "js-cookie";

const baseURL = import.meta.env.VITE_BE_BASE_URL;

// Create base axios instance with common configuration
const createAxiosInstance = (config = {}) => {
  const instance = axios.create({
    baseURL: baseURL,
    timeout: 10000,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
    ...config,
  });

  // Add request interceptor
  instance.interceptors.request.use(
    async (config) => {
      const accessToken = Cookies.get("accessToken");
      if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add response interceptor
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // If error is 403 and we haven't retried yet
      if (error?.response?.status === 403 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = Cookies.get("refreshToken");
          
          // Call refresh token endpoint using a fresh axios instance to avoid infinite loop
          const response = await axios.post(
            `${baseURL}auth/refresh-token`,
            {},
            {
              headers: { 
                Authorization: `Bearer ${refreshToken}`,
                "Content-Type": "application/json"
              },
              withCredentials: true,
            }
          );

          const newAccessToken = response.data.data.access_token;
          const newRefreshToken = response.data.data.refresh_token;

          // Update cookies with new tokens
          Cookies.set("accessToken", newAccessToken);
          Cookies.set("refreshToken", newRefreshToken);

          // Update auth header and retry original request
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return instance(originalRequest);
        } catch (refreshError) {
          // If refresh fails, clear tokens and reject
          Cookies.remove("accessToken");
          Cookies.remove("refreshToken");
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

// Create instances with specific configurations
export const apiClient = createAxiosInstance();

export const apiAuth = createAxiosInstance({
  // Add any auth-specific configs here if needed
  headers: {
    "Content-Type": "application/json",
  }
});

export default apiClient;
