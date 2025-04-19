/** @format */

import axios from "axios";
const baseURL = import.meta.env.VITE_BE_BASE_URL;

const apiAuth = axios.create({
  baseURL: baseURL,
  timeout: 10000,
});

const apiClient = axios.create({
  baseURL: baseURL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
  timeout: 10000,
});

export { apiAuth, apiClient };
