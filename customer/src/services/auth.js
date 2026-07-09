import axiosInstance from '../api/axiosInstance';
import { ENDPOINTS } from './endpoints';

export const authService = {
  register: async (userData) => {
    const response = await axiosInstance.post(ENDPOINTS.AUTH.REGISTER, userData);
    return response.data;
  },
  login: async (credentials) => {
    const response = await axiosInstance.post(ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data;
  },
  getProfile: async () => {
    const response = await axiosInstance.get(ENDPOINTS.AUTH.PROFILE);
    return response.data;
  }
};
