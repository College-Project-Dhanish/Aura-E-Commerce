import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function HomePage() {
  return (
    <div className="flex flex-col w-full overflow-hidden -mt-[80px]">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden bg-primary">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-luminosity"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent"></div>
        
        <motion.div 
          className="relative z-10 text-center px-6 max-w-5xl mx-auto mt-20"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <motion.h1 variants={fadeIn} className="text-6xl md:text-8xl lg:text-[140px] font-bold text-white tracking-tighter mb-4 leading-none">
            DEFINE YOUR <br/><span className="luxury-text-gradient">AURA.</span>
          </motion.h1>
          <motion.p variants={fadeIn} className="text-lg md:text-xl text-gray-300 font-light mb-12 max-w-2xl mx-auto leading-relaxed">
            Discover our latest collection of premium, handcrafted garments designed for the modern visionary.
          </motion.p>
          <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/products" className="bg-white text-primary px-10 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all flex items-center gap-3 hover:gap-5 shadow-xl">
              Explore Collection <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/products?category=tshirts" className="px-10 py-4 rounded-full font-semibold text-white border border-white/30 hover:bg-white/10 transition-all backdrop-blur-sm">
              View T-Shirts
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Categories (Magazine Style) */}
      <section className="py-32 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row gap-12 lg:gap-24 items-center mb-32"
          >
            <div className="flex-1 space-y-8">
              <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-primary">
                THE ESSENTIALS
              </h2>
              <div className="w-24 h-1 luxury-gradient"></div>
              <p className="text-muted text-lg md:text-xl leading-relaxed max-w-md font-light">
                Elevate your everyday wardrobe with our signature premium t-shirts. Crafted from the finest cotton for unparalleled comfort and a perfect drape.
              </p>
              <Link to="/products?category=tshirts" className="inline-flex items-center gap-3 text-primary font-bold uppercase tracking-widest hover:text-accent transition-colors group mt-4 text-sm">
                Shop T-Shirts <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
            <div className="flex-1 w-full aspect-[4/5] relative rounded-3xl overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] group">
              <img src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1780&auto=format&fit=crop" alt="Premium T-Shirts" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s]" />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row-reverse gap-12 lg:gap-24 items-center"
          >
            <div className="flex-1 space-y-8 md:pl-12">
              <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-primary">
                REFINED <br/>TAILORING
              </h2>
              <div className="w-24 h-1 luxury-gradient"></div>
              <p className="text-muted text-lg md:text-xl leading-relaxed max-w-md font-light">
                Make a statement with our luxury shirts. Meticulous stitching, premium fabrics, and a fit that commands attention in any room.
              </p>
              <Link to="/products?category=shirts" className="inline-flex items-center gap-3 text-primary font-bold uppercase tracking-widest hover:text-accent transition-colors group mt-4 text-sm">
                Shop Shirts <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
            <div className="flex-1 w-full aspect-[4/5] relative rounded-3xl overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] group">
              <img src="https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?q=80&w=1888&auto=format&fit=crop" alt="Luxury Shirts" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s]" />
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Brand Statement */}
      <section className="py-32 bg-primary text-white text-center px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl bg-accent/5 rounded-full blur-[100px]"></div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto relative z-10"
        >
          <span className="text-accent text-sm font-bold tracking-[0.3em] uppercase mb-8 block">Our Philosophy</span>
          <h2 className="text-4xl md:text-6xl font-light leading-tight mb-12 font-serif italic">
            "True luxury is not just what you wear, it is how you feel when you wear it."
          </h2>
          <div className="w-16 h-px bg-white/20 mx-auto"></div>
        </motion.div>
      </section>
    </div>
  );
}
