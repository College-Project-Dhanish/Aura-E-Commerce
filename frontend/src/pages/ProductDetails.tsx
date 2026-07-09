import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  ShoppingBag, 
  Check, 
  Star, 
  ChevronRight, 
  ArrowLeft, 
  Maximize2,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { catalogService, reviewsService, recentlyViewedService } from '../services/api';
import { Product, Review } from '../types';
import ProductCard from '../components/ProductCard';

export const ProductDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { addToCart, toggleWishlist, wishlist, viewProduct, recentlyViewed } = useApp();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeColorIdx, setActiveColorIdx] = useState(0);
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'details' | 'specs'>('details');

  // Fullscreen Preview state
  const [showFullscreen, setShowFullscreen] = useState(false);

  // Review Form state
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const loadDetails = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const item = await catalogService.getProductBySlug(slug);
        setProduct(item);
        setActiveColorIdx(0);
        setActiveImgIdx(0);
        setSelectedSize(item.sizes[1] || 'M'); // default size M
        viewProduct(item);

        // Load reviews from backend (aligned to /api/reviews/ query params)
        try {
          const backendReviews = await reviewsService.getReviews({ productName: item.name });
          setProduct({ ...item, reviews: backendReviews });
        } catch (e) {
          console.warn('Failed to load reviews from backend', e);
        }

        // Load related products
        const all = await catalogService.getProducts();
        const related = all.filter(p => p.id !== item.id && p.category === item.category).slice(0, 4);
        setRelatedProducts(related);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 space-y-4 font-mono select-none">
        <div className="w-8 h-8 border-2 border-brand-dark dark:border-white border-t-transparent rounded-full animate-spin" />
        <span className="text-xs uppercase tracking-widest text-neutral-400">Loading Product Ledger...</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 space-y-6 select-none font-mono">
        <h2 className="text-xl font-display font-light">Product Not Found</h2>
        <Link 
          to="/products"
          className="bg-brand-dark text-white dark:bg-white dark:text-brand-dark px-6 py-3 text-xs uppercase tracking-widest font-semibold flex items-center gap-2"
        >
          <ArrowLeft size={14} />
          <span>Back to catalog</span>
        </Link>
      </div>
    );
  }

  const currentColor = product.colors[activeColorIdx];
  const images = currentColor.images;
  const isWishlisted = wishlist.some(item => item.id === product.id);

  const handleAddToCart = async () => {
    if (!selectedSize) {
      setErrorMsg('Please select a size');
      return;
    }
    setErrorMsg('');
    setIsAdding(true);

    try {
      await addToCart(product, currentColor.name, selectedSize, 1);
      setTimeout(() => setIsAdding(false), 800);
    } catch (e) {
      setErrorMsg('Insufficient stock or stock unavailable.');
      setIsAdding(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) {
      alert('Please fill out all review fields');
      return;
    }

    try {
      const added = await reviewsService.addReview({
        product_slug: product.slug,
        user_name: reviewName,
        rating: reviewRating,
        comment: reviewComment,
        variant_sku: `${product.slug.toUpperCase()}-${currentColor.name.substring(0,3).toUpperCase()}-${selectedSize}`
      });

      // Refresh from backend for correct shaping (approved_only defaults to true)
      try {
        const updatedReviews = await reviewsService.getReviews({ productName: product.name });
        setProduct({ ...product, reviews: updatedReviews });
      } catch {
        // Fallback optimistic insert
        setProduct({ ...product, reviews: [added, ...product.reviews] });
      }

      setReviewName('');
      setReviewComment('');
      setReviewRating(5);
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-28 md:py-36 space-y-24 md:space-y-32">
      
      {/* Breadcrumbs Row */}
      <nav className="text-xs font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-500 flex items-center gap-1.5 select-none">
        <Link to="/" className="hover:text-brand-dark dark:hover:text-white transition-colors">Home</Link>
        <ChevronRight size={10} />
        <Link to="/products" className="hover:text-brand-dark dark:hover:text-white transition-colors">Shop</Link>
        <ChevronRight size={10} />
        <span className="text-brand-dark dark:text-white font-medium line-clamp-1">{product.name}</span>
      </nav>

      {/* Main Product Panel: Left Images, Right Details Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        
        {/* Left Column: Image Selector and Main View (Cols: 7) */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-5">
          {/* Thumbnails list */}
          <div className="flex md:flex-col gap-3 shrink-0 overflow-x-auto no-scrollbar md:max-h-[600px] select-none">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImgIdx(idx)}
                className={`relative w-16 md:w-20 aspect-[3/4] bg-neutral-50 dark:bg-neutral-900 border overflow-hidden transition-all duration-200 shrink-0 ${
                  activeImgIdx === idx 
                    ? 'border-brand-dark dark:border-white' 
                    : 'border-transparent hover:border-neutral-300'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover object-top" />
              </button>
            ))}
          </div>

          {/* Main Display area with zoom triggers */}
          <div className="relative flex-1 aspect-[3/4] bg-neutral-50 dark:bg-neutral-900 overflow-hidden select-none border border-neutral-100 dark:border-neutral-900">
            <img
              src={images[activeImgIdx]}
              alt={product.name}
              className="w-full h-full object-cover object-top hover:scale-103 transition-transform duration-550 ease-out cursor-zoom-in"
              onClick={() => setShowFullscreen(true)}
            />
            {/* Maximize Button overlay */}
            <button
              onClick={() => setShowFullscreen(true)}
              className="absolute top-4 right-4 p-2.5 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-sm rounded-full text-brand-dark dark:text-white hover:scale-105 active:scale-95 shadow-md"
              title="Fullscreen Gallery View"
            >
              <Maximize2 size={14} />
            </button>
          </div>
        </div>

        {/* Right Column: Actions and Description Details (Cols: 5) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-8 select-none">
          
          <div className="space-y-6">
            {/* Capsule collection */}
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500 font-semibold block">
              {product.collection} Drop
            </span>

            {/* Name */}
            <h1 className="text-3xl md:text-4xl font-display font-light text-brand-dark dark:text-white tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Ratings Summary */}
            <div className="flex items-center gap-2.5">
              <div className="flex text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    size={14} 
                    className={i < (product.reviews.reduce((sum, r) => sum + r.rating, 0) / (product.reviews.length || 5) || 5) ? 'fill-amber-400' : 'text-neutral-200'} 
                  />
                ))}
              </div>
              <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
                {product.reviews.length} Customer reviews
              </span>
            </div>

            {/* Price Tag */}
            <div className="flex items-center gap-3">
              <span className="text-2xl font-mono font-semibold text-brand-dark dark:text-white">
                ${product.price}.00
              </span>
              {product.original_price && (
                <span className="text-sm font-mono text-neutral-400 line-through">
                  ${product.original_price}.00
                </span>
              )}
            </div>

            {/* Divider */}
            <hr className="border-neutral-100 dark:border-neutral-900" />

            {/* Swatch color row selector */}
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-500 font-bold block">
                Color selection: <span className="text-brand-dark dark:text-white font-sans ml-1">{currentColor.name}</span>
              </span>
              <div className="flex gap-2.5">
                {product.colors.map((col, idx) => (
                  <button
                    key={col.name}
                    onClick={() => {
                      setActiveColorIdx(idx);
                      setActiveImgIdx(0);
                    }}
                    className={`w-6.5 h-6.5 rounded-full border transition-all duration-200 relative ${
                      activeColorIdx === idx 
                        ? 'border-brand-dark dark:border-white scale-110 ring-2 ring-offset-2 ring-neutral-400 dark:ring-offset-black' 
                        : 'border-neutral-300 dark:border-neutral-800 hover:scale-105'
                    }`}
                    style={{ backgroundColor: col.code }}
                    title={col.name}
                  >
                    {activeColorIdx === idx && (
                      <span className="absolute inset-0 flex items-center justify-center text-[9px] text-white mix-blend-difference">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes Box selector */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs font-mono uppercase tracking-widest">
                <span className="text-neutral-400 dark:text-neutral-500 font-bold">Select size:</span>
                <span className="text-brand-dark dark:text-white font-medium">{selectedSize}</span>
              </div>
              <div className="flex gap-2.5">
                {product.sizes.map(sz => (
                  <button
                    key={sz}
                    onClick={() => {
                      setSelectedSize(sz);
                      setErrorMsg('');
                    }}
                    className={`w-12 h-11 border text-xs font-mono tracking-wider transition-all duration-150 active:scale-95 flex items-center justify-center ${
                      selectedSize === sz
                        ? 'bg-brand-dark text-white border-brand-dark dark:bg-white dark:text-brand-dark dark:border-white font-bold'
                        : 'border-neutral-200 hover:border-neutral-400 text-neutral-600 dark:text-neutral-400 dark:border-neutral-800'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Detail Specification Tabs switcher */}
            <div className="space-y-4 pt-4 border-t border-neutral-100 dark:border-neutral-900">
              <div className="flex gap-6 border-b border-neutral-100 dark:border-neutral-900 pb-2 text-xs font-mono uppercase tracking-widest">
                <button 
                  onClick={() => setActiveTab('details')}
                  className={`pb-1.5 border-b-2 transition-all cursor-pointer ${activeTab === 'details' ? 'border-brand-dark dark:border-white text-brand-dark dark:text-white font-bold' : 'border-transparent text-neutral-400'}`}
                >
                  Description
                </button>
                <button 
                  onClick={() => setActiveTab('specs')}
                  className={`pb-1.5 border-b-2 transition-all cursor-pointer ${activeTab === 'specs' ? 'border-brand-dark dark:border-white text-brand-dark dark:text-white font-bold' : 'border-transparent text-neutral-400'}`}
                >
                  Specifications
                </button>
              </div>

              {activeTab === 'details' ? (
                <div className="space-y-4 text-xs md:text-sm text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
                  <p>{product.description}</p>
                  <ul className="list-disc pl-5 space-y-1.5 text-neutral-400 font-mono text-[11px] leading-relaxed">
                    {product.features.map((f, i) => <li key={i}>{f}</li>)}
                  </ul>
                </div>
              ) : (
                <div className="space-y-2 text-xs font-mono text-neutral-500 dark:text-neutral-400">
                  {Object.entries(product.specifications).map(([k, v]) => (
                    <div key={k} className="flex justify-between py-2 border-b border-neutral-50 dark:border-neutral-900">
                      <span className="text-neutral-400 uppercase tracking-wider">{k}</span>
                      <span className="text-brand-dark dark:text-white font-medium">{v}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Action buttons footer block */}
          <div className="space-y-4 pt-6 border-t border-neutral-100 dark:border-neutral-900">
            {errorMsg && <p className="text-xs font-mono text-red-500 text-center">{errorMsg}</p>}
            
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className="flex-1 bg-brand-dark hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-brand-dark py-4.5 px-6 text-xs font-mono tracking-widest uppercase font-semibold flex items-center justify-center gap-2.5 transition-all duration-200 active:scale-95 disabled:opacity-50"
              >
                <ShoppingBag size={14} className={isAdding ? 'animate-bounce' : ''} />
                {isAdding ? "ADDING TO BAG..." : "ADD TO BAG"}
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className="p-4 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 text-neutral-600 dark:text-neutral-400 flex items-center justify-center transition-all duration-200 active:scale-95"
                title="Save to Wishlist"
              >
                <Heart 
                  size={16} 
                  className={isWishlisted ? 'fill-red-500 text-red-500' : ''} 
                />
              </button>
            </div>

            {/* Circular ethics badges */}
            <div className="flex justify-center items-center gap-6 text-[10px] font-mono uppercase text-neutral-400 tracking-wider pt-2 select-none">
              <div className="flex items-center gap-1.5"><Check size={11} className="text-green-500" /><span>Organic Knits</span></div>
              <div className="flex items-center gap-1.5"><Check size={11} className="text-green-500" /><span>Climate Neutral</span></div>
              <div className="flex items-center gap-1.5"><Check size={11} className="text-green-500" /><span>Circular Textile</span></div>
            </div>
          </div>

        </div>

      </div>

      {/* Related Products Grid */}
      <section className="space-y-10 border-t border-neutral-100 dark:border-neutral-900 pt-16 md:pt-24 select-none">
        <div className="text-center md:text-left space-y-1">
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-400">Capsule coordination</span>
          <h2 className="text-2xl md:text-3xl font-display font-light text-brand-dark dark:text-white tracking-tight">
            Style With
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {relatedProducts.map(prod => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 border-t border-neutral-100 dark:border-neutral-900 pt-16 md:pt-24 select-none">
        
        {/* Left: Review List (Cols: 7) */}
        <div className="lg:col-span-7 space-y-8">
          <h2 className="text-xl md:text-2xl font-display font-light text-brand-dark dark:text-white tracking-tight">
            Customer Dialogue ({product.reviews.length})
          </h2>

          {product.reviews.length === 0 ? (
            <p className="text-xs font-mono text-neutral-400 leading-relaxed py-4">
              There are currently no reviews on this piece. Be the first to start the dialogue below.
            </p>
          ) : (
            <div className="space-y-8 divide-y divide-neutral-100 dark:divide-neutral-900">
              {product.reviews.map((rev) => (
                <div key={rev.id} className="pt-6 space-y-3">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-brand-dark dark:text-white font-semibold uppercase">{rev.user_name}</span>
                    <span className="text-neutral-400">{rev.date}</span>
                  </div>
                  <div className="flex gap-1 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={11} className={i < rev.rating ? 'fill-amber-400' : 'text-neutral-200'} />
                    ))}
                  </div>
                  <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
                    {rev.comment}
                  </p>
                  {rev.variant_sku && (
                    <span className="block text-[10px] font-mono text-neutral-400">
                      Purchased Size: {rev.variant_sku.split('-')[3] || 'M'} • Style: {rev.variant_sku.split('-')[2] || 'Obsidian'}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Write Review Form (Cols: 5) */}
        <div className="lg:col-span-5 bg-neutral-50 dark:bg-neutral-900 p-6 md:p-8 border border-neutral-100 dark:border-neutral-800">
          <h3 className="text-lg font-display font-light text-brand-dark dark:text-white mb-6">
            Write a Review
          </h3>

          <form onSubmit={handleReviewSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono uppercase text-neutral-400">Your Name</label>
              <input
                type="text"
                required
                value={reviewName}
                onChange={(e) => setReviewName(e.target.value)}
                className="w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs px-4 py-3 outline-none focus:border-brand-dark dark:focus:border-white transition-colors text-brand-dark dark:text-white"
                placeholder="e.g. John Doe"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono uppercase text-neutral-400">Rating Score</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((score) => (
                  <button
                    key={score}
                    type="button"
                    onClick={() => setReviewRating(score)}
                    className="p-1 text-amber-400 hover:scale-110 transition-transform"
                  >
                    <Star size={18} className={score <= reviewRating ? 'fill-amber-400' : 'text-neutral-200'} />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono uppercase text-neutral-400">Feedback Review</label>
              <textarea
                required
                rows={4}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs px-4 py-3 outline-none focus:border-brand-dark dark:focus:border-white transition-colors text-brand-dark dark:text-white"
                placeholder="Share your thoughts about sizing, material density, and drape comfort..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-brand-dark dark:bg-white text-white dark:text-brand-dark py-3 px-6 text-xs font-mono uppercase tracking-widest font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity active:scale-95"
            >
              Submit review ledger
            </button>

            {submitSuccess && (
              <p className="text-xs font-mono text-green-600 text-center animate-pulse">
                Review submitted successfully for moderator approval.
              </p>
            )}
          </form>
        </div>

      </section>

      {/* Recently Viewed Shelf Grid */}
      {recentlyViewed.length > 1 && (
        <section className="space-y-10 border-t border-neutral-100 dark:border-neutral-900 pt-16 md:pt-24 select-none">
          <div className="text-center md:text-left space-y-1">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-400">Capsule memory</span>
            <h2 className="text-2xl md:text-3xl font-display font-light text-brand-dark dark:text-white tracking-tight">
              Recently Viewed Pieces
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {recentlyViewed.filter(p => p.id !== product.id).slice(0, 4).map(prod => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>
      )}

      {/* 4. Fullscreen Preview Modal */}
      <AnimatePresence>
        {showFullscreen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none bg-black/95">
            <motion.div
              className="absolute inset-0 cursor-zoom-out"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFullscreen(false)}
            />
            
            {/* Expanded image */}
            <motion.div
              className="relative max-w-4xl max-h-[90vh] overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <img
                src={images[activeImgIdx]}
                alt=""
                className="w-full h-full max-h-[85vh] object-contain"
              />
            </motion.div>

            {/* Absolute indicator */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-neutral-400 font-mono text-xs">
              {activeImgIdx + 1} / {images.length}
            </div>

            {/* Absolute close */}
            <button
              onClick={() => setShowFullscreen(false)}
              className="absolute top-6 right-6 p-2 text-neutral-400 hover:text-white transition-colors"
            >
              <Check size={24} className="rotate-45" />
            </button>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
export default ProductDetails;
