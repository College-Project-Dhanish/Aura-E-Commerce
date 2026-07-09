import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, User } from '../types';
import { authService, cartService, recentlyViewedService } from '../services/api';

interface AppContextType {
  user: User | null;
  cart: CartItem[];
  wishlist: Product[];
  recentlyViewed: Product[];
  darkMode: boolean;
  quickViewProduct: Product | null;
  showQuickView: boolean;
  isLoading: boolean;
  cartQuantity: number;
  cartTotal: number;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
  setThemeMode: (dark: boolean) => void;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, fname: string, lname: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  addToCart: (product: Product, color: string, size: string, quantity?: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  updateCartQuantity: (itemId: number, quantity: number) => Promise<void>;
  toggleWishlist: (product: Product) => Promise<void>;
  clearCart: () => void;
  viewProduct: (product: Product) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  // Backend has no wishlist endpoints; keep wishlist disabled.
  const [wishlist] = useState<Product[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [showQuickView, setShowQuickView] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initApp = async () => {
      try {
        const savedDark = localStorage.getItem('aura_dark_mode') === 'true';
        setDarkMode(savedDark);
        if (savedDark) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');

        try {
          const profile = await authService.getProfile();
          setUser(profile);
        } catch {
          console.log('No user session found');
        }

        const c = await cartService.getCart();
        const r = recentlyViewedService.getViewed();

        setCart(c);
        setRecentlyViewed(r);
      } catch (err) {
        console.error('Failed to initialize App Context:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initApp();

    const handleCartSync = async () => {
      const c = await cartService.getCart();
      setCart(c);
    };

    const handleViewedSync = () => {
      setRecentlyViewed(recentlyViewedService.getViewed());
    };

    window.addEventListener('aura_cart_updated', handleCartSync);
    window.addEventListener('aura_recently_viewed_updated', handleViewedSync);

    return () => {
      window.removeEventListener('aura_cart_updated', handleCartSync);
      window.removeEventListener('aura_recently_viewed_updated', handleViewedSync);
    };
  }, []);

  const setThemeMode = (dark: boolean) => {
    setDarkMode(dark);
    localStorage.setItem('aura_dark_mode', String(dark));
    if (dark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  };

  const openQuickView = (product: Product) => {
    setQuickViewProduct(product);
    setShowQuickView(true);
  };

  const closeQuickView = () => {
    setShowQuickView(false);
    setTimeout(() => setQuickViewProduct(null), 300);
  };

  const login = async (email: string, pass: string) => {
    const data = await authService.login(email, pass);
    setUser(data.user);
  };

  const register = async (email: string, fname: string, lname: string, pass: string) => {
    await authService.register(email, fname, lname, pass);
    await login(email, pass);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const addToCart = async (product: Product, color: string, size: string, quantity: number = 1) => {
    const updated = await cartService.addToCart(product, color, size, quantity);
    setCart(updated);
  };

  const removeFromCart = async (itemId: number) => {
    const updated = await cartService.removeFromCart(itemId);
    setCart(updated);
  };

  const updateCartQuantity = async (itemId: number, quantity: number) => {
    const updated = await cartService.updateCartQuantity(itemId, quantity);
    setCart(updated);
  };

  const toggleWishlist = async (_product: Product) => {
    // no-op: backend wishlist endpoints do not exist in this codebase.
  };

  const clearCart = () => {
    cartService.clearCart();
    setCart([]);
  };

  const viewProduct = (product: Product) => {
    recentlyViewedService.addViewed(product);
    setRecentlyViewed(recentlyViewedService.getViewed());
  };

  const cartQuantity = cart.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum: number, item: CartItem) => sum + item.product.price * item.quantity, 0);

  return (
    <AppContext.Provider
      value={{
        user,
        cart,
        wishlist,
        recentlyViewed,
        darkMode,
        quickViewProduct,
        showQuickView,
        isLoading,
        cartQuantity,
        cartTotal,
        openQuickView,
        closeQuickView,
        setThemeMode,
        login,
        register,
        logout,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        toggleWishlist,
        clearCart,
        viewProduct,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) throw new Error('useApp must be used within an AppProvider');
  return context;
};
