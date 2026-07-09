import { Address, CartItem, Order, OrderItem, Product, ProductColor, ProductVariant, Review, User } from '../types';

const COLOR_PALETTE = [
  '#171717',
  '#F5F5F0',
  '#FFFFFF',
  '#707072',
  '#D2C5B4',
  '#E5DCD3',
  '#A4C3D2',
  '#7D8C83',
  '#1F2937',
  '#B45309',
];

const API_BASE_URL = ((import.meta as any).env?.VITE_API_BASE_URL as string) || 'http://127.0.0.1:8000/api/';

const toNumber = (value: unknown, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toString = (value: unknown, fallback = '') => {
  if (value === null || value === undefined) return fallback;
  return String(value);
};

const absoluteUrl = (value?: string | null) => {
  if (!value) return '';
  if (/^https?:\/\//i.test(value)) return value;
  try {
    return new URL(value, API_BASE_URL).toString();
  } catch {
    return value;
  }
};

const hashString = (value: string) => {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
};

const pickColorCode = (seed: string) => COLOR_PALETTE[hashString(seed) % COLOR_PALETTE.length];

const buildImages = (images?: Array<{ image?: string }>, thumbnail?: string) => {
  const mapped = (images || []).map((image) => absoluteUrl(image.image)).filter(Boolean);
  if (mapped.length > 0) return mapped;
  return thumbnail ? [absoluteUrl(thumbnail)] : [];
};

const buildVariants = (variants?: Array<any>): ProductVariant[] => {
  return (variants || []).map((variant) => {
    const colorName = toString(variant?.color?.name);
    const colorSlug = toString(variant?.color?.slug, colorName.toLowerCase().replace(/\s+/g, '-'));
    const sizeName = toString(variant?.size?.name);
    const sizeSlug = toString(variant?.size?.slug, sizeName.toLowerCase().replace(/\s+/g, '-'));

    return {
      id: toNumber(variant?.id),
      sku: toString(variant?.sku),
      stock: toNumber(variant?.stock),
      price_override: variant?.price_override !== null && variant?.price_override !== undefined ? toNumber(variant.price_override) : null,
      discount_price_override: variant?.discount_price_override !== null && variant?.discount_price_override !== undefined ? toNumber(variant.discount_price_override) : null,
      color: {
        id: variant?.color?.id,
        name: colorName,
        slug: colorSlug,
        code: pickColorCode(colorSlug || colorName),
      },
      size: {
        name: sizeName,
        slug: sizeSlug,
      },
    };
  });
};

const buildColors = (variants: ProductVariant[], images: string[]): ProductColor[] => {
  const seen = new Map<string, ProductColor>();

  variants.forEach((variant) => {
    const key = variant.color.slug || variant.color.name;
    if (!seen.has(key)) {
      seen.set(key, {
        name: variant.color.name,
        code: variant.color.code || pickColorCode(key),
        slug: variant.color.slug,
        images,
      });
    }
  });

  if (seen.size === 0) {
    seen.set('default', {
      name: 'Default',
      code: '#171717',
      images,
      slug: 'default',
    });
  }

  return Array.from(seen.values());
};

const buildSizes = (variants: ProductVariant[]) => {
  const sizes = new Set<string>();
  variants.forEach((variant) => {
    if (variant.size.name) sizes.add(variant.size.name);
  });
  return Array.from(sizes);
};

const buildFeatures = (product: Partial<Product> & Record<string, any>) => {
  const features = [
    `Live stock count: ${toNumber(product.stock)}`,
  ];

  if (product.featured) features.push('Featured catalog item');
  if (product.is_best_seller || product.best_seller) features.push('Marked as best seller');
  if (product.is_new || product.new_arrival) features.push('Fresh catalog drop');
  if (product.published === false) features.push('Unpublished in backend');

  return features;
};

const buildSpecifications = (product: Record<string, any>) => ({
  Category: product.category?.name || product.category_slug || product.category || 'Uncategorized',
  Collection: product.collection?.name || product.collection_slug || product.collection || 'None',
  SKU: toString(product.sku),
  Stock: String(toNumber(product.stock)),
  Published: product.published === false ? 'No' : 'Yes',
  Featured: product.featured ? 'Yes' : 'No',
  Best Seller: product.best_seller ? 'Yes' : 'No',
});

const resolveProductPrice = (product: Record<string, any>) => {
  const basePrice = toNumber(product.price);
  const discountPrice = product.discount_price !== null && product.discount_price !== undefined ? toNumber(product.discount_price) : null;
  return discountPrice !== null ? discountPrice : basePrice;
};

const resolveOriginalPrice = (product: Record<string, any>) => {
  const basePrice = toNumber(product.price);
  const discountPrice = product.discount_price !== null && product.discount_price !== undefined ? toNumber(product.discount_price) : null;
  return discountPrice !== null ? basePrice : undefined;
};

export interface CatalogOption {
  label: string;
  value: string;
}

export const mapCatalogOption = (item: Record<string, any>): CatalogOption => ({
  label: toString(item?.name, toString(item?.slug)),
  value: toString(item?.slug, toString(item?.name).toLowerCase().replace(/\s+/g, '-')),
});

export const mapUser = (payload: Record<string, any>): User => ({
  id: payload?.id,
  email: toString(payload?.email),
  first_name: toString(payload?.first_name),
  last_name: toString(payload?.last_name),
  phone: payload?.phone ? toString(payload.phone) : undefined,
  profile_image: payload?.profile_image ? absoluteUrl(payload.profile_image) : undefined,
  is_staff: Boolean(payload?.is_staff),
  is_active: payload?.is_active === undefined ? undefined : Boolean(payload.is_active),
  date_joined: payload?.date_joined ? toString(payload.date_joined) : undefined,
});

export const mapReview = (payload: Record<string, any>): Review => ({
  id: toNumber(payload?.id),
  user_name: toString(payload?.user_display || payload?.user_name, 'Anonymous'),
  rating: toNumber(payload?.rating, 5),
  comment: toString(payload?.comment),
  date: payload?.created_at ? new Date(payload.created_at).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
  variant_sku: payload?.variant_sku ? toString(payload.variant_sku) : undefined,
});

export const mapProductListItem = (payload: Record<string, any>): Product => {
  const images = buildImages(undefined, payload?.thumbnail);
  const variants = buildVariants(payload?.variants);
  const colors = buildColors(variants, images);
  const sizes = buildSizes(variants);

  const categoryName = payload?.category?.name || payload?.category_slug || 'Catalog';
  const collectionName = payload?.collection?.name || payload?.collection_slug || '';

  return {
    id: toNumber(payload?.id),
    name: toString(payload?.name),
    slug: toString(payload?.slug),
    description: toString(payload?.description),
    price: resolveProductPrice(payload),
    original_price: resolveOriginalPrice(payload),
    category: categoryName,
    category_slug: payload?.category?.slug || payload?.category_slug,
    collection: collectionName,
    collection_slug: payload?.collection?.slug || payload?.collection_slug,
    thumbnail: payload?.thumbnail ? absoluteUrl(payload.thumbnail) : undefined,
    colors,
    sizes: sizes.length > 0 ? sizes : ['M'],
    variants: variants.length > 0 ? variants : undefined,
    features: buildFeatures(payload),
    specifications: buildSpecifications(payload),
    reviews: [],
    is_new: Boolean(payload?.new_arrival),
    is_best_seller: Boolean(payload?.best_seller),
    is_trending: Boolean(payload?.featured),
    stock: toNumber(payload?.stock),
    featured: Boolean(payload?.featured),
    published: payload?.published === undefined ? true : Boolean(payload?.published),
    created_at: payload?.created_at ? toString(payload.created_at) : undefined,
    updated_at: payload?.updated_at ? toString(payload.updated_at) : undefined,
  };
};

export const mapProductDetail = (payload: Record<string, any>): Product => {
  const images = buildImages(payload?.images, payload?.thumbnail);
  const variants = buildVariants(payload?.variants);
  const colors = buildColors(variants, images.length > 0 ? images : payload?.thumbnail ? [absoluteUrl(payload.thumbnail)] : []);
  const sizes = buildSizes(variants);

  const categoryName = payload?.category?.name || payload?.category_slug || 'Catalog';
  const collectionName = payload?.collection?.name || payload?.collection_slug || '';

  return {
    id: toNumber(payload?.id),
    name: toString(payload?.name),
    slug: toString(payload?.slug),
    description: toString(payload?.description),
    price: resolveProductPrice(payload),
    original_price: resolveOriginalPrice(payload),
    category: categoryName,
    category_slug: payload?.category?.slug || payload?.category_slug,
    collection: collectionName,
    collection_slug: payload?.collection?.slug || payload?.collection_slug,
    thumbnail: payload?.thumbnail ? absoluteUrl(payload.thumbnail) : undefined,
    colors,
    sizes: sizes.length > 0 ? sizes : ['M'],
    variants: variants.length > 0 ? variants : undefined,
    features: buildFeatures(payload),
    specifications: buildSpecifications(payload),
    reviews: [],
    is_new: Boolean(payload?.new_arrival),
    is_best_seller: Boolean(payload?.best_seller),
    is_trending: Boolean(payload?.featured),
    stock: toNumber(payload?.stock),
    featured: Boolean(payload?.featured),
    published: payload?.published === undefined ? true : Boolean(payload?.published),
    created_at: payload?.created_at ? toString(payload.created_at) : undefined,
    updated_at: payload?.updated_at ? toString(payload.updated_at) : undefined,
  };
};

export const mapOrderItem = (payload: Record<string, any>): OrderItem => ({
  product_name: toString(payload?.product_name),
  variant_sku: toString(payload?.variant_sku),
  price: toNumber(payload?.unit_discount_price ?? payload?.unit_price),
  quantity: toNumber(payload?.quantity, 1),
  color: toString(payload?.color_name || payload?.color),
  size: toString(payload?.size_name || payload?.size),
  image: undefined,
});

export const mapOrder = (payload: Record<string, any>): Order => ({
  id: toNumber(payload?.id),
  order_number: toString(payload?.order_number),
  date: payload?.created_at ? new Date(payload.created_at).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
  status: (payload?.status || 'Pending') as Order['status'],
  items: Array.isArray(payload?.items) ? payload.items.map(mapOrderItem) : [],
  shipping_address: {
    first_name: toString(payload?.ship_first_name),
    last_name: toString(payload?.ship_last_name),
    phone: toString(payload?.phone),
    line1: toString(payload?.ship_line1),
    line2: toString(payload?.ship_line2),
    city: toString(payload?.ship_city),
    state: toString(payload?.ship_state),
    postal_code: toString(payload?.ship_postal_code),
    country: toString(payload?.ship_country),
  } as Address,
  subtotal: toNumber(payload?.subtotal),
  shipping_total: toNumber(payload?.shipping_total),
  discount_total: toNumber(payload?.discount_total),
  tax_total: toNumber(payload?.tax_total),
  total: toNumber(payload?.total),
  coupon_code: payload?.coupon_code ? toString(payload.coupon_code) : undefined,
});

export const mapCartItem = (payload: Record<string, any>, product: Product): CartItem => ({
  id: toNumber(payload?.id),
  product,
  selectedColor: toString(payload?.color),
  selectedSize: toString(payload?.size),
  quantity: toNumber(payload?.quantity, 1),
  variant_id: toNumber(payload?.variant),
});

export const absoluteMedia = absoluteUrl;