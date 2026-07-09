import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, toggleWishlist, wishlist, openQuickView, viewProduct } = useApp();
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const selectedColor = product.colors[selectedColorIdx];
  const displayedImage = selectedColor.images[0];
  const secondaryImage = selectedColor.images[1] || selectedColor.images[0];

  const isWishlisted = wishlist.some(item => item.id === product.id);

  // Shrinking effect coordinates
  const [flyEffect, setFlyEffect] = useState<{ x: number; y: number } | null>(null);

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);

    // Get trigger element position to animate from
    const rect = e.currentTarget.getBoundingClientRect();
    setFlyEffect({ x: rect.left, y: rect.top });

    // Premium delay to allow shrinking visual representation
    try {
      // Add standard default size (M) and selected color to cart
      await addToCart(product, selectedColor.name, product.sizes[1] || 'M', 1);
    } catch (err) {
      console.error(err);
    }

    setTimeout(() => {
      setIsAdding(false);
      setFlyEffect(null);
    }, 1000);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openQuickView(product);
  };

  return (
    <motion.div
      className="group relative flex flex-col bg-white dark:bg-neutral-950 transition-colors duration-300 border border-neutral-100 dark:border-neutral-900"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Flying Clone Thumbnail for Add to Cart animation */}
      <AnimatePresence>
        {flyEffect && (
          <motion.img
            src={displayedImage}
            alt="fly clone"
            className="fixed z-50 pointer-events-none w-16 h-20 object-cover border border-neutral-200 dark:border-neutral-800"
            initial={{ 
              top: flyEffect.y, 
              left: flyEffect.x, 
              scale: 1, 
              opacity: 0.9,
              borderRadius: "0px"
            }}
            animate={{ 
              top: 24, // Matches general Cart icon layout height
              left: window.innerWidth - 120, // Approximate navbar cart position
              scale: 0.1, 
              opacity: 0.1,
              rotate: 45
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
          />
        )}
      </AnimatePresence>

      {/* Product Image Area */}
      <div className="relative aspect-[3/4] w-full bg-neutral-50 dark:bg-neutral-900 overflow-hidden select-none">
        <Link 
          to={`/products/${product.slug}`}
          onClick={() => viewProduct(product)}
          className="block w-full h-full"
        >
          {/* Main Image */}
          <img
            src={hovered ? secondaryImage : displayedImage}
            alt={product.name}
            className="w-full h-full object-cover object-top transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] transform group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.is_new && (
            <span className="bg-brand-dark dark:bg-white text-white dark:text-brand-dark px-2.5 py-1 text-[9px] font-mono tracking-widest uppercase font-medium">
              NEW
            </span>
          )}
          {product.is_best_seller && (
            <span className="bg-brand-beige text-brand-dark px-2.5 py-1 text-[9px] font-mono tracking-widest uppercase font-medium border border-neutral-200">
              BEST SELLER
            </span>
          )}
        </div>

        {/* Floating Quick Action Overlay */}
        <div className="absolute bottom-4 left-4 right-4 flex gap-2 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] z-20">
          <button
            onClick={handleQuickAdd}
            disabled={isAdding}
            className="flex-1 bg-brand-dark hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-brand-dark py-3 px-4 text-xs font-mono tracking-widest uppercase font-medium flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 shadow-lg shadow-neutral-900/10 dark:shadow-black/20"
          >
            <ShoppingBag size={14} className={isAdding ? "animate-bounce" : ""} />
            {isAdding ? "ADDING..." : "QUICK ADD"}
          </button>
          
          <button
            onClick={handleQuickViewClick}
            className="bg-white hover:bg-neutral-50 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-brand-dark dark:text-white p-3 border border-neutral-100 dark:border-neutral-800 flex items-center justify-center transition-all duration-200 active:scale-95 shadow-lg"
            title="Quick View"
          >
            <Eye size={14} />
          </button>
        </div>

        {/* Wishlist Heart Overlay */}
        <button
          onClick={handleWishlistClick}
          className="absolute top-3 right-3 z-10 p-2 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-sm rounded-full text-brand-dark dark:text-white transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-90 shadow-md"
        >
          <motion.div
            animate={{ scale: isWishlisted ? [1, 1.3, 1] : 1 }}
            transition={{ duration: 0.3 }}
          >
            <Heart 
              size={15} 
              className={`transition-colors duration-200 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-neutral-600 dark:text-neutral-400'}`} 
            />
          </motion.div>
        </button>
      </div>

      {/* Product Description Block */}
      <div className="pt-4 pb-2 flex flex-col flex-grow">
        {/* Colors Swatches Row */}
        <div className="flex gap-2 mb-2.5">
          {product.colors.map((color, idx) => (
            <button
              key={color.name}
              onClick={(e) => {
                e.preventDefault();
                setSelectedColorIdx(idx);
              }}
              onMouseEnter={() => setSelectedColorIdx(idx)}
              className={`w-3.5 h-3.5 rounded-full border transition-all duration-300 ${
                selectedColorIdx === idx 
                  ? 'border-brand-dark dark:border-white scale-125 ring-1 ring-offset-1 ring-neutral-400 dark:ring-offset-black' 
                  : 'border-neutral-300 dark:border-neutral-700 hover:scale-110'
              }`}
              style={{ backgroundColor: color.code }}
              title={color.name}
            />
          ))}
        </div>

        {/* Collection & Category */}
        <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-1">
          {product.collection} • {product.category}
        </span>

        {/* Title */}
        <Link 
          to={`/products/${product.slug}`}
          onClick={() => viewProduct(product)}
          className="font-display font-medium text-sm text-neutral-800 dark:text-neutral-200 hover:text-neutral-500 dark:hover:text-neutral-400 transition-colors mb-1.5 line-clamp-1"
        >
          {product.name}
        </Link>

        {/* Price Tag */}
        <div className="flex items-center gap-2 mt-auto">
          <span className="text-sm font-mono text-brand-dark dark:text-white font-semibold">
            ${product.price}.00
          </span>
          {product.original_price && (
            <span className="text-xs font-mono text-neutral-400 line-through">
              ${product.original_price}.00
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
export default ProductCard;
