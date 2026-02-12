import axios from 'axios';
import { neonAuth } from '@/lib/neonAuth';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth
apiClient.interceptors.request.use(
  async (config) => {
    // Get token from Neon Auth
    const token = neonAuth.getAccessToken();
    
    if (token) {
      // Check if token is expired and refresh if needed
      if (neonAuth.isTokenExpired()) {
        const refreshed = await neonAuth.refreshToken();
        if (refreshed) {
          config.headers.Authorization = `Bearer ${refreshed.access_token}`;
        }
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const refreshed = await neonAuth.refreshToken();
        
        if (refreshed) {
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${refreshed.access_token}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
