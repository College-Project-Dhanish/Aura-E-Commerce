import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, TrendingUp, Compass } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { catalogService } from '../services/api';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import Countdown from '../components/Countdown';
import Newsletter from '../components/Newsletter';

export const Home: React.FC = () => {
  const { openQuickView } = useApp();
  const [featured, setFeatured] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);

  useEffect(() => {
    // Fetch products categorized by flags
    const loadProducts = async () => {
      try {
        const all = await catalogService.getProducts();
        setFeatured(all.slice(0, 3));
        setNewArrivals(all.filter(p => p.is_new).slice(0, 4));
        bestSellers.length === 0 && setBestSellers(all.filter(p => p.is_best_seller).slice(0, 4));
      } catch (err) {
        console.error(err);
      }
    };
    loadProducts();
  }, []);

  return (
    <div className="space-y-24 md:space-y-32">
      
      {/* 1. Fullscreen Parallax Hero Banner */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black select-none">
        {/* Parallax Background */}
        <div className="absolute inset-0 z-0">
          <motion.div
            className="w-full h-full bg-cover bg-center opacity-65"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1920&q=80')`,
            }}
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: 'easeOut' }}
          />
        </div>

        {/* Text Reveal & Animations */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white space-y-8">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-xs md:text-sm font-mono uppercase tracking-[0.4em] text-neutral-300 block font-medium"
          >
            Aura Premium Clothing Studio
          </motion.span>

          <h1 className="text-4xl md:text-7xl lg:text-8xl font-display font-light tracking-tight leading-none text-brand-beige max-w-4xl mx-auto">
            <motion.span
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="block"
            >
              Constructed
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="block font-semibold"
            >
              Minimalism
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-sm md:text-base text-neutral-300 font-light max-w-md mx-auto leading-relaxed"
          >
            Luxury daily essentials tailored from high-density organic textiles. Made for lasting durability and timeless proportion.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link
              to="/products"
              className="w-full sm:w-auto bg-white text-brand-dark px-8 py-4 text-xs font-mono tracking-widest uppercase font-semibold flex items-center justify-center gap-2.5 transition-all duration-200 active:scale-95 hover:bg-neutral-100 shadow-xl"
            >
              <span>Explore shop</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              to="/collections"
              className="w-full sm:w-auto bg-transparent border border-white text-white px-8 py-4 text-xs font-mono tracking-widest uppercase font-semibold flex items-center justify-center gap-2.5 transition-all duration-200 active:scale-95 hover:bg-white/10"
            >
              View Collections
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center gap-2 cursor-pointer select-none">
          <span className="text-[9px] font-mono tracking-widest text-neutral-400 uppercase">Scroll down</span>
          <motion.div 
            className="w-1.5 h-6 border border-neutral-400 rounded-full flex justify-center p-0.5"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="w-1 h-1.5 bg-neutral-400 rounded-full" />
          </motion.div>
        </div>
      </section>

      {/* 2. Editorial Magazine-Style Featured Collections */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Large Text block */}
          <div className="lg:col-span-5 space-y-6 md:space-y-8">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-400 block font-medium">
              Capsule drops
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-light text-brand-dark dark:text-white leading-tight tracking-tight">
              A study in structured weights & natural linen.
            </h2>
            <p className="text-sm md:text-base text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
              Our latest drop features heavyweight 300GSM custom cotton knits combined with garment-dyed breathable Italian linens. Developed for comfortable utility throughout hot seasons.
            </p>
            <div className="pt-2">
              <Link
                to="/collections"
                className="inline-flex items-center gap-3 group text-xs font-mono tracking-widest uppercase font-bold text-brand-dark dark:text-white"
              >
                <span>Read Collection Editorial</span>
                <motion.span
                  className="p-3 bg-neutral-50 dark:bg-neutral-900 group-hover:bg-brand-dark group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-brand-dark transition-all duration-300"
                >
                  <ArrowRight size={14} />
                </motion.span>
              </Link>
            </div>
          </div>

          {/* Right Bento Gallery Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="aspect-[3/4] bg-neutral-100 dark:bg-neutral-900 relative overflow-hidden group">
              <img
                src="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80"
                alt="White linen series"
                className="w-full h-full object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <span className="text-white text-xs font-mono uppercase tracking-widest">Minimalist Essentials</span>
              </div>
            </div>
            
            <div className="aspect-[3/4] bg-neutral-100 dark:bg-neutral-900 relative overflow-hidden group translate-y-0 sm:translate-y-8">
              <img
                src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80"
                alt="Organic cotton series"
                className="w-full h-full object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <span className="text-white text-xs font-mono uppercase tracking-widest font-medium">Summer Drop Co</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. New Arrivals Carousel Grid */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-baseline justify-between gap-4 mb-10 border-b border-neutral-100 dark:border-neutral-900 pb-5">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-400 font-semibold block">
              Recent Drops
            </span>
            <h2 className="text-2xl md:text-3xl font-display font-light tracking-tight text-brand-dark dark:text-white">
              The New Arrivals
            </h2>
          </div>
          <Link
            to="/products"
            className="text-xs font-mono tracking-wider uppercase font-semibold text-neutral-400 hover:text-brand-dark dark:hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <span>View all products</span>
            <ArrowRight size={12} />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {newArrivals.map(prod => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* 4. Promotional Flash Drop Section (Countdown Banner) */}
      <section className="bg-brand-beige dark:bg-neutral-950 border-t border-b border-neutral-200/50 dark:border-neutral-900 py-16 md:py-20 select-none">
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-12">
          
          <div className="space-y-4 max-w-md text-center lg:text-left">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-400 font-bold block">
              Promotional drop
            </span>
            <h3 className="text-2xl md:text-3xl font-display font-light text-brand-dark dark:text-white leading-tight">
              Summer Capsule Pre-sale: Exclusive Access Ends Soon
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
              Use code <strong className="font-mono text-brand-dark dark:text-white">PREMIUM20</strong> for 20% off all pre-ordered items. Complimentary express delivery globally.
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 shrink-0 bg-white dark:bg-neutral-900 p-8 md:p-10 border border-neutral-100 dark:border-neutral-800 shadow-md">
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">Timer count left</span>
            <Countdown />
          </div>

        </div>
      </section>

      {/* 5. Best Sellers Section */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-baseline justify-between gap-4 mb-10 border-b border-neutral-100 dark:border-neutral-900 pb-5">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-400 font-semibold block">
              Curated Staples
            </span>
            <h2 className="text-2xl md:text-3xl font-display font-light tracking-tight text-brand-dark dark:text-white">
              The Best Sellers
            </h2>
          </div>
          <Link
            to="/products"
            className="text-xs font-mono tracking-wider uppercase font-semibold text-neutral-400 hover:text-brand-dark dark:hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <span>View best sellers</span>
            <ArrowRight size={12} />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {newArrivals.slice().reverse().map(prod => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* 6. Instagram-Style Editorial Grid */}
      <section className="max-w-7xl mx-auto px-6 select-none pb-12">
        <div className="text-center space-y-2 mb-12">
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-400">Curated styling</span>
          <h2 className="text-2xl md:text-3xl font-display font-light tracking-tight text-brand-dark dark:text-white">
            Shared on Studio Ledger
          </h2>
          <p className="text-xs font-mono text-neutral-400">@AURAFASHIONSTUDIO</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="aspect-square bg-neutral-100 relative overflow-hidden group">
            <img 
              src="https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=600&q=80" 
              alt="Insta 1" 
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" 
            />
          </div>
          <div className="aspect-square bg-neutral-100 relative overflow-hidden group">
            <img 
              src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80" 
              alt="Insta 2" 
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" 
            />
          </div>
          <div className="aspect-square bg-neutral-100 relative overflow-hidden group">
            <img 
              src="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80" 
              alt="Insta 3" 
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" 
            />
          </div>
          <div className="aspect-square bg-neutral-100 relative overflow-hidden group">
            <img 
              src="https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80" 
              alt="Insta 4" 
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" 
            />
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <Newsletter />
    </div>
  );
};
export default Home;
