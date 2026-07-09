import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-50 dark:bg-neutral-980 text-brand-dark dark:text-neutral-200 border-t border-neutral-100 dark:border-neutral-900 select-none">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 md:gap-8 pb-16 border-b border-neutral-200/60 dark:border-neutral-900">
          
          {/* Column 1: Brand Intro */}
          <div className="lg:col-span-2 space-y-6">
            <Link 
              to="/" 
              className="font-display text-2xl tracking-[0.25em] font-medium uppercase text-brand-dark dark:text-white"
            >
              AURA
            </Link>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 font-light leading-relaxed max-w-sm">
              We design and construct luxury, structured garments for modern capsule closets. Driven by absolute minimalism, premium organic mills, and circular responsibility.
            </p>
            {/* Social icons */}
            <div className="flex gap-4 text-neutral-400 dark:text-neutral-600 pt-2">
              <a href="#" className="hover:text-brand-dark dark:hover:text-white transition-colors"><Instagram size={18} /></a>
              <a href="#" className="hover:text-brand-dark dark:hover:text-white transition-colors"><Facebook size={18} /></a>
              <a href="#" className="hover:text-brand-dark dark:hover:text-white transition-colors"><Twitter size={18} /></a>
            </div>
          </div>

          {/* Column 2: Collections */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-500 font-bold">
              Collections
            </h4>
            <ul className="space-y-2.5 text-xs font-medium tracking-wide">
              <li><Link to="/products?category=t-shirts" className="text-neutral-500 dark:text-neutral-400 hover:text-brand-dark dark:hover:text-white transition-colors">Premium T-Shirts</Link></li>
              <li><Link to="/products?category=shirts" className="text-neutral-500 dark:text-neutral-400 hover:text-brand-dark dark:hover:text-white transition-colors">Tailored Shirts</Link></li>
              <li><Link to="/collections" className="text-neutral-500 dark:text-neutral-400 hover:text-brand-dark dark:hover:text-white transition-colors">Essential Drop</Link></li>
              <li><Link to="/collections" className="text-neutral-500 dark:text-neutral-400 hover:text-brand-dark dark:hover:text-white transition-colors">Classic Minimalist</Link></li>
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-500 font-bold">
              Brand Support
            </h4>
            <ul className="space-y-2.5 text-xs font-medium tracking-wide">
              <li><Link to="/about" className="text-neutral-500 dark:text-neutral-400 hover:text-brand-dark dark:hover:text-white transition-colors">Our Studio Story</Link></li>
              <li><Link to="/contact" className="text-neutral-500 dark:text-neutral-400 hover:text-brand-dark dark:hover:text-white transition-colors">Contact Support</Link></li>
              <li><Link to="/profile" className="text-neutral-500 dark:text-neutral-400 hover:text-brand-dark dark:hover:text-white transition-colors">Your Account</Link></li>
              <li><Link to="/orders" className="text-neutral-500 dark:text-neutral-400 hover:text-brand-dark dark:hover:text-white transition-colors">Shipping & Returns</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact info */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-500 font-bold">
              Studio Address
            </h4>
            <ul className="space-y-3 text-xs text-neutral-500 dark:text-neutral-400 font-medium">
              <li className="flex items-start gap-2.5">
                <MapPin size={14} className="mt-0.5 text-neutral-400 shrink-0" />
                <span>104 Rue du Faubourg Saint-Honoré, 75008 Paris, France</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={14} className="text-neutral-400 shrink-0" />
                <span>+33 1 40 07 30 00</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={14} className="text-neutral-400 shrink-0" />
                <span>studio@aurafashion.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono uppercase tracking-widest text-neutral-400">
          <p>© 2026 AURA STUDIO LTD. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-brand-dark dark:hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-brand-dark dark:hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
export default Footer;
