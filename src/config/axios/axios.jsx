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
    (config) => {
      const accessToken = Cookies.get("accessToken");
      if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Add response interceptor
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Handle 403 (Forbidden) - Try refresh token
      if (error?.response?.status === 403 && !originalRequest?._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = Cookies.get("refreshToken");

          const response = await axios.post(
            `${baseURL}auth/refresh-token`,
            {},
            {
              headers: {
                Authorization: `Bearer ${refreshToken}`,
                "Content-Type": "application/json",
              },
              withCredentials: true,
            }
          );

          const newAccessToken = response.data.data.access_token;
          const newRefreshToken = response.data.data.refresh_token;

          // Save new tokens
          Cookies.set("accessToken", newAccessToken, { secure: true, sameSite: "Strict" });
          Cookies.set("refreshToken", newRefreshToken, { secure: true, sameSite: "Strict" });

          // Retry original request
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return instance(originalRequest);

        } catch (refreshError) {
          // Refresh token failed → logout and redirect
          Cookies.remove("accessToken");
          Cookies.remove("refreshToken");
          window.location.href = "/";
          return Promise.reject(refreshError);
        }
      }

      // Handle 401 (Unauthorized) - No refresh, just logout and redirect
      if (error?.response?.status === 401) {
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        window.location.href = "/";
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

// Create instances with specific configurations
export const apiClient = createAxiosInstance();

export const apiAuth = createAxiosInstance({
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
