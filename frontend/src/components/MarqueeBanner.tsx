import React from 'react';
import { motion } from 'motion/react';

export const MarqueeBanner: React.FC = () => {
  const items = [
    "FREE SHIPPING ON ORDERS OVER $100",
    "•",
    "COMPLIMENTARY ECO-FRIENDLY PACKAGING",
    "•",
    "PREMIUM 100% ORGANIC COTTON ONLY",
    "•",
    "LIMITED DROP - URBAN ESSENTIALS CO",
    "•",
    "MADE RESPONSIBLY IN PORTUGAL",
    "•"
  ];

  const repeatedItems = [...items, ...items, ...items];

  return (
    <div className="bg-brand-dark dark:bg-brand-beige text-white dark:text-brand-dark py-2.5 text-xs tracking-[0.2em] font-mono overflow-hidden whitespace-nowrap border-b border-neutral-200 dark:border-neutral-800 select-none relative z-40">
      <motion.div 
        className="inline-flex gap-8 px-4"
        animate={{ x: [0, -1000] }}
        transition={{
          repeat: Infinity,
          duration: 25,
          ease: "linear"
        }}
      >
        {repeatedItems.map((text, idx) => (
          <span 
            key={idx} 
            className={`inline-block ${text === '•' ? 'text-neutral-400 dark:text-neutral-600' : 'font-medium'}`}
          >
            {text}
          </span>
        ))}
      </motion.div>
    </div>
  );
};
export default MarqueeBanner;
