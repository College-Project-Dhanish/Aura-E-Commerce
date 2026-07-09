import React from 'react';

export const SkeletonLoader: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-6 md:gap-x-8">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="space-y-4 animate-pulse">
          {/* Card Image Area */}
          <div className="bg-neutral-100 dark:bg-neutral-900 aspect-[3/4] w-full rounded-none" />
          
          {/* Swatches block */}
          <div className="flex gap-2 pt-1">
            <div className="w-4 h-4 rounded-full bg-neutral-100 dark:bg-neutral-900" />
            <div className="w-4 h-4 rounded-full bg-neutral-100 dark:bg-neutral-900" />
            <div className="w-4 h-4 rounded-full bg-neutral-100 dark:bg-neutral-900" />
          </div>
          
          {/* Title and metadata block */}
          <div className="space-y-2">
            <div className="h-4 bg-neutral-100 dark:bg-neutral-900 w-3/4 rounded-sm" />
            <div className="h-3 bg-neutral-100 dark:bg-neutral-900 w-1/2 rounded-sm" />
            <div className="h-4 bg-neutral-100 dark:bg-neutral-900 w-1/4 rounded-sm" />
          </div>
        </div>
      ))}
    </div>
  );
};
export default SkeletonLoader;
