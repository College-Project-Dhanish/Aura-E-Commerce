import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, ArrowRight, Check } from 'lucide-react';
import { newsletterService } from '../services/api';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    try {
      const res = await newsletterService.subscribe(email);
      setStatus('success');
      setMessage(res.message || 'Thank you for joining our inner circle.');
      setEmail('');
    } catch (err: any) {
      setStatus('error');
      setMessage(err?.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <section className="relative py-24 md:py-32 px-6 overflow-hidden bg-gradient-to-tr from-brand-cream to-brand-beige dark:from-neutral-950 dark:to-neutral-900 border-t border-b border-neutral-100 dark:border-neutral-900 select-none">
      
      {/* Premium Floating Shapes with micro-motion */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 dark:opacity-10">
        <motion.div 
          className="absolute top-10 left-10 w-64 h-64 rounded-full bg-yellow-100 dark:bg-yellow-900/10 blur-3xl"
          animate={{ 
            x: [0, 30, 0],
            y: [0, -20, 0] 
          }}
          transition={{ 
            duration: 12, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-10 right-20 w-80 h-80 rounded-full bg-blue-100 dark:bg-blue-900/10 blur-3xl"
          animate={{ 
            x: [0, -40, 0],
            y: [0, 30, 0] 
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="max-w-3xl mx-auto text-center relative z-10 space-y-8">
        {/* Title */}
        <div className="space-y-4">
          <motion.span 
            className="text-xs font-mono uppercase tracking-[0.3em] text-neutral-500"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Stay Connected
          </motion.span>
          <motion.h2 
            className="text-3xl md:text-5xl font-display font-light tracking-tight text-brand-dark dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Subscribe to our Inner Circle
          </motion.h2>
          <motion.p 
            className="text-sm md:text-base text-neutral-500 dark:text-neutral-400 font-light max-w-lg mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Receive early access to seasonal capsule collection releases, exclusive pricing promotions, and editorial stories from our studio.
          </motion.p>
        </div>

        {/* Input Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-md mx-auto"
        >
          <form onSubmit={handleSubmit} className="relative flex items-center bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus-within:border-brand-dark dark:focus-within:border-white transition-colors duration-300">
            <div className="pl-4 text-neutral-400">
              <Mail size={16} />
            </div>
            
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === 'error') setStatus('idle');
              }}
              placeholder="Enter your email address"
              className="w-full py-4 px-3 text-sm bg-transparent outline-none text-brand-dark dark:text-white placeholder-neutral-400"
              disabled={status === 'loading' || status === 'success'}
            />

            <button
              type="submit"
              disabled={status === 'loading' || status === 'success'}
              className="bg-brand-dark dark:bg-white text-white dark:text-brand-dark h-full py-4 px-6 text-xs font-mono tracking-widest uppercase font-semibold flex items-center gap-2 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors active:scale-95 disabled:opacity-50"
            >
              {status === 'loading' ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : status === 'success' ? (
                <Check size={14} />
              ) : (
                <>
                  <span>Join</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          {/* Messages */}
          <AnimatePresence mode="wait">
            {message && (
              <motion.p
                key={message}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`text-xs mt-3 font-mono ${
                  status === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-500'
                }`}
              >
                {message}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};
export default Newsletter;
