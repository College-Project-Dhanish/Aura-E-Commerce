import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Check, ShoppingBag, X, ChevronDown } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import { ENDPOINTS } from '../services/endpoints';
import { catalogService } from '../services/catalog';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorAlert from '../components/ui/ErrorAlert';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Utility to get a hex color from color name for the swatches
const getColorHex = (colorName) => {
  const map = {
    black: '#000000', white: '#FFFFFF', red: '#EF4444', blue: '#3B82F6', 
    green: '#10B981', yellow: '#F59E0B', gray: '#6B7280', purple: '#8B5CF6',
    pink: '#EC4899', navy: '#1E3A8A', beige: '#F5F5DC', brown: '#8B4513'
  };
  return map[colorName?.toLowerCase()] || '#E5E7EB';
};

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = useMemo(() => {
    const sp = new URLSearchParams(location.search);
    const allowedKeys = new Set(['search', 'category', 'collection', 'color', 'size', 'sort', 'page', 'page_size']);
    const params = new URLSearchParams();
    for (const [key, value] of sp.entries()) {
      if (!allowedKeys.has(key)) continue;
      if (value === '' || value === null || value === undefined) continue;
      params.set(key, value);
    }
    return params;
  }, [location.search]);

  const [searchInput, setSearchInput] = useState(queryParams.get('search') || '');

  useEffect(() => {
    setSearchInput(queryParams.get('search') || '');
  }, [queryParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const sp = new URLSearchParams(window.location.search);
      if (searchInput) {
        if (sp.get('search') !== searchInput) {
          sp.set('search', searchInput);
          navigate({ search: sp.toString() });
        }
      } else {
        if (sp.has('search')) {
          sp.delete('search');
          navigate({ search: sp.toString() });
        }
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput, navigate]);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [cats, cols, clrs, szs] = await Promise.all([
          catalogService.getCategories(),
          catalogService.getCollections(),
          catalogService.getColors(),
          catalogService.getSizes()
        ]);
        setCategories(cats);
        setCollections(cols);
        setColors(clrs);
        setSizes(szs);
      } catch (err) {
        console.error('Failed to load filter options', err);
      }
    };
    fetchFilters();
  }, []);

  const fetchProducts = async (params) => {
    try {
      setLoading(true);
      setError(null);
      const qs = params?.toString ? params.toString() : '';
      const url = qs ? `${ENDPOINTS.CATALOG.PRODUCTS}?${qs}` : ENDPOINTS.CATALOG.PRODUCTS;
      const res = await axiosInstance.get(url);
      const data = res.data?.results ? res.data.results : res.data;
      setProducts(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e?.response?.data?.detail || e.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(queryParams);
  }, [queryParams]);

  const updateParam = (key, value) => {
    const sp = new URLSearchParams(window.location.search);
    if (value) sp.set(key, value);
    else sp.delete(key);
    navigate({ search: sp.toString() });
  };

  const isActive = (key, val) => queryParams.get(key) === val;

  const toggleParam = (key, val) => {
    if (isActive(key, val)) {
      updateParam(key, '');
    } else {
      updateParam(key, val);
    }
  };

  const FilterSidebar = () => (
    <div className="space-y-10 pr-6">
      <div className="flex items-center justify-between lg:hidden mb-6">
        <h3 className="text-xl font-bold text-primary">Filters</h3>
        <button onClick={() => setMobileFiltersOpen(false)} className="text-muted hover:text-primary">
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Categories */}
      <div>
        <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-primary mb-5">Categories</h4>
        <div className="flex flex-col gap-3">
          {Array.isArray(categories) && categories.map(c => {
            const val = c.slug || c.name;
            const active = isActive('category', val);
            return (
              <div 
                key={c.id || val} 
                onClick={() => toggleParam('category', val)}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className={cn(
                  "w-5 h-5 rounded flex items-center justify-center border transition-all duration-200",
                  active ? "bg-primary border-primary text-white" : "border-border group-hover:border-primary bg-white"
                )}>
                  {active && <Check className="w-3.5 h-3.5" />}
                </div>
                <span className={cn("text-sm transition-colors", active ? "font-medium text-primary" : "text-muted group-hover:text-primary")}>{c.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Collections */}
      <div>
        <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-primary mb-5">Collections</h4>
        <div className="flex flex-col gap-3">
          {Array.isArray(collections) && collections.map(c => {
            const val = c.slug || c.name;
            const active = isActive('collection', val);
            return (
              <button 
                key={c.id || val}
                onClick={() => toggleParam('collection', val)}
                className={cn(
                  "px-4 py-3 text-left rounded-xl border text-sm transition-all duration-200",
                  active ? "border-primary bg-primary text-white shadow-md" : "border-border bg-white text-muted hover:border-primary hover:text-primary"
                )}
              >
                {c.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Colors */}
      <div>
        <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-primary mb-5">Colors</h4>
        <div className="flex flex-wrap gap-3">
          {Array.isArray(colors) && colors.map(c => {
            const val = c.slug || c.name;
            const active = isActive('color', val);
            const hex = getColorHex(c.name);
            return (
              <button
                key={c.id || val}
                onClick={() => toggleParam('color', val)}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center relative transition-transform duration-200",
                  active ? "scale-110 ring-2 ring-offset-2 ring-primary" : "hover:scale-110 border border-border shadow-sm"
                )}
                style={{ backgroundColor: hex }}
                title={c.name}
              >
                {active && <Check className={cn("w-4 h-4", ['#FFFFFF', '#F5F5DC'].includes(hex.toUpperCase()) ? "text-primary" : "text-white")} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-primary mb-5">Sizes</h4>
        <div className="flex flex-wrap gap-2">
          {Array.isArray(sizes) && sizes.map(s => {
            const val = s.slug || s.name;
            const active = isActive('size', val);
            return (
              <button
                key={s.id || val}
                onClick={() => toggleParam('size', val)}
                className={cn(
                  "min-w-[3rem] h-10 px-3 rounded-xl border text-sm font-medium transition-all duration-200",
                  active ? "border-primary bg-primary text-white shadow-md" : "border-border bg-white text-text hover:border-primary"
                )}
              >
                {s.name}
              </button>
            );
          })}
        </div>
      </div>
      
      <div className="pt-6 border-t border-border">
        <Button 
          variant="outline" 
          className="w-full justify-center" 
          onClick={() => {
            setSearchInput('');
            navigate({ search: '' });
          }}
        >
          Clear All Filters
        </Button>
      </div>
    </div>
  );

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-12">
      
      {/* Top Header */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-primary mb-4">THE COLLECTION</h1>
        <p className="text-muted text-lg max-w-2xl font-light">Explore our complete range of premium garments, designed with meticulous attention to detail and unparalleled craftsmanship.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 relative">
        
        {/* Desktop Sidebar (Sticky) */}
        <aside className="hidden lg:block w-72 flex-shrink-0">
          <div className="sticky top-[100px] max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar pb-10">
            {FilterSidebar()}
          </div>
        </aside>

        {/* Mobile Filters Overlay */}
        <AnimatePresence>
          {mobileFiltersOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 lg:hidden bg-primary/20 backdrop-blur-sm"
              onClick={() => setMobileFiltersOpen(false)}
            >
              <motion.div 
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="absolute top-0 left-0 w-80 h-full bg-white shadow-2xl p-6 overflow-y-auto custom-scrollbar"
                onClick={e => e.stopPropagation()}
              >
                {FilterSidebar()}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          
          {/* Top Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <button 
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-full border border-border bg-white text-sm font-medium text-primary hover:border-primary transition-colors shadow-sm"
              >
                <Filter className="w-4 h-4" /> Filters
              </button>
              <p className="text-sm text-muted font-medium"><span className="text-primary font-bold">{products.length}</span> Products</p>
            </div>
            
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-full border border-border bg-white text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm"
                />
              </div>
              <div className="relative hidden sm:block">
                <select
                  value={queryParams.get('sort') || 'newest'}
                  onChange={(e) => updateParam('sort', e.target.value === 'newest' ? '' : e.target.value)}
                  className="appearance-none pl-5 pr-10 py-2.5 rounded-full border border-border bg-white text-sm font-medium text-primary cursor-pointer focus:outline-none focus:border-primary shadow-sm hover:border-primary transition-colors"
                >
                  <option value="newest">Newest First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
              </div>
            </div>
          </div>

          <ErrorAlert message={error} />

          {loading ? (
            <div className="py-20 flex justify-center">
              <LoadingSpinner size="3rem" />
            </div>
          ) : (
            <>
              {products.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-32 px-4 text-center bg-white rounded-3xl border border-border border-dashed"
                >
                  <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-6">
                    <Search className="w-8 h-8 text-muted" />
                  </div>
                  <h3 className="text-2xl font-bold text-primary mb-3">No products found</h3>
                  <p className="text-muted max-w-md mx-auto">We couldn't find anything matching your current filters. Try adjusting them or clear all filters to start over.</p>
                  <Button variant="outline" className="mt-8" onClick={() => {
                    setSearchInput('');
                    navigate({ search: '' });
                  }}>
                    Clear Filters
                  </Button>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-12">
                  <AnimatePresence>
                    {Array.isArray(products) && products.map((p, idx) => {
                      const slug = p.slug || p.id;
                      const name = p.name || p.title || `Product ${slug}`;
                      let imagePath = p.thumbnail || p.images?.[0]?.image;
                      
                      let imageUrl = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop'; // Premium placeholder
                      if (imagePath) {
                        if (imagePath.startsWith('http')) {
                          imageUrl = imagePath;
                        } else {
                          const API_URL = (import.meta.env?.VITE_API_BASE_URL) || 'http://127.0.0.1:8000/api';
                          const BASE_URL = API_URL.replace('/api', '').replace(/\/$/, '');
                          imageUrl = `${BASE_URL}${imagePath.startsWith('/') ? imagePath : '/' + imagePath}`;
                        }
                      }
                      
                      const isNew = idx % 5 === 0; // Simulated logic for UI showcase
                      
                      return (
                        <motion.div
                          layout
                          initial={{ opacity: 0, y: 40 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-50px" }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.6, delay: (idx % 3) * 0.1, ease: "easeOut" }}
                          key={p.id || slug}
                        >
                          <Link to={`/products/${slug}`} className="group block hover:-translate-y-2 hover:drop-shadow-2xl transition-all duration-500">
                            <div className="relative aspect-[3/4] bg-secondary rounded-2xl overflow-hidden mb-5">
                              {/* Badges */}
                              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                                {isNew && (
                                  <span className="bg-primary text-white text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full shadow-sm">
                                    New
                                  </span>
                                )}
                              </div>
                              
                              <img 
                                src={imageUrl} 
                                alt={name} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                              />
                              
                              {/* Hover Add Overlay */}
                              <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out">
                                <div className="w-full bg-white/90 backdrop-blur text-primary text-sm font-semibold py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 hover:bg-white transition-colors">
                                  <ShoppingBag className="w-4 h-4" /> Quick View
                                </div>
                              </div>
                            </div>
                            
                            <div className="px-1">
                              <h3 className="text-base font-medium text-primary mb-1 truncate group-hover:text-accent transition-colors">{name}</h3>
                              <p className="text-sm text-muted mb-2 line-clamp-1">{p.short_description || 'Premium quality apparel'}</p>
                              <div className="flex items-center gap-3">
                                <span className="text-lg font-bold text-primary">${p.effective_price || p.price}</span>
                                {p.effective_price && p.effective_price < p.price && (
                                  <span className="text-sm font-medium text-muted line-through">${p.price}</span>
                                )}
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
