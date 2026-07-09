import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="max-w-md mx-auto px-6 py-40 text-center space-y-8 select-none font-mono">
      <div className="flex justify-center text-neutral-300 dark:text-neutral-700 animate-spin" style={{ animationDuration: '20s' }}>
        <Compass size={56} strokeWidth={1} />
      </div>

      <div className="space-y-2">
        <h1 className="text-6xl font-display font-light text-brand-dark dark:text-white">404</h1>
        <p className="text-xs text-neutral-400 font-sans font-light uppercase tracking-widest">Garment Index Missing</p>
      </div>

      <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-sans font-light">
        The ledger path you requested is either archived or does not exist in our studio inventory.
      </p>

      <div className="pt-4">
        <Link
          to="/"
          className="bg-brand-dark dark:bg-white text-white dark:text-brand-dark px-8 py-3.5 text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2.5 transition-transform duration-200 active:scale-95"
        >
          <ArrowLeft size={14} />
          <span>Return to Studio</span>
        </Link>
      </div>
    </div>
  );
};
export default NotFound;
