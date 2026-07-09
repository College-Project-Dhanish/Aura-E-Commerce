import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function Input({ label, error, className = '', ...props }) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={cn("relative flex flex-col gap-1.5 w-full", className)}>
      {label && (
        <label className={cn(
          "text-sm font-medium transition-colors px-1",
          isFocused ? "text-primary" : "text-text",
          error ? "text-red-500" : ""
        )}>
          {label}
        </label>
      )}
      <div className="relative">
        <input 
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          className={cn(
            "w-full rounded-xl border bg-white px-4 py-3.5 text-sm transition-all duration-200 outline-none",
            "placeholder:text-muted/60",
            error 
              ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20" 
              : "border-border focus:border-primary focus:ring-2 focus:ring-primary/10",
            props.disabled && "bg-secondary text-muted cursor-not-allowed"
          )} 
          {...props} 
        />
      </div>
      {error && (
        <motion.span 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-500 px-1"
        >
          {error}
        </motion.span>
      )}
    </div>
  );
}
