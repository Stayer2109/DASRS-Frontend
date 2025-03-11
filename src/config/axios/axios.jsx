import axios from "axios";
const baseURL = import.meta.env.VITE_BE_BASE_URL;

const apiClient = axios.create({
  baseURL: baseURL,
});

export default apiClient;
