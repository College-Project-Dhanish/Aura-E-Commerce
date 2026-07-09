import React from 'react';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';
import { Heart, ArrowLeft, ShoppingBag } from 'lucide-react';

export const Wishlist: React.FC = () => {
  const { wishlist } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-6 py-28 md:py-36 min-h-[70vh]">
      
      {/* Header */}
      <div className="border-b border-neutral-100 dark:border-neutral-900 pb-6 mb-12 text-center md:text-left space-y-1">
        <span className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-400">Your Vault</span>
        <h1 className="text-3xl md:text-5xl font-display font-light text-brand-dark dark:text-white tracking-tight">
          Saved Wishlist
        </h1>
        <p className="text-xs font-mono text-neutral-400">Total Items Saved: {wishlist.length}</p>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-24 space-y-6 max-w-md mx-auto select-none">
          <div className="flex justify-center text-neutral-300 dark:text-neutral-700">
            <Heart size={48} strokeWidth={1} />
          </div>
          <h2 className="font-display text-2xl font-light text-brand-dark dark:text-white">Your wishlist is empty</h2>
          <p className="text-xs font-mono text-neutral-400 leading-relaxed">
            Browse our curated collections and save your favorite Shirts & T-Shirts for instant style tracking.
          </p>
          <div className="pt-2">
            <Link
              to="/products"
              className="bg-brand-dark dark:bg-white text-white dark:text-brand-dark px-8 py-4 text-xs font-mono tracking-widest uppercase font-semibold flex items-center justify-center gap-2.5 transition-transform duration-200 active:scale-95 hover:opacity-90 shadow-lg"
            >
              <ArrowLeft size={14} />
              <span>Explore collection</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {wishlist.map(prod => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      )}

    </div>
  );
};
export default Wishlist;
