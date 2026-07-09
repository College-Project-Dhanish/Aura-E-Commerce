import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Compass, Sparkles, SlidersHorizontal } from 'lucide-react';

export const Collections: React.FC = () => {
  const collectionsData = [
    {
      title: "Essential Drop",
      subtitle: "The Foundation of Form",
      description: "A continuous study in heavy structures, dropping shoulders, and dense organic weaves. Engineered specifically for elegant daily drapes that retain their form throughout endless laundry cycles.",
      image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80",
      link: "/products?collection=Essential Drop"
    },
    {
      title: "Classic Minimalist",
      subtitle: "The Art of Restraint",
      description: "Sophisticated resort collaring, curved French plackets, and genuine mother-of-pearl details. Tailored exclusively from premium European linen flax and high-density Japanese Oxford weaves.",
      image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1000&q=80",
      link: "/products?collection=Classic Minimalist"
    },
    {
      title: "Urban Essentials",
      subtitle: "Seamless Sophistication",
      description: "Double-knit Peruvian Pima interlock structures designed for an incredibly soft hand-feel. Modern tailored lines that contour the chest while providing ample, breathable comfort at the waist.",
      image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=80",
      link: "/products?collection=Urban Essentials"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-28 md:py-36 space-y-24 md:space-y-36">
      
      {/* Editorial Page Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="text-xs font-mono uppercase tracking-[0.3em] text-neutral-400 block font-medium">
          Editorial Editions
        </span>
        <h1 className="text-4xl md:text-6xl font-display font-light text-brand-dark dark:text-white tracking-tight leading-tight">
          Seasonal Ledger
        </h1>
        <p className="text-sm md:text-base text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
          Each capsule represents an in-house study of material properties, weights, and structured drapes. Made in limited quantities using certified mills.
        </p>
      </div>

      {/* Alternating Collections Magazine Layout */}
      <div className="space-y-24 md:space-y-32">
        {collectionsData.map((col, idx) => {
          const isEven = idx % 2 === 0;
          return (
            <div 
              key={col.title}
              className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-20 items-center select-none`}
            >
              {/* Image Module */}
              <div className="w-full lg:w-1/2 overflow-hidden aspect-[4/5] bg-neutral-100 dark:bg-neutral-900 relative group">
                <motion.div
                  className="w-full h-full"
                  initial={{ opacity: 0, scale: 1.05 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                >
                  <img
                    src={col.image}
                    alt={col.title}
                    className="w-full h-full object-cover object-top transition-transform duration-1000 group-hover:scale-103"
                    loading="lazy"
                  />
                </motion.div>
                {/* Floating graphic overlay tag */}
                <div className="absolute top-6 left-6 z-10 font-mono text-[9px] tracking-widest uppercase bg-brand-dark text-white px-3 py-1.5 dark:bg-white dark:text-brand-dark">
                  No. 0{idx + 1} Edition
                </div>
              </div>

              {/* Description Content Module */}
              <div className="w-full lg:w-1/2 space-y-6 md:space-y-8">
                <div className="space-y-2.5">
                  <span className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-400 block">
                    {col.subtitle}
                  </span>
                  <h2 className="text-3xl md:text-5xl font-display font-light text-brand-dark dark:text-white tracking-tight">
                    {col.title}
                  </h2>
                </div>

                <p className="text-sm md:text-base text-neutral-500 dark:text-neutral-400 font-light leading-relaxed max-w-md">
                  {col.description}
                </p>

                <div className="pt-2">
                  <Link
                    to={col.link}
                    className="inline-flex items-center gap-3.5 group text-xs font-mono tracking-widest uppercase font-bold text-brand-dark dark:text-white"
                  >
                    <span>Browse capsule</span>
                    <motion.span
                      className="p-3.5 bg-neutral-100 dark:bg-neutral-900 group-hover:bg-brand-dark group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-brand-dark transition-all duration-300"
                    >
                      <ArrowRight size={14} />
                    </motion.span>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
export default Collections;
