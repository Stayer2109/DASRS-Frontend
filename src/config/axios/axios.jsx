/** @format */

import axios from "axios";
const baseURL = import.meta.env.VITE_BE_BASE_URL;

const apiAuth = axios.create({
  baseURL: baseURL,
  headers: { "Content-Type": "application/json" },
});

const axiosPrivate = axios.create({
  baseURL: baseURL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export { apiAuth, axiosPrivate };
