import axiosInstance from '../api/axiosInstance';
import { ENDPOINTS } from './endpoints';

export const cartService = {
  getCart: async () => {
    const response = await axiosInstance.get(ENDPOINTS.ORDERS.CART);
    return response.data;
  },
  addItem: async (productId, quantity = 1, variantId = null) => {
    const response = await axiosInstance.post(ENDPOINTS.ORDERS.CART, {
      variant_id: variantId,
      quantity: quantity
    });
    return response.data;
  },
  updateItemQuantity: async (itemId, quantity) => {
    const response = await axiosInstance.patch(ENDPOINTS.ORDERS.CART_ITEM_QUANTITY(itemId), {
      quantity
    });
    return response.data;
  },
  removeItem: async (itemId) => {
    const response = await axiosInstance.delete(ENDPOINTS.ORDERS.CART_ITEM_REMOVE(itemId));
    return response.data;
  }
};
