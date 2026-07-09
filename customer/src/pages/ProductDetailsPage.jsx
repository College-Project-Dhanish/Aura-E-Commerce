import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Star, ShoppingBag, Truck, RotateCcw, ShieldCheck, ChevronDown, Plus, Minus } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import { ENDPOINTS } from '../services/endpoints';
import { useAuth } from '../contexts/AuthContext';
import { cartService } from '../services/cart';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorAlert from '../components/ui/ErrorAlert';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function ProductDetailsPage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState(null);
  const [reviews, setReviews] = useState([]);

  const [selectedVariantSku, setSelectedVariantSku] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [postingReview, setPostingReview] = useState(false);
  const [postReviewError, setPostReviewError] = useState(null);
  const [postReviewSuccess, setPostReviewSuccess] = useState(null);
  
  const [addingToCart, setAddingToCart] = useState(false);
  const [addToCartError, setAddToCartError] = useState(null);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const url = ENDPOINTS.CATALOG.PRODUCT_DETAIL(slug);
      const res = await axiosInstance.get(url);
      setProduct(res.data?.results ? res.data.results[0] : res.data);
    } catch (e) {
      setError(e?.response?.data?.detail || e.message || 'Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const productName = useMemo(() => {
    if (!product) return '';
    return product?.name || product?.title || product?.slug || '';
  }, [product]);

  const variants = useMemo(() => {
    if (!product?.variants || !Array.isArray(product.variants)) return [];
    return product.variants;
  }, [product]);

  const variantSkuOptions = useMemo(() => {
    const skus = variants.map((v) => v?.sku).filter(Boolean).filter((sku, idx, arr) => arr.indexOf(sku) === idx);
    if (skus.length === 0 && product?.sku) return [product.sku];
    return skus;
  }, [variants, product?.sku]);

  const inferredDefaultVariantSku = useMemo(() => {
    if (!variantSkuOptions.length) return '';
    if (variantSkuOptions.length === 1) return variantSkuOptions[0];
    const first = variants?.[0]?.sku;
    return first || variantSkuOptions[0] || '';
  }, [variants, variantSkuOptions]);

  useEffect(() => {
    if (slug) fetchProduct();
  }, [slug]);

  useEffect(() => {
    if (!product) return;
    setSelectedVariantSku((prev) => {
      if (prev) return prev;
      return inferredDefaultVariantSku || (variantSkuOptions[0] ?? '') || '';
    });
  }, [product, inferredDefaultVariantSku, variantSkuOptions]);

  const fetchReviews = async () => {
    if (!productName) return;
    try {
      setReviewsLoading(true);
      setReviewsError(null);
      const params = new URLSearchParams();
      params.set('product_name', productName);
      if (selectedVariantSku) params.set('variant_sku', selectedVariantSku);
      const res = await axiosInstance.get(`${ENDPOINTS.REVIEWS.LIST_CREATE}?${params.toString()}`);
      const items = res.data?.items ? res.data.items : [];
      setReviews(Array.isArray(items) ? items : []);
    } catch (e) {
      setReviewsError(e?.response?.data?.detail || e.message || 'Failed to load reviews');
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    if (!productName) return;
    fetchReviews();
  }, [productName, selectedVariantSku]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setPostReviewError(null);
    setPostReviewSuccess(null);

    if (!user) {
      setPostReviewError('Please login to post a review.');
      return;
    }
    if (!productName) {
      setPostReviewError('Product name unavailable.');
      return;
    }
    if (!selectedVariantSku) {
      setPostReviewError('Please select a variant to review.');
      return;
    }

    try {
      setPostingReview(true);
      await axiosInstance.post(ENDPOINTS.REVIEWS.LIST_CREATE, {
        product_name: productName,
        variant_sku: selectedVariantSku,
        rating: reviewRating,
        comment: reviewComment,
      });
      setReviewComment('');
      setPostReviewSuccess('Review submitted successfully (pending approval).');
      await fetchReviews();
    } catch (err) {
      const data = err?.response?.data;
      let msg = 'Failed to submit review';
      if (data) {
        if (data.detail) msg = data.detail;
        else if (data.non_field_errors) msg = data.non_field_errors[0];
        else if (Array.isArray(data) && data.length > 0) msg = data[0];
        else if (typeof data === 'object') {
          const firstKey = Object.keys(data)[0];
          if (firstKey && Array.isArray(data[firstKey])) {
            msg = `${data[firstKey][0]}`;
          } else if (firstKey) {
            msg = `${data[firstKey]}`;
          }
        }
      } else if (err?.message) {
        msg = err.message;
      }
      setPostReviewError(msg);
    } finally {
      setPostingReview(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setAddToCartError(null);
    setAddingToCart(true);
    try {
      const selectedVariant = variants.find(v => v.sku === selectedVariantSku);
      await cartService.addItem(product.id, quantity, selectedVariant?.id || null);
      navigate('/cart');
    } catch (err) {
      setAddToCartError('Failed to add to cart.');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20">
        <ErrorAlert message={error} />
        <Link to="/products"><Button variant="outline" className="mt-4">Go Back</Button></Link>
      </div>
    );
  }

  if (!product) return null;

  // Process Images
  const getFullUrl = (path) => {
    if (!path) return 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop';
    if (path.startsWith('http')) return path;
    const API_URL = (import.meta.env?.VITE_API_BASE_URL) || 'http://127.0.0.1:8000/api';
    const BASE_URL = API_URL.replace('/api', '').replace(/\/$/, '');
    return `${BASE_URL}${path.startsWith('/') ? path : '/' + path}`;
  };

  const productImages = product.images?.length > 0 
    ? product.images.map(img => getFullUrl(img.image)) 
    : [getFullUrl(product.thumbnail)];

  return (
    <div className="bg-background min-h-screen pb-32">
      
      {/* Breadcrumb */}
      <div className="border-b border-border bg-white/50 backdrop-blur-md sticky top-[80px] z-40">
        <div className="max-w-[1440px] mx-auto px-6 py-4 flex items-center gap-4 text-sm font-medium">
          <Link to="/products" className="text-muted hover:text-primary transition-colors flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Catalog
          </Link>
          <span className="text-border">/</span>
          <span className="text-primary truncate">{productName}</span>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 pt-12">
        <div className="flex flex-col lg:flex-row gap-16 xl:gap-24 items-start relative">
          
          {/* Left Column: Image Gallery (Magazine Style) */}
          <div className="w-full lg:w-[60%] flex flex-col md:flex-row-reverse gap-6">
            {/* Main Image */}
            <div className="flex-1 bg-secondary rounded-3xl overflow-hidden relative group cursor-zoom-in aspect-[4/5] shadow-sm">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  src={productImages[activeImageIndex]}
                  alt={`${productName} view ${activeImageIndex + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
              </AnimatePresence>
            </div>
            
            {/* Thumbnails */}
            {productImages.length > 1 && (
              <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto md:w-24 custom-scrollbar flex-shrink-0">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={cn(
                      "w-20 md:w-full aspect-[4/5] rounded-xl overflow-hidden border-2 transition-all duration-300 relative",
                      activeImageIndex === idx ? "border-primary shadow-md" : "border-transparent opacity-60 hover:opacity-100"
                    )}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    {activeImageIndex === idx && <div className="absolute inset-0 bg-primary/5"></div>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Sticky Purchase Section */}
          <div className="w-full lg:w-[40%] lg:sticky lg:top-[160px]">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col"
            >
              <h1 className="text-4xl lg:text-5xl font-bold tracking-tighter text-primary mb-2 leading-tight">
                {productName}
              </h1>
              
              <div className="flex items-center gap-4 mb-8">
                <span className="text-3xl font-bold text-primary">${product.price}</span>
                <div className="flex items-center gap-1 bg-accent/10 px-3 py-1 rounded-full">
                  <Star className="w-4 h-4 text-accent fill-accent" />
                  <span className="text-sm font-bold text-accent">Premium Quality</span>
                </div>
              </div>
              
              <p className="text-lg text-muted font-light leading-relaxed mb-10">
                {product.short_description || "Experience the pinnacle of luxury craftsmanship. Designed to elevate your everyday aesthetic."}
              </p>

              {/* Variants */}
              {variantSkuOptions.length > 1 && (
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-sm font-bold tracking-widest uppercase text-primary">Select Variant</label>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {variantSkuOptions.map((sku) => {
                      const isActive = selectedVariantSku === sku;
                      return (
                        <button
                          key={sku}
                          onClick={() => setSelectedVariantSku(sku)}
                          className={cn(
                            "py-3 px-4 rounded-xl border text-sm font-medium transition-all duration-200",
                            isActive 
                              ? "border-primary bg-primary text-white shadow-md" 
                              : "border-border bg-white text-primary hover:border-primary"
                          )}
                        >
                          {sku}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-10">
                <label className="text-sm font-bold tracking-widest uppercase text-primary mb-4 block">Quantity</label>
                <div className="flex items-center w-32 bg-secondary rounded-full border border-border p-1">
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm transition-all text-primary"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="flex-1 text-center font-bold text-primary">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm transition-all text-primary"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <ErrorAlert message={addToCartError} className="mb-6" />

              {/* Add to Cart CTA */}
              <Button 
                variant="primary" 
                size="lg" 
                className="w-full h-16 text-lg uppercase tracking-widest mb-6 shadow-xl shadow-primary/20 hover:shadow-primary/30"
                onClick={handleAddToCart}
                isLoading={addingToCart}
              >
                <ShoppingBag className="w-5 h-5 mr-2" /> Add to Cart
              </Button>

              {/* Trust Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-border pt-8 mt-4">
                <div className="flex flex-col items-center justify-center text-center gap-2 p-4 bg-secondary rounded-2xl">
                  <Truck className="w-6 h-6 text-primary" />
                  <span className="text-xs font-bold text-primary">Free Shipping</span>
                </div>
                <div className="flex flex-col items-center justify-center text-center gap-2 p-4 bg-secondary rounded-2xl">
                  <RotateCcw className="w-6 h-6 text-primary" />
                  <span className="text-xs font-bold text-primary">30-Day Returns</span>
                </div>
                <div className="flex flex-col items-center justify-center text-center gap-2 p-4 bg-secondary rounded-2xl">
                  <ShieldCheck className="w-6 h-6 text-primary" />
                  <span className="text-xs font-bold text-primary">Secure Checkout</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Elegant Tabs (Description vs Reviews) */}
        <div className="mt-32 max-w-4xl mx-auto">
          <div className="flex justify-center border-b border-border mb-12">
            <button 
              onClick={() => setActiveTab('description')}
              className={cn(
                "pb-4 px-8 text-sm font-bold tracking-[0.2em] uppercase transition-colors relative",
                activeTab === 'description' ? "text-primary" : "text-muted hover:text-primary"
              )}
            >
              Details
              {activeTab === 'description' && (
                <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
            <button 
              onClick={() => setActiveTab('reviews')}
              className={cn(
                "pb-4 px-8 text-sm font-bold tracking-[0.2em] uppercase transition-colors relative",
                activeTab === 'reviews' ? "text-primary" : "text-muted hover:text-primary"
              )}
            >
              Reviews ({reviews.length})
              {activeTab === 'reviews' && (
                <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'description' && (
              <motion.div 
                key="desc"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="prose prose-lg text-muted font-light leading-loose max-w-none text-center"
              >
                {product.description ? (
                  <p>{product.description}</p>
                ) : (
                  <p>Meticulously crafted from the finest materials, this piece embodies the essence of modern luxury. Each detail is thoughtfully designed to provide both exceptional comfort and a striking aesthetic silhouette.</p>
                )}
              </motion.div>
            )}

            {activeTab === 'reviews' && (
              <motion.div 
                key="revs"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-12"
              >
                {/* Write Review */}
                <div className="bg-secondary rounded-3xl p-8 md:p-12 mb-16 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl"></div>
                  <h3 className="text-2xl font-bold text-primary mb-6 relative z-10">Share Your Experience</h3>
                  {!user ? (
                    <p className="text-muted relative z-10">
                      Please <Link to="/login" className="text-accent font-bold hover:underline">sign in</Link> to post a review.
                    </p>
                  ) : (
                    <form onSubmit={handleSubmitReview} className="relative z-10 max-w-2xl">
                      <div className="mb-6">
                        <label className="block text-sm font-bold tracking-widest uppercase text-primary mb-3">Rating</label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              type="button"
                              key={star}
                              onClick={() => setReviewRating(star)}
                              className="focus:outline-none transition-transform hover:scale-110"
                            >
                              <Star className={cn("w-8 h-8", star <= reviewRating ? "text-accent fill-accent" : "text-border")} />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="mb-6">
                        <label className="block text-sm font-bold tracking-widest uppercase text-primary mb-3">Your Review</label>
                        <textarea
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          required
                          rows={4}
                          className="w-full px-6 py-4 rounded-2xl border border-border bg-white text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm resize-none placeholder:text-muted/50"
                          placeholder="How did this piece make you feel?"
                        />
                      </div>

                      <ErrorAlert message={postReviewError} className="mb-6" />
                      {postReviewSuccess && (
                        <div className="bg-green-50 text-green-700 p-4 rounded-xl text-sm font-medium mb-6">
                          {postReviewSuccess}
                        </div>
                      )}

                      <Button type="submit" variant="primary" isLoading={postingReview} className="px-10">
                        Submit Review
                      </Button>
                    </form>
                  )}
                </div>

                {/* Review List */}
                <div>
                  <h3 className="text-2xl font-bold text-primary mb-10 text-center">Customer Testimonials</h3>
                  
                  {reviewsLoading ? (
                    <LoadingSpinner />
                  ) : reviewsError ? (
                    <ErrorAlert message={reviewsError} />
                  ) : reviews.length === 0 ? (
                    <p className="text-center text-muted italic">Be the first to share your thoughts.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {reviews.map((r, idx) => {
                        let avatarUrl = null;
                        if (r.user_profile_image) {
                          if (r.user_profile_image.startsWith('http')) {
                            avatarUrl = r.user_profile_image;
                          } else {
                            const API_URL = import.meta.env?.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
                            const BASE_URL = API_URL.replace('/api', '').replace(/\/$/, '');
                            avatarUrl = `${BASE_URL}${r.user_profile_image.startsWith('/') ? r.user_profile_image : '/' + r.user_profile_image}`;
                          }
                        }
                        
                        return (
                          <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            key={r.id} 
                            className="bg-white rounded-3xl p-8 border border-border shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)]"
                          >
                            <div className="flex justify-between items-start mb-6">
                              <div className="flex items-center gap-4">
                                {avatarUrl ? (
                                  <img 
                                    src={avatarUrl} 
                                    alt={r.user_display} 
                                    className="w-12 h-12 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-primary font-bold text-lg">
                                    {(r.user_display && r.user_display !== 'Anonymous') ? r.user_display.charAt(0).toUpperCase() : 'A'}
                                  </div>
                                )}
                                <div>
                                  <div className="font-bold text-primary">{r.user_display || 'Verified Buyer'}</div>
                                  <div className="text-xs text-muted">Variant: {r.variant_sku}</div>
                                </div>
                              </div>
                              <div className="flex gap-0.5">
                                {[1,2,3,4,5].map(star => (
                                  <Star key={star} className={cn("w-4 h-4", star <= r.rating ? "text-accent fill-accent" : "text-border")} />
                                ))}
                              </div>
                            </div>
                            <p className="text-muted leading-relaxed font-light">{r.comment}</p>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
