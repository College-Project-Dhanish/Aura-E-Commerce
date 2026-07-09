import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function Card({ children, className = '', noPadding = false, hoverEffect = false }) {
  const CardComponent = hoverEffect ? motion.div : 'div';
  const motionProps = hoverEffect ? {
    whileHover: { y: -4, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)" },
    transition: { duration: 0.3, ease: "easeOut" }
  } : {};

  return (
    <CardComponent 
      className={cn(
        "bg-white rounded-3xl border border-border shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] overflow-hidden",
        !noPadding && "p-6 sm:p-8",
        className
      )}
      {...motionProps}
    >
      {children}
    </CardComponent>
  );
}
