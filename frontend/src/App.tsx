import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

// Import Common Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MarqueeBanner from './components/MarqueeBanner';
import QuickViewModal from './components/QuickViewModal';

// Import Pages
import Home from './pages/Home';
import Products from './pages/Products';
import Collections from './pages/Collections';
import ProductDetails from './pages/ProductDetails';
import Wishlist from './pages/Wishlist';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

// Scroll To Top on Route Navigation helper
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
};

export default function App() {
  return (
    <AppProvider>
      <Router>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen bg-white dark:bg-neutral-950 transition-colors duration-300">
          
          {/* Top Scrolling Infinite Marquee */}
          <MarqueeBanner />

          {/* Sticky Header Navigation */}
          <Navbar />

          {/* Central Main Route Content Stage */}
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:slug" element={<ProductDetails />} />
              <Route path="/collections" element={<Collections />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          {/* Persistent Page overlay modal elements */}
          <QuickViewModal />

          {/* Premium Footer */}
          <Footer />

        </div>
      </Router>
    </AppProvider>
  );
}
