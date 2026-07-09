import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Heart, User, Sun, Moon, Menu, X, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const { cartQuantity, wishlist, user, darkMode, setThemeMode } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Handle transparent to solid height transition on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Shop All', path: '/products' },
    { name: 'Collections', path: '/collections' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 border-b ${
          scrolled
            ? 'bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md py-3.5 border-neutral-100 dark:border-neutral-900 shadow-sm'
            : 'bg-transparent py-5 border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 text-brand-dark dark:text-white"
            aria-label="Open Menu"
          >
            <Menu size={20} />
          </button>

          {/* Nav Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-mono tracking-widest uppercase font-medium">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `transition-colors relative py-1 hover:text-neutral-500 dark:hover:text-neutral-400 ${
                    isActive 
                      ? 'text-brand-dark dark:text-white font-semibold' 
                      : 'text-neutral-500 dark:text-neutral-400'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>{link.name}</span>
                    {isActive && (
                      <motion.div
                        layoutId="nav-underline"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-dark dark:bg-white"
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Logo Brand Title */}
          <Link
            to="/"
            className="font-display text-lg md:text-2xl tracking-[0.25em] font-medium uppercase text-brand-dark dark:text-white hover:opacity-80 transition-opacity"
          >
            AURA
          </Link>

          {/* Utility Tools Icons */}
          <div className="flex items-center gap-1.5 md:gap-4 text-brand-dark dark:text-white">
            
            {/* Theme Toggle */}
            <button
              onClick={() => setThemeMode(!darkMode)}
              className="p-2 hover:text-neutral-500 transition-colors"
              title="Toggle Theme"
            >
              {darkMode ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {/* Profile / Account */}
            <Link
              to={user ? "/profile" : "/login"}
              className={`p-2 hover:text-neutral-500 transition-colors flex items-center gap-1 ${
                location.pathname === '/profile' || location.pathname === '/login' ? 'text-brand-dark dark:text-white' : 'text-neutral-500 dark:text-neutral-400'
              }`}
              title={user ? "Profile" : "Login"}
            >
              <User size={17} />
              {user && <span className="hidden lg:inline text-[10px] font-mono tracking-widest uppercase font-semibold">{user.first_name}</span>}
            </Link>

            {/* Wishlist Icon */}
            <Link
              to="/wishlist"
              className="p-2 hover:text-neutral-500 transition-colors relative"
              title="Wishlist"
            >
              <Heart size={17} className={wishlist.length > 0 ? 'fill-brand-dark text-brand-dark dark:fill-white dark:text-white' : 'text-neutral-500 dark:text-neutral-400'} />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />
              )}
            </Link>

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="p-2 hover:text-neutral-500 transition-colors relative"
              title="Shopping Bag"
            >
              <ShoppingBag size={17} />
              <AnimatePresence>
                {cartQuantity > 0 && (
                  <motion.span
                    key={cartQuantity}
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: [1, 1.2, 1], opacity: 1 }}
                    exit={{ scale: 0.6, opacity: 0 }}
                    className="absolute -top-1 -right-1 bg-brand-dark dark:bg-white text-white dark:text-brand-dark text-[9px] font-mono font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white dark:border-neutral-950"
                  >
                    {cartQuantity}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </div>

        </div>
      </header>

      {/* Slide-in Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden select-none">
            {/* Dark blur backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/40 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Menu Slide container */}
            <motion.div
              className="absolute top-0 bottom-0 left-0 w-4/5 max-w-sm bg-white dark:bg-neutral-950 p-6 flex flex-col justify-between border-r border-neutral-100 dark:border-neutral-900"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div>
                {/* Header Row */}
                <div className="flex justify-between items-center mb-10">
                  <span className="font-display tracking-[0.25em] font-medium text-lg uppercase">
                    AURA
                  </span>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 text-neutral-400 hover:text-brand-dark dark:hover:text-white"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Primary links */}
                <nav className="flex flex-col gap-6 text-sm font-mono tracking-widest uppercase font-medium">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex justify-between items-center py-2 border-b border-neutral-50 dark:border-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-brand-dark dark:hover:text-white transition-colors"
                    >
                      <span>{link.name}</span>
                      <ChevronRight size={14} className="text-neutral-300" />
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Footer Account Block */}
              <div className="pt-6 border-t border-neutral-100 dark:border-neutral-900 space-y-4">
                {user ? (
                  <div className="flex items-center gap-3">
                    <img 
                      src={user.profile_image} 
                      alt="" 
                      className="w-10 h-10 rounded-full object-cover border border-neutral-200" 
                    />
                    <div>
                      <p className="text-xs font-semibold text-brand-dark dark:text-white">{user.first_name} {user.last_name}</p>
                      <p className="text-[10px] text-neutral-400 font-mono">{user.email}</p>
                    </div>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full bg-brand-dark dark:bg-white text-white dark:text-brand-dark text-center py-3 text-xs font-mono tracking-widest uppercase font-medium hover:bg-neutral-800 transition-colors"
                  >
                    Login
                  </Link>
                )}
                <p className="text-[10px] text-center text-neutral-400 font-mono tracking-wider">
                  © 2026 AURA STUDIO LTD.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
export default Navbar;
