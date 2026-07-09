import axiosInstance from '../api/axiosInstance';
import { ENDPOINTS } from './endpoints';

export const reviewsService = {
  getReviews: async (params) => {
    // params can contain e.g. { product: productId }
    const response = await axiosInstance.get(ENDPOINTS.REVIEWS.LIST_CREATE, { params });
    return response.data;
  },
  createReview: async (reviewData) => {
    const response = await axiosInstance.post(ENDPOINTS.REVIEWS.LIST_CREATE, reviewData);
    return response.data;
  },
  getMyReviews: async () => {
    const response = await axiosInstance.get(ENDPOINTS.REVIEWS.MY_REVIEWS);
    return response.data;
  }
};
