import axios from 'axios';
import Cookies from 'js-cookie';

export const API_URL =
  (((import.meta).env?.VITE_API_BASE_URL) || 'http://127.0.0.1:8000/api').replace(/\/$/, '');

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isLogin = originalRequest?.url?.includes('/auth/login/');
    const isRefresh = originalRequest?.url?.includes('/auth/refresh/');
    const shouldRetry =
      error.response?.status === 401 && !originalRequest?._retry && !isLogin && !isRefresh;

    if (shouldRetry) {
      originalRequest._retry = true;

      const refreshToken = Cookies.get('refresh_token');
      if (refreshToken) {
        try {
          const res = await axios.post(`${API_URL}/auth/refresh/`, {
            refresh: refreshToken,
          });

          Cookies.set('access_token', res.data.access);
          originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          Cookies.remove('access_token');
          Cookies.remove('refresh_token');
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
