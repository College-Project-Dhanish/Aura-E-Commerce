import React from 'react';
import { motion } from 'motion/react';
import { Compass, Sparkles, Check } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-28 md:py-36 space-y-24 md:space-y-36">
      
      {/* Editorial Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="text-xs font-mono uppercase tracking-[0.3em] text-neutral-400 block font-medium">
          Our Ledger
        </span>
        <h1 className="text-4xl md:text-6xl font-display font-light text-brand-dark dark:text-white tracking-tight leading-tight">
          Studio Philosophy
        </h1>
        <p className="text-sm md:text-base text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
          Founded in 2026, AURA was built on a simple, singular premise: to establish luxury, structural garments for modern capsule closets.
        </p>
      </div>

      {/* Large Banner Grid */}
      <div className="aspect-[21/9] w-full bg-neutral-100 overflow-hidden relative select-none">
        <img
          src="https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1920&q=80"
          alt="Linen Studio Story"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Magazine Content Block: Split Text Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-start select-none">
        
        <div className="space-y-6">
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 block">
            Craftsmanship First
          </span>
          <h2 className="text-2xl md:text-4xl font-display font-light text-brand-dark dark:text-white tracking-tight leading-tight">
            We do not follow calendar trends. We drop singular capsules.
          </h2>
          <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed font-light">
            Typical fashion corporations operate on 52 micro-seasons a year, creating low-density disposable products that stack up in landfill sites. AURA operates exclusively on capsule drops. We design garments to look outstanding years from now, focusing purely on architectural forms, double-knit weights, and custom dye treatments.
          </p>
        </div>

        <div className="space-y-6">
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 block">
            Ethical Sourcing
          </span>
          <h2 className="text-2xl md:text-4xl font-display font-light text-brand-dark dark:text-white tracking-tight leading-tight">
            Tailored from GOTS organic mills and Italian linen flax.
          </h2>
          <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed font-light">
            Our supply chains are fully certified under Global Organic Textile Standard (GOTS) parameters. All our heavy organic cotton is ethically milled in Portugal under strict fair-wage codes. Our linen is sourced from family-run farm flaxes in northern Italy, woven on traditional looms, and garment-dyed to achieve an incredibly washed hand-feel.
          </p>
        </div>

      </div>

      {/* Circular Quality Standards */}
      <div className="bg-neutral-50 dark:bg-neutral-900 p-8 md:p-12 border border-neutral-100 dark:border-neutral-800 grid grid-cols-1 md:grid-cols-3 gap-8 text-center select-none">
        <div className="space-y-3">
          <div className="flex justify-center text-green-500"><Check size={24} /></div>
          <h3 className="font-display text-lg font-medium text-brand-dark dark:text-white">Circular Lifespan</h3>
          <p className="text-xs text-neutral-400 leading-relaxed max-w-xs mx-auto">Every piece features double-needle stitching and reinforced ribs to protect against stretching and collar warping.</p>
        </div>
        <div className="space-y-3">
          <div className="flex justify-center text-green-500"><Check size={24} /></div>
          <h3 className="font-display text-lg font-medium text-brand-dark dark:text-white">100% Traceability</h3>
          <p className="text-xs text-neutral-400 leading-relaxed max-w-xs mx-auto">We trace every step from seed harvesting to thread spinning, offering complete manufacturing accountability.</p>
        </div>
        <div className="space-y-3">
          <div className="flex justify-center text-green-500"><Check size={24} /></div>
          <h3 className="font-display text-lg font-medium text-brand-dark dark:text-white">Fair labor commitment</h3>
          <p className="text-xs text-neutral-400 leading-relaxed max-w-xs mx-auto">Our mills are certified under ethical workspace guidelines, ensuring safe work conditions and living salaries.</p>
        </div>
      </div>

    </div>
  );
};
export default About;
