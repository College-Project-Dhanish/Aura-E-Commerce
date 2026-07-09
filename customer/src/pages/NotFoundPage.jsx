import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-lg mx-auto"
      >
        <h1 className="text-[8rem] md:text-[10rem] font-bold tracking-tighter text-primary leading-none mb-2">404</h1>
        <div className="w-16 h-1 bg-accent mx-auto mb-8"></div>
        <h2 className="text-3xl font-bold tracking-tight text-primary mb-4">Page Not Found</h2>
        <p className="text-muted text-lg font-light mb-10 leading-relaxed">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link to="/">
          <Button variant="primary" size="lg" className="px-10 uppercase tracking-widest shadow-xl shadow-primary/20 hover:shadow-primary/30">
            <ArrowLeft className="w-4 h-4 mr-2" /> Return Home
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
