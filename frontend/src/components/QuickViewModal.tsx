import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, ShoppingBag } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const QuickViewModal: React.FC = () => {
  const { quickViewProduct, showQuickView, closeQuickView, addToCart, toggleWishlist, wishlist } = useApp();
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Reset indices when quickViewProduct changes
  useEffect(() => {
    if (quickViewProduct) {
      setSelectedColorIdx(0);
      setSelectedSize(quickViewProduct.sizes[1] || 'M'); // default size M
      setActiveImgIdx(0);
      setErrorMsg('');
    }
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const colors = product.colors;
  const currentColor = colors[selectedColorIdx];
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
      // Brief delay for visual satisfaction
      setTimeout(() => {
        setIsAdding(false);
        closeQuickView();
      }, 500);
    } catch (e) {
      setErrorMsg('Out of stock or unavailable');
      setIsAdding(false);
    }
  };

  return (
    <AnimatePresence>
      {showQuickView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 select-none">
          {/* Backdrop blur overlay */}
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeQuickView}
          />

          {/* Modal Container */}
          <motion.div
            className="relative w-full max-w-4xl bg-white dark:bg-neutral-950 shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] md:max-h-[85vh] border border-neutral-100 dark:border-neutral-900"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Close button */}
            <button
              onClick={closeQuickView}
              className="absolute top-4 right-4 z-30 p-2 text-neutral-400 hover:text-brand-dark dark:hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            {/* Left Column: Image Gallery */}
            <div className="w-full md:w-1/2 flex flex-col bg-neutral-50 dark:bg-neutral-900 overflow-hidden p-4 md:p-6">
              {/* Main Image View */}
              <div className="aspect-[3/4] w-full relative overflow-hidden bg-neutral-100 dark:bg-neutral-900 mb-4">
                <img
                  src={images[activeImgIdx]}
                  alt={product.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>

              {/* Thumbnails Row */}
              <div className="flex gap-2.5 overflow-x-auto no-scrollbar">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImgIdx(idx)}
                    className={`relative w-16 md:w-20 aspect-[3/4] bg-neutral-100 dark:bg-neutral-900 shrink-0 border ${
                      activeImgIdx === idx 
                        ? 'border-brand-dark dark:border-white' 
                        : 'border-transparent hover:border-neutral-300'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover object-top" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Details */}
            <div className="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto flex flex-col justify-between">
              <div>
                {/* Brand Collection */}
                <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-400 dark:text-neutral-500 block mb-2">
                  {product.collection}
                </span>

                {/* Name */}
                <h2 className="text-xl md:text-2xl font-display font-light text-brand-dark dark:text-white mb-3 tracking-tight">
                  {product.name}
                </h2>

                {/* Price */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-lg font-mono font-semibold text-brand-dark dark:text-white">
                    ${product.price}.00
                  </span>
                  {product.original_price && (
                    <span className="text-sm font-mono text-neutral-400 line-through">
                      ${product.original_price}.00
                    </span>
                  )}
                </div>

                {/* Divider */}
                <hr className="border-neutral-100 dark:border-neutral-900 mb-6" />

                {/* Swatches Selector */}
                <div className="space-y-3 mb-6">
                  <span className="text-xs font-mono tracking-wider uppercase text-neutral-400 dark:text-neutral-500">
                    Color: <span className="text-brand-dark dark:text-white font-medium font-sans ml-1">{currentColor.name}</span>
                  </span>
                  <div className="flex gap-2.5">
                    {colors.map((color, idx) => (
                      <button
                        key={color.name}
                        onClick={() => {
                          setSelectedColorIdx(idx);
                          setActiveImgIdx(0);
                        }}
                        className={`w-5 h-5 rounded-full border transition-all duration-200 ${
                          selectedColorIdx === idx 
                            ? 'border-brand-dark dark:border-white scale-110 ring-2 ring-offset-2 ring-neutral-400 dark:ring-offset-black' 
                            : 'border-neutral-300 dark:border-neutral-700 hover:scale-105'
                        }`}
                        style={{ backgroundColor: color.code }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Size Selector */}
                <div className="space-y-3 mb-8">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-mono tracking-wider uppercase text-neutral-400 dark:text-neutral-500">
                      Select Size: <span className="text-brand-dark dark:text-white font-medium ml-1">{selectedSize}</span>
                    </span>
                  </div>
                  <div className="flex gap-3">
                    {product.sizes.map((sz) => (
                      <button
                        key={sz}
                        onClick={() => {
                          setSelectedSize(sz);
                          setErrorMsg('');
                        }}
                        className={`min-w-12 h-10 text-xs font-mono tracking-wider border transition-all duration-200 active:scale-95 flex items-center justify-center ${
                          selectedSize === sz
                            ? 'bg-brand-dark text-white border-brand-dark dark:bg-white dark:text-brand-dark dark:border-white'
                            : 'border-neutral-200 hover:border-neutral-400 text-neutral-600 dark:text-neutral-400 dark:border-neutral-800'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4 pt-4 border-t border-neutral-100 dark:border-neutral-900 mt-auto">
                {errorMsg && (
                  <p className="text-xs font-mono text-red-500 text-center">{errorMsg}</p>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className="flex-1 bg-brand-dark hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-brand-dark py-4 px-6 text-xs font-mono tracking-widest uppercase font-semibold flex items-center justify-center gap-2.5 transition-all duration-200 active:scale-95 disabled:opacity-50"
                  >
                    <ShoppingBag size={14} className={isAdding ? "animate-bounce" : ""} />
                    {isAdding ? "ADDING TO BAG..." : "ADD TO BAG"}
                  </button>

                  <button
                    onClick={() => toggleWishlist(product)}
                    className="p-4 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 text-neutral-600 dark:text-neutral-400 flex items-center justify-center transition-all duration-200 active:scale-95"
                    title="Add to Wishlist"
                  >
                    <Heart 
                      size={15} 
                      className={isWishlisted ? 'fill-red-500 text-red-500' : ''} 
                    />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
export default QuickViewModal;
