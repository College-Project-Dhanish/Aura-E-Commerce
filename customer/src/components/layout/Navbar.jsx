import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, User, LogOut, Menu, X, Search } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/products' },
  ];

  return (
    <header 
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        scrolled ? "bg-white/95 backdrop-blur-md shadow-sm py-4" : "bg-transparent py-6"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-tighter text-primary z-50">
          AURA<span className="text-accent">.</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path}
              className="relative text-[13px] font-bold tracking-widest uppercase text-text hover:text-accent transition-colors group"
            >
              {link.name}
              {location.pathname === link.path && (
                <motion.div 
                  layoutId="navbar-indicator"
                  className="absolute -bottom-2 left-0 right-0 h-0.5 bg-accent"
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-6">
          <button className="text-text hover:text-accent transition-colors">
            <Search className="w-5 h-5" />
          </button>
          
          {user ? (
            <div className="flex items-center gap-5">
              <Link to="/cart" className="text-text hover:text-accent transition-colors relative">
                <ShoppingBag className="w-5 h-5" />
                {/* Dummy indicator for premium feel */}
                <span className="absolute 1 top-0 right-0 w-2 h-2 bg-accent rounded-full border border-white"></span>
              </Link>
              <div className="relative group">
                <Link to="/profile" className="flex items-center gap-2 text-text hover:text-accent transition-colors">
                  <User className="w-5 h-5" />
                </Link>
                {/* Dropdown */}
                <div className="absolute right-0 top-full pt-6 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300">
                  <div className="bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-border p-2 w-48 flex flex-col overflow-hidden">
                    <Link to="/profile" className="px-4 py-2.5 text-sm font-medium text-text hover:bg-secondary rounded-xl transition-colors">Profile</Link>
                    <Link to="/orders" className="px-4 py-2.5 text-sm font-medium text-text hover:bg-secondary rounded-xl transition-colors">Orders</Link>
                    <div className="h-px bg-border my-1 mx-2" />
                    <button onClick={handleLogout} className="px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 text-left rounded-xl transition-colors flex items-center gap-2">
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm font-medium text-text hover:text-accent transition-colors">Login</Link>
              <Link to="/register" className="text-sm font-medium bg-primary text-white px-6 py-2.5 rounded-full hover:bg-primary/90 transition-colors shadow-sm hover:shadow-md">
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden z-50 text-primary"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 w-full bg-white shadow-lg border-b border-border py-4 px-6 flex flex-col gap-4 md:hidden overflow-hidden"
          >
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-medium text-text tracking-wide uppercase"
              >
                {link.name}
              </Link>
            ))}
            <div className="h-px bg-border my-2 w-full" />
            {user ? (
              <>
                <Link to="/cart" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-text flex items-center gap-3"><ShoppingBag className="w-5 h-5"/> Cart</Link>
                <Link to="/orders" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-text flex items-center gap-3"><ShoppingBag className="w-5 h-5"/> Orders</Link>
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-text flex items-center gap-3"><User className="w-5 h-5"/> Profile</Link>
                <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="text-lg font-medium text-red-500 flex items-center gap-3 text-left">
                  <LogOut className="w-5 h-5" /> Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-3 mt-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full py-3 text-center rounded-xl border border-border font-medium">Login</Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="w-full py-3 text-center rounded-xl bg-primary text-white font-medium">Sign Up</Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
