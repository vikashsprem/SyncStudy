import axios from "axios";

export const apiClient = axios.create({
  baseURL: 'https://app.vikashxsharma.com',
});

apiClient.interceptors.request.use(
  (config) => {
    if(config.url === "/authenticate"){
      return config;
    }
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add userId to headers or query params if available
    if (userId) {
      // Add as header
      config.headers["X-User-ID"] = userId;
      
      // If it's a GET request to notifications endpoints, add as query param too
      if (config.method === 'get' && 
          (config.url.includes('/notifications') || config.url.includes('/notification'))) {
        // Add userId as query parameter if not already present
        if (!config.params) {
          config.params = {};
        }
        if (!config.params.userId) {
          config.params.userId = userId;
        }
      }
    }
    
    return config;
  }
);

// Add response interceptor for debugging
apiClient.interceptors.response.use(
  (response) => {
    // Log successful responses from notification endpoints
    if (response.config.url.includes('/notifications')) {
      console.log('Notification API response:', {
        url: response.config.url,
        method: response.config.method,
        status: response.status,
        data: response.data
      });
    }
    return response;
  },
  (error) => {
    // Log failed responses
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
      response: error.response?.data
    });
    return Promise.reject(error);
  }
);