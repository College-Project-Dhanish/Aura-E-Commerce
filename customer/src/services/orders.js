import axiosInstance from '../api/axiosInstance';
import { ENDPOINTS } from './endpoints';

export const ordersService = {
  checkout: async (checkoutData) => {
    const response = await axiosInstance.post(ENDPOINTS.ORDERS.CHECKOUT, checkoutData);
    return response.data;
  },
  getMyOrders: async () => {
    const response = await axiosInstance.get(ENDPOINTS.ORDERS.MY_ORDERS);
    return response.data;
  },
  getOrderDetails: async (orderNumber) => {
    const response = await axiosInstance.get(ENDPOINTS.ORDERS.MY_ORDER_DETAIL(orderNumber));
    return response.data;
  }
};
