import axiosInstance from '../api/axiosInstance';
import { ENDPOINTS } from './endpoints';

export const catalogService = {
  getCategories: async () => {
    const response = await axiosInstance.get(ENDPOINTS.CATALOG.CATEGORIES);
    return response.data?.results || response.data || [];
  },
  getCollections: async () => {
    const response = await axiosInstance.get(ENDPOINTS.CATALOG.COLLECTIONS);
    return response.data?.results || response.data || [];
  },
  getColors: async () => {
    const response = await axiosInstance.get(ENDPOINTS.CATALOG.COLORS);
    return response.data?.results || response.data || [];
  },
  getSizes: async () => {
    const response = await axiosInstance.get(ENDPOINTS.CATALOG.SIZES);
    return response.data?.results || response.data || [];
  }
};
