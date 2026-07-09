import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  isLoading,
  ...props 
}) {
  const baseStyles = "inline-flex items-center justify-center rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 overflow-hidden relative";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary/90 focus:ring-primary shadow-sm",
    secondary: "bg-secondary text-primary hover:bg-secondary/80 focus:ring-primary border border-border",
    accent: "luxury-gradient text-white hover:opacity-90 focus:ring-accent shadow-md",
    outline: "border-2 border-primary text-primary hover:bg-primary/5 focus:ring-primary",
    ghost: "text-primary hover:bg-primary/5 focus:ring-primary",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500",
  };
  
  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3.5 text-base",
  };

  return (
    <motion.button 
      whileHover={{ scale: props.disabled || isLoading ? 1 : 1.02, y: props.disabled || isLoading ? 0 : -1 }}
      whileTap={{ scale: props.disabled || isLoading ? 1 : 0.98 }}
      className={cn(baseStyles, variants[variant], sizes[size], (props.disabled || isLoading) && "opacity-60 cursor-not-allowed", className)} 
      disabled={isLoading || props.disabled} 
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : null}
      <span className={cn("relative z-10 flex items-center justify-center gap-2", isLoading && "opacity-0 absolute")}>
        {children}
      </span>
    </motion.button>
  );
}
