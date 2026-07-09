export interface Review {
  id: number;
  user_name: string;
  rating: number;
  comment: string;
  date: string;
  variant_sku?: string;
}

export interface ProductColor {
  name: string;
  code: string;
  images: string[];
  slug?: string;
}

export interface ProductVariant {
  id: number;
  sku: string;
  stock: number;
  price_override?: number | null;
  discount_price_override?: number | null;
  color: { id?: number; name: string; code?: string; slug?: string };
  size: { name: string; slug?: string };
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  original_price?: number;
  category: string;
  category_slug?: string;
  collection: string;
  collection_slug?: string;
  thumbnail?: string;
  colors: ProductColor[];
  sizes: string[];
  // Backend provides variants; frontend can still work if absent in mocks
  variants?: ProductVariant[];
  features: string[];
  specifications: Record<string, string>;
  reviews: Review[];
  is_new: boolean;
  is_best_seller: boolean;
  is_trending: boolean;
  stock: number;
  featured?: boolean;
  published?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CartItem {
  id: number;
  product: Product;
  selectedColor: string;
  selectedSize: string;
  quantity: number;
  variant_id: number;
}

export interface Address {
  first_name: string;
  last_name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface OrderItem {
  product_name: string;
  variant_sku: string;
  price: number;
  quantity: number;
  color: string;
  size: string;
  image?: string;
}

export interface Order {
  id: number;
  order_number: string;
  date: string;
  status: 'Pending' | 'Confirmed' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled';
  items: OrderItem[];
  shipping_address: Address;
  subtotal: number;
  shipping_total: number;
  discount_total: number;
  tax_total: number;
  total: number;
  coupon_code?: string;
}

export interface User {
  id?: number;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  profile_image?: string;
  is_staff?: boolean;
  is_active?: boolean;
  date_joined?: string;
}

export interface CouponValidation {
  valid: boolean;
  code: string;
  discount_type: 'percent' | 'fixed';
  discount_value: number;
  discount_amount: number;
  message?: string;
}
