import axios from 'axios';
import { products } from '../data/products';
import { 
  Product, 
  CartItem, 
  Order, 
  User, 
  Review, 
  CouponValidation, 
  Address 
} from '../types';
import {
  mapCatalogOption,
  mapCartItem,
  mapOrder,
  mapProductDetail,
  mapProductListItem,
  mapReview,
  mapUser,
} from './apiMappers';

/**
 * API Base URL:
 * - Prefer VITE_API_BASE_URL if set
 * - Fallback to same-origin `/api/` to avoid hardcoded localhost issues
 */
const API_BASE_URL = ((import.meta as any).env?.VITE_API_BASE_URL as string) || 'http://127.0.0.1:8000/api/';

// Set up axios instance
export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
axiosClient.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem('access_token') ||
      localStorage.getItem('access') ||
      localStorage.getItem('accessToken');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config;
    const status = error?.response?.status;
    const refreshToken = localStorage.getItem('refresh_token') || localStorage.getItem('refresh');

    if (status === 401 && originalRequest && !originalRequest._retry && refreshToken) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await axios.post(`${API_BASE_URL}auth/refresh/`, { refresh: refreshToken });
        const newAccess = refreshResponse.data?.access;

        if (newAccess) {
          localStorage.setItem('access_token', newAccess);
          localStorage.setItem('access', newAccess);
          originalRequest.headers = {
            ...(originalRequest.headers || {}),
            Authorization: `Bearer ${newAccess}`,
          };
          return axiosClient(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Toggle to use real backend vs local mock persistence
// By default, if the app is running in the sandbox/preview and the backend is not live, 
// we fall back to high-fidelity mock storage so the e-commerce app works flawlessly.
const USE_REAL_BACKEND = true; // Route all traffic to the Django REST API

// Helper to manage high-fidelity mock database in LocalStorage
const mockDB = {
  getProducts: (): Product[] => {
    const stored = localStorage.getItem('aura_products');
    if (!stored) {
      localStorage.setItem('aura_products', JSON.stringify(products));
      return products;
    }
    return JSON.parse(stored);
  },
  saveProducts: (prods: Product[]) => {
    localStorage.setItem('aura_products', JSON.stringify(prods));
  },
  getCart: (): CartItem[] => {
    const stored = localStorage.getItem('aura_cart');
    return stored ? JSON.parse(stored) : [];
  },
  saveCart: (cart: CartItem[]) => {
    localStorage.setItem('aura_cart', JSON.stringify(cart));
    // Trigger custom event for reactivity across components
    window.dispatchEvent(new Event('aura_cart_updated'));
  },
  getWishlist: (): Product[] => {
    const stored = localStorage.getItem('aura_wishlist');
    return stored ? JSON.parse(stored) : [];
  },
  saveWishlist: (wishlist: Product[]) => {
    localStorage.setItem('aura_wishlist', JSON.stringify(wishlist));
    window.dispatchEvent(new Event('aura_wishlist_updated'));
  },
  getOrders: (): Order[] => {
    const stored = localStorage.getItem('aura_orders');
    return stored ? JSON.parse(stored) : [];
  },
  saveOrders: (orders: Order[]) => {
    localStorage.setItem('aura_orders', JSON.stringify(orders));
  },
  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem('aura_user');
    return stored ? JSON.parse(stored) : null;
  },
  saveCurrentUser: (user: User | null) => {
    if (user) {
      localStorage.setItem('aura_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('aura_user');
    }
  },
  getRecentlyViewed: (): Product[] => {
    const stored = localStorage.getItem('aura_recently_viewed');
    return stored ? JSON.parse(stored) : [];
  },
  saveRecentlyViewed: (prods: Product[]) => {
    localStorage.setItem('aura_recently_viewed', JSON.stringify(prods));
    window.dispatchEvent(new Event('aura_recently_viewed_updated'));
  }
};

// ==========================================
// CENTRALIZED SERVICE LAYER DEFINITIONS
// ==========================================

export const authService = {
  login: async (email: string, password_raw: string): Promise<{ access: string; refresh: string; user: User }> => {
    if (USE_REAL_BACKEND) {
      const response = await axiosClient.post('/auth/login/', { email, password: password_raw });
      const { access, refresh } = response.data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('access', access);
      localStorage.setItem('refresh', refresh);
      const user = await authService.getProfile();
      mockDB.saveCurrentUser(user);
      return { access, refresh, user };
    } else {
      // High-fidelity local simulation
      if (!email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }
      const isStaff = email.startsWith('admin');
      const user: User = {
        email,
        first_name: isStaff ? 'Admin' : email.split('@')[0],
        last_name: isStaff ? 'User' : 'Staff',
        phone: '+1 234 567 8900',
        is_staff: isStaff,
        profile_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      };
      localStorage.setItem('access_token', 'mock_access_token_jwt_' + email);
      mockDB.saveCurrentUser(user);
      return { access: 'mock_access', refresh: 'mock_refresh', user };
    }
  },

  register: async (email: string, first_name: string, last_name: string, password_raw: string): Promise<User> => {
    if (USE_REAL_BACKEND) {
      const response = await axiosClient.post('/auth/register/', { email, first_name, last_name, password: password_raw });
      return mapUser(response.data);
    } else {
      const user: User = {
        email,
        first_name,
        last_name,
        phone: '',
        is_staff: false,
        profile_image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
      };
      return user;
    }
  },

  getProfile: async (): Promise<User> => {
    if (USE_REAL_BACKEND) {
      const response = await axiosClient.get('/auth/profile/');
      return mapUser(response.data);
    } else {
      const user = mockDB.getCurrentUser();
      if (!user) throw new Error('Unauthenticated');
      return user;
    }
  },

  updateProfile: async (payload: Partial<User>): Promise<User> => {
    const response = await axiosClient.patch('/auth/profile/', payload);
    const user = mapUser(response.data);
    mockDB.saveCurrentUser(user);
    return user;
  },

  changePassword: async (old_password: string, new_password: string): Promise<void> => {
    await axiosClient.post('/auth/change-password/', { old_password, new_password });
  },

  forgotPassword: async (email: string): Promise<void> => {
    await axiosClient.post('/auth/forgot-password/', { email });
  },

  resetPassword: async (email: string, token: string, new_password: string): Promise<void> => {
    await axiosClient.post('/auth/reset-password/', { email, token, new_password });
  },

  logout: async (): Promise<void> => {
    if (USE_REAL_BACKEND) {
      try {
        await axiosClient.post('/auth/logout/', { refresh: localStorage.getItem('refresh_token') });
      } catch (e) {
        console.warn('Backend token logout error:', e);
      }
    }
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    mockDB.saveCurrentUser(null);
  }
};

export const catalogService = {
  getProducts: async (filters?: {
    search?: string;
    category?: string;
    collection?: string;
    color?: string;
    size?: string;
    priceMin?: number;
    priceMax?: number;
    sort?: string;
  }): Promise<Product[]> => {
    if (USE_REAL_BACKEND) {
      const params: Record<string, any> = {};
      if (filters) {
        if (filters.search) params.search = filters.search;
        if (filters.category) params.category = filters.category;
        if (filters.collection) params.collection = filters.collection;
        if (filters.color) params.color = filters.color;
        if (filters.size) params.size = filters.size;
        if (filters.priceMin !== undefined) params.price_min = filters.priceMin;
        if (filters.priceMax !== undefined) params.price_max = filters.priceMax;
        if (filters.sort) params.ordering = filters.sort;
      }
      const response = await axiosClient.get('/catalog/products/', { params });
      // DRF might return paginated results: { count, results } or just flat array
      return Array.isArray(response.data) ? response.data : response.data.results || [];
    } else {
      // High-fidelity filter simulation
      let items = mockDB.getProducts();

      if (filters) {
        if (filters.search) {
          const s = filters.search.toLowerCase();
          items = items.filter(p => p.name.toLowerCase().includes(s) || p.description.toLowerCase().includes(s));
        }
        if (filters.category && filters.category !== 'all') {
          items = items.filter(p => p.category === filters.category);
        }
        if (filters.collection && filters.collection !== 'all') {
          items = items.filter(p => p.collection === filters.collection);
        }
        if (filters.color) {
          items = items.filter(p => p.colors.some(c => c.name.toLowerCase() === filters.color?.toLowerCase()));
        }
        if (filters.size) {
          items = items.filter(p => p.sizes.includes(filters.size!));
        }
        if (filters.priceMin !== undefined) {
          items = items.filter(p => p.price >= filters.priceMin!);
        }
        if (filters.priceMax !== undefined) {
          items = items.filter(p => p.price <= filters.priceMax!);
        }
        if (filters.sort) {
          if (filters.sort === 'price-low-high') {
            items.sort((a, b) => a.price - b.price);
          } else if (filters.sort === 'price-high-low') {
            items.sort((a, b) => b.price - a.price);
          } else if (filters.sort === 'newest') {
            items.sort((a, b) => (b.is_new ? 1 : 0) - (a.is_new ? 1 : 0));
          } else if (filters.sort === 'best-seller') {
            items.sort((a, b) => (b.is_best_seller ? 1 : 0) - (a.is_best_seller ? 1 : 0));
          }
        }
      }
      return items;
    }
  },

  getProductBySlug: async (slug: string): Promise<Product> => {
    if (USE_REAL_BACKEND) {
      const response = await axiosClient.get(`/catalog/products/${slug}/`);
      return response.data;
    } else {
      const prods = mockDB.getProducts();
      const item = prods.find(p => p.slug === slug);
      if (!item) throw new Error('Product not found');
      return item;
    }
  },

  getCategories: async (): Promise<string[]> => {
    if (USE_REAL_BACKEND) {
      const response = await axiosClient.get('/catalog/categories/');
      return response.data;
    } else {
      return ['shirts', 't-shirts'];
    }
  },

  getCollections: async (): Promise<string[]> => {
    if (USE_REAL_BACKEND) {
      const response = await axiosClient.get('/catalog/collections/');
      return response.data;
    } else {
      return ['Essential Drop', 'Classic Minimalist', 'Urban Essentials', 'Summer Drop'];
    }
  }
};

export const cartService = {
  getCart: async (): Promise<CartItem[]> => {
    if (USE_REAL_BACKEND) {
      const response = await axiosClient.get('/orders/cart/');
      return response.data.items || [];
    }
    return mockDB.getCart();
  },

  addToCart: async (product: Product, color: string, size: string, quantity: number = 1): Promise<CartItem[]> => {
    if (USE_REAL_BACKEND) {
      // Backend requires variant_id (ProductVariant.id), not product.id.
      // We pick the first matching variant if catalog detail includes variants.
      const variantId = product.variants?.find(v => v.color.name === color && v.size.name === size)?.id;
      if (!variantId) throw new Error('Selected variant is missing (color/size)');

      await axiosClient.post('/orders/cart/', {
        variant_id: variantId,
        quantity,
      });

      return cartService.getCart();
    }

    const cart = mockDB.getCart();
    const existingIndex = cart.findIndex(
      item => item.product.id === product.id &&
              item.selectedColor === color &&
              item.selectedSize === size
    );

    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        id: Date.now() + Math.floor(Math.random() * 1000),
        product,
        selectedColor: color,
        selectedSize: size,
        quantity,
        variant_id: product.id * 100 + Math.floor(Math.random() * 100),
      });
    }

    mockDB.saveCart(cart);
    return cart;
  },

  removeFromCart: async (itemId: number): Promise<CartItem[]> => {
    if (USE_REAL_BACKEND) {
      // Backend: POST /orders/cart/items/<item_id>/remove/
      await axiosClient.post(`/orders/cart/items/${itemId}/remove/`);
      return cartService.getCart();
    }

    let cart = mockDB.getCart();
    cart = cart.filter(item => item.id !== itemId);
    mockDB.saveCart(cart);
    return cart;
  },

  updateCartQuantity: async (itemId: number, quantity: number): Promise<CartItem[]> => {
    if (USE_REAL_BACKEND) {
      // Backend: POST /orders/cart/items/<item_id>/quantity/
      await axiosClient.post(`/orders/cart/items/${itemId}/quantity/`, { quantity });
      return cartService.getCart();
    }

    const cart = mockDB.getCart();
    const item = cart.find(item => item.id === itemId);
    if (item && quantity >= 1) item.quantity = quantity;
    mockDB.saveCart(cart);
    return cart;
  },

  clearCart: () => {
    mockDB.saveCart([]);
  },
};

export const wishlistService = {
  // Backend has no /wishlist endpoints. Keep wishlist fully disabled to align with backend.
  getWishlist: async (): Promise<Product[]> => [],
  toggleWishlist: async (): Promise<Product[]> => [],
};

export const checkoutService = {
  validateCoupon: async (code: string, subtotal: number): Promise<CouponValidation> => {
    if (USE_REAL_BACKEND) {
      const response = await axiosClient.post('/promotions/coupons/validate/', { code, subtotal });
      return response.data;
    } else {
      const validCoupons: Record<string, { type: 'percent' | 'fixed'; value: number }> = {
        'PROMO10': { type: 'percent', value: 10 },
        'PREMIUM20': { type: 'percent', value: 20 },
        'LUX50': { type: 'fixed', value: 50 },
      };

      const upper = code.toUpperCase();
      if (upper in validCoupons) {
        const promo = validCoupons[upper];
        const amt = promo.type === 'percent' 
          ? Math.round((subtotal * promo.value) / 100) 
          : promo.value;
        return {
          valid: true,
          code: upper,
          discount_type: promo.type,
          discount_value: promo.value,
          discount_amount: Math.min(amt, subtotal),
          message: `Coupon Applied: ${promo.type === 'percent' ? promo.value + '%' : '$' + promo.value} off!`
        };
      }

      return {
        valid: false,
        code,
        discount_type: 'percent',
        discount_value: 0,
        discount_amount: 0,
        message: 'Invalid or expired coupon code'
      };
    }
  },

  placeOrder: async (orderData: {
    address: Address;
    coupon_code?: string;
    shipping_total: number;
    tax_total: number;
    discount_total: number;
  }): Promise<Order> => {
    if (USE_REAL_BACKEND) {
      const response = await axiosClient.post('/orders/checkout/', orderData);
      // Side effect: clear local/session cart
      cartService.clearCart();
      return response.data;
    } else {
      const cart = mockDB.getCart();
      if (cart.length === 0) throw new Error('Cart is empty');

      const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      const total = subtotal + orderData.shipping_total + orderData.tax_total - orderData.discount_total;

      const order: Order = {
        id: Date.now(),
        order_number: 'AURA-' + Math.floor(100000 + Math.random() * 900000),
        date: new Date().toISOString().split('T')[0],
        status: 'Pending',
        items: cart.map(item => ({
          product_name: item.product.name,
          variant_sku: `${item.product.slug.toUpperCase()}-${item.selectedColor.substring(0, 3).toUpperCase()}-${item.selectedSize}`,
          price: item.product.price,
          quantity: item.quantity,
          color: item.selectedColor,
          size: item.selectedSize,
          image: item.product.colors.find(c => c.name === item.selectedColor)?.images[0] || item.product.colors[0].images[0]
        })),
        shipping_address: orderData.address,
        subtotal,
        shipping_total: orderData.shipping_total,
        discount_total: orderData.discount_total,
        tax_total: orderData.tax_total,
        total,
        coupon_code: orderData.coupon_code
      };

      const orders = mockDB.getOrders();
      orders.unshift(order);
      mockDB.saveOrders(orders);
      
      // Clear cart
      cartService.clearCart();

      return order;
    }
  },

  getOrders: async (): Promise<Order[]> => {
    if (USE_REAL_BACKEND) {
      const response = await axiosClient.get('/orders/me/orders/');
      return response.data;
    } else {
      return mockDB.getOrders();
    }
  }
};

export const reviewsService = {
  // Backend expects query params:
  // - product_name (maps to Review.product_name)
  // - variant_sku (maps to Review.variant_sku)
  getReviews: async (filters?: { productName?: string; variantSku?: string }): Promise<Review[]> => {
    if (USE_REAL_BACKEND) {
      const params: Record<string, any> = {};
      if (filters?.productName) params.product_name = filters.productName;
      if (filters?.variantSku) params.variant_sku = filters.variantSku;

      const response = await axiosClient.get('/reviews/', { params });
      const data = response.data;
      return Array.isArray(data?.items) ? data.items : [];
    }

    // Local mock mode
    if (filters?.variantSku) {
      const variantSku = filters.variantSku;
      const prod = mockDB.getProducts().find((p) =>
        p.reviews.some((r) => r.variant_sku === variantSku || r.variant_sku?.includes(variantSku))
      );
      return prod ? prod.reviews : [];
    }

    if (filters?.productName) {
      const prod = mockDB.getProducts().find(p => p.name === filters.productName);
      return prod ? prod.reviews : [];
    }

    return mockDB.getProducts().flatMap(p => p.reviews);
  },

  addReview: async (reviewData: {
    product_slug: string;
    variant_sku?: string;
    rating: number;
    comment: string;
    user_name: string;
  }): Promise<Review> => {
    if (USE_REAL_BACKEND) {
      const response = await axiosClient.post('/reviews/', reviewData);
      return response.data;
    }

    const prods = mockDB.getProducts();
    const prod = prods.find(p => p.slug === reviewData.product_slug);
    if (!prod) throw new Error('Product not found');

    const newReview: Review = {
      id: Date.now(),
      user_name: reviewData.user_name || 'Anonymous',
      rating: reviewData.rating,
      comment: reviewData.comment,
      date: new Date().toISOString().split('T')[0],
      variant_sku: reviewData.variant_sku || `${prod.slug.toUpperCase()}-GEN-M`,
    };

    prod.reviews.unshift(newReview);
    mockDB.saveProducts(prods);
    return newReview;
  },
};

export const newsletterService = {
  subscribe: async (email: string): Promise<{ status: string; message: string }> => {
    if (USE_REAL_BACKEND) {
      const response = await axiosClient.post('/newsletter/subscribe/', { email });
      return response.data;
    } else {
      return {
        status: 'success',
        message: 'Subscribed successfully'
      };
    }
  }
};

export const recentlyViewedService = {
  getViewed: (): Product[] => {
    return mockDB.getRecentlyViewed();
  },

  addViewed: (product: Product) => {
    let items = mockDB.getRecentlyViewed();
    items = items.filter(p => p.id !== product.id);
    items.unshift(product);
    // Limit to 5 products
    items = items.slice(0, 5);
    mockDB.saveRecentlyViewed(items);
  }
};
