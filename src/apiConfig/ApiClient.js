import axios from "axios";

export const apiClient = axios.create({
  baseURL: 'http://localhost:8081',
});

// apiClient.interceptors.request.use(
//   (config) => {
//     if(config.url === "/authenticate"){
//       return config;
//     }
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   }
// );