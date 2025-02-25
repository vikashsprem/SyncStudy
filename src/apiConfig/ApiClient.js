import axios from "axios";

export const apiClient = axios.create({
  baseURL: 'http://localhost:8081',
});

apiClient.interceptors.request.use(
  (config) => {
    config.headers.Authorization = localStorage.getItem("token");
    return config;
  }
);