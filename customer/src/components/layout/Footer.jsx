import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-primary text-white pt-24 pb-10 mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-20 mb-20">
          <div className="md:col-span-1 lg:col-span-1">
            <Link to="/" className="text-3xl font-bold tracking-tighter text-white inline-block mb-6">
              AURA<span className="text-accent">.</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-8 pr-4">
              Premium fashion for the modern individual. Handcrafted with precision, designed for elegance. Experience true luxury.
            </p>
            <div className="flex gap-4 text-xs font-bold tracking-widest uppercase">
              <a href="#" className="hover:text-accent transition-colors">IG</a>
              <a href="#" className="hover:text-accent transition-colors">TW</a>
              <a href="#" className="hover:text-accent transition-colors">FB</a>
            </div>
          </div>
          
          <div>
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase mb-8 text-white">Shop</h4>
            <ul className="flex flex-col gap-4">
              <li><Link to="/products?category=tshirts" className="text-gray-400 hover:text-accent transition-colors text-sm">Premium T-Shirts</Link></li>
              <li><Link to="/products?category=shirts" className="text-gray-400 hover:text-accent transition-colors text-sm">Luxury Shirts</Link></li>
              <li><Link to="/products?collection=new" className="text-gray-400 hover:text-accent transition-colors text-sm">New Arrivals</Link></li>
              <li><Link to="/products?collection=bestsellers" className="text-gray-400 hover:text-accent transition-colors text-sm">Best Sellers</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase mb-8 text-white">Support</h4>
            <ul className="flex flex-col gap-4">
              <li><Link to="#" className="text-gray-400 hover:text-accent transition-colors text-sm">FAQ</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-accent transition-colors text-sm">Shipping & Returns</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-accent transition-colors text-sm">Size Guide</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-accent transition-colors text-sm">Contact Us</Link></li>
            </ul>
          </div>
          
          <div className="md:col-span-1">
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase mb-8 text-white">Newsletter</h4>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">Subscribe to receive updates, access to exclusive deals, and more.</p>
            <div className="relative">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full bg-transparent border-b border-white/20 px-0 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-accent transition-colors rounded-none"
              />
              <button className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-white hover:text-accent transition-colors">
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs">
            &copy; {new Date().getFullYear()} Aura E-Commerce. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-gray-500">
            <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
