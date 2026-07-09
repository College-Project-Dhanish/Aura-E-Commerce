import React from 'react';
import { motion } from 'framer-motion';

export default function LoadingSpinner({ size = '2.5rem', fullScreen = false }) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <motion.div
        className="rounded-full border-[3px] border-accent/20 border-t-accent"
        style={{ width: size, height: size }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8 w-full">
      {content}
    </div>
  );
}
