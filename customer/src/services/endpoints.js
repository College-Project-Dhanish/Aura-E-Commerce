export const API_BASE_URL =
  (((import.meta).env?.VITE_API_BASE_URL) || 'http://127.0.0.1:8000/api').replace(/\/$/, '');

export const ENDPOINTS = {
  // ============================
  // AUTHENTICATION & USERS
  // ============================
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login/`,
    REGISTER: `${API_BASE_URL}/auth/register/`,
    LOGOUT: `${API_BASE_URL}/auth/logout/`,
    REFRESH: `${API_BASE_URL}/auth/refresh/`,
    PROFILE: `${API_BASE_URL}/auth/profile/`,
    FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password/`,
    RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password/`,
    CHANGE_PASSWORD: `${API_BASE_URL}/auth/change-password/`,
    ADMIN_CUSTOMERS: `${API_BASE_URL}/auth/admin/customers/`,
  },

  // ============================
  // CATALOG (PRODUCTS, CATEGORIES)
  // ============================
  CATALOG: {
    PRODUCTS: `${API_BASE_URL}/catalog/products/`,
    PRODUCT_DETAIL: (slug) => `${API_BASE_URL}/catalog/products/${slug}/`,
    CATEGORIES: `${API_BASE_URL}/catalog/categories/`,
    COLLECTIONS: `${API_BASE_URL}/catalog/collections/`,
    COLORS: `${API_BASE_URL}/catalog/colors/`,
    SIZES: `${API_BASE_URL}/catalog/sizes/`,

    // Admin Catalog endpoints
    ADMIN_CATEGORIES: `${API_BASE_URL}/catalog/admin/categories/`,
    ADMIN_COLLECTIONS: `${API_BASE_URL}/catalog/admin/collections/`,
    ADMIN_COLORS: `${API_BASE_URL}/catalog/admin/colors/`,
    ADMIN_SIZES: `${API_BASE_URL}/catalog/admin/sizes/`,
    ADMIN_PRODUCTS: `${API_BASE_URL}/catalog/admin/products/`,
    ADMIN_VARIANTS: `${API_BASE_URL}/catalog/admin/variants/`,
    ADMIN_IMAGES: `${API_BASE_URL}/catalog/admin/images/`,
  },

  // ============================
  // ORDERS & CART
  // ============================
  ORDERS: {
    CART: `${API_BASE_URL}/orders/cart/`,
    CART_ITEM_REMOVE: (itemId) => `${API_BASE_URL}/orders/cart/items/${itemId}/remove/`,
    CART_ITEM_QUANTITY: (itemId) => `${API_BASE_URL}/orders/cart/items/${itemId}/quantity/`,
    CHECKOUT: `${API_BASE_URL}/orders/checkout/`,
    MY_ORDERS: `${API_BASE_URL}/orders/me/orders/`,
    MY_ORDER_DETAIL: (orderNumber) => `${API_BASE_URL}/orders/me/orders/${orderNumber}/`,

    // Admin Order endpoints
    ADMIN_ORDERS: `${API_BASE_URL}/orders/admin/`,
    ADMIN_ORDER_DETAIL: (orderNumber) => `${API_BASE_URL}/orders/admin/${orderNumber}/`,
  },

  // ============================
  // PROMOTIONS & COUPONS
  // ============================
  PROMOTIONS: {
    VALIDATE_COUPON: `${API_BASE_URL}/promotions/coupons/validate/`,
    ADMIN_COUPONS: `${API_BASE_URL}/promotions/admin/coupons/`,
  },

  // ============================
  // DASHBOARD & SETTINGS
  // ============================
  DASHBOARD: {
    STATS: `${API_BASE_URL}/dashboard/stats/`,
    LOW_STOCK: `${API_BASE_URL}/dashboard/low-stock/`,
    RECENT_ORDERS: `${API_BASE_URL}/dashboard/recent-orders/`,
    ADMIN_SETTINGS: `${API_BASE_URL}/dashboard/admin/settings/`,
  },

  // ============================
  // REVIEWS
  // ============================
  REVIEWS: {
    LIST_CREATE: `${API_BASE_URL}/reviews/`,
    MY_REVIEWS: `${API_BASE_URL}/reviews/my/`,
  },

  // ============================
  // NEWSLETTER
  // ============================
  NEWSLETTER: {
    SUBSCRIBE: `${API_BASE_URL}/newsletter/subscribe/`,
    UNSUBSCRIBE: `${API_BASE_URL}/newsletter/unsubscribe/`,
    SUBSCRIBERS: `${API_BASE_URL}/newsletter/subscribers/`,
    EXPORT_SUBSCRIBERS: `${API_BASE_URL}/newsletter/subscribers/export/`,
  },
};
