import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function ErrorAlert({ message, className = '' }) {
  if (!message) return null;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-start gap-3 shadow-[0_2px_10px_-3px_rgba(220,38,38,0.1)]", className)}
    >
      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <span className="text-sm font-medium leading-relaxed">{message}</span>
    </motion.div>
  );
}
