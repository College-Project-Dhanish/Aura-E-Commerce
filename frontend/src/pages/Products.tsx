import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { catalogService } from '../services/api';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import SkeletonLoader from '../components/SkeletonLoader';
import { Filter, SlidersHorizontal, Search, RotateCcw } from 'lucide-react';

export const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state from URL or fallback defaults
  const searchVal = searchParams.get('search') || '';
  const categoryVal = searchParams.get('category') || 'all';
  const collectionVal = searchParams.get('collection') || 'all';
  const colorVal = searchParams.get('color') || '';
  const sizeVal = searchParams.get('size') || '';
  const sortVal = searchParams.get('sort') || 'newest';

  // Available Filter Option Lists
  const [categories, setCategories] = useState<{name: string, slug: string}[]>([]);
  const [collections, setCollections] = useState<{name: string, slug: string}[]>([]);
  const [availableSizes, setAvailableSizes] = useState<{name: string, slug: string}[]>([]);
  const [availableColors, setAvailableColors] = useState<{name: string; code: string; slug: string}[]>([]);

  // Load static option lists
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const cats = await catalogService.getCategories();
        const colls = await catalogService.getCollections();
        const colors = await catalogService.getColors();
        const sizes = await catalogService.getSizes();
        setCategories(cats);
        setCollections(colls);
        setAvailableColors(colors);
        setAvailableSizes(sizes);
      } catch (err: any) {
        console.error(err);
        window.alert("Error fetching metadata: " + err.message);
      }
    };
    fetchMetadata();
  }, []);

  // Fetch filtered products (with simulated premium delay for skeleton representation)
  useEffect(() => {
    const fetchFiltered = async () => {
      setLoading(true);
      try {
        const filtered = await catalogService.getProducts({
          search: searchVal,
          category: categoryVal,
          collection: collectionVal,
          color: colorVal,
          size: sizeVal,
          sort: sortVal
        });
        
        // Premium skeletal delay
        setTimeout(() => {
          setProductsList(filtered);
          setLoading(false);
        }, 500);
      } catch (err: any) {
        console.error(err);
        setLoading(false);
        window.alert("Error fetching products: " + err.message);
      }
    };

    fetchFiltered();
  }, [searchVal, categoryVal, collectionVal, colorVal, sizeVal, sortVal]);

  const updateParam = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const resetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-28 md:py-36">
      
      {/* Page Title Header */}
      <div className="mb-12 text-center md:text-left space-y-2">
        <span className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-400">Capsule Series</span>
        <h1 className="text-3xl md:text-5xl font-display font-light text-brand-dark dark:text-white tracking-tight">
          Browse Catalog
        </h1>
        <p className="text-xs font-mono text-neutral-400">Total Items: {productsList.length}</p>
      </div>

      {/* Grid Layout: Left Sidebar Filters, Right Grid Listing */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        
        {/* Left Column: Filter Sidebar */}
        <aside className="space-y-8 select-none">
          <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-900 pb-4">
            <h2 className="text-sm font-mono tracking-widest uppercase font-bold text-brand-dark dark:text-white flex items-center gap-2">
              <SlidersHorizontal size={14} />
              <span>Filters</span>
            </h2>
            <button
              onClick={resetFilters}
              className="text-xs font-mono text-neutral-400 hover:text-red-500 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw size={11} />
              <span>Reset</span>
            </button>
          </div>

          {/* Search Input bar */}
          <div className="space-y-2.5">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-500 font-semibold block">Search Product</span>
            <div className="relative flex items-center bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus-within:border-brand-dark dark:focus-within:border-white transition-colors duration-200 py-3.5 px-4">
              <Search size={14} className="text-neutral-400 mr-2 shrink-0" />
              <input
                type="text"
                placeholder="Type keywords..."
                value={searchVal}
                onChange={(e) => updateParam('search', e.target.value)}
                className="bg-transparent border-none outline-none w-full text-xs text-brand-dark dark:text-white"
              />
            </div>
          </div>

          {/* Categories Filter Block */}
          <div className="space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-500 font-semibold block">Category</span>
            <div className="flex flex-col gap-2 text-xs font-medium">
              <button
                onClick={() => updateParam('category', 'all')}
                className={`text-left py-2 px-3 border transition-colors ${
                  categoryVal === 'all'
                    ? 'bg-brand-dark text-white border-brand-dark dark:bg-white dark:text-brand-dark dark:border-white font-semibold'
                    : 'border-neutral-100 hover:border-neutral-300 dark:border-neutral-900 text-neutral-600 dark:text-neutral-400'
                }`}
              >
                All Products
              </button>
              {categories.map(cat => (
                <button
                  key={cat.slug}
                  onClick={() => updateParam('category', cat.slug)}
                  className={`text-left py-2 px-3 border transition-colors capitalize ${
                    categoryVal === cat.slug
                      ? 'bg-brand-dark text-white border-brand-dark dark:bg-white dark:text-brand-dark dark:border-white font-semibold'
                      : 'border-neutral-100 hover:border-neutral-300 dark:border-neutral-900 text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Collections Filter Block */}
          <div className="space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-500 font-semibold block">Collections</span>
            <div className="flex flex-col gap-2 text-xs font-medium">
              <button
                onClick={() => updateParam('collection', 'all')}
                className={`text-left py-2 px-3 border transition-colors ${
                  collectionVal === 'all'
                    ? 'bg-brand-dark text-white border-brand-dark dark:bg-white dark:text-brand-dark dark:border-white font-semibold'
                    : 'border-neutral-100 hover:border-neutral-300 dark:border-neutral-900 text-neutral-600 dark:text-neutral-400'
                }`}
              >
                All Collections
              </button>
              {collections.map(col => (
                <button
                  key={col.slug}
                  onClick={() => updateParam('collection', col.slug)}
                  className={`text-left py-2 px-3 border transition-colors ${
                    collectionVal === col.slug
                      ? 'bg-brand-dark text-white border-brand-dark dark:bg-white dark:text-brand-dark dark:border-white font-semibold'
                      : 'border-neutral-100 hover:border-neutral-300 dark:border-neutral-900 text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  {col.name}
                </button>
              ))}
            </div>
          </div>

          {/* Colors Filter Swatches Block */}
          <div className="space-y-3.5">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-500 font-semibold block">Filter by Color</span>
            <div className="flex flex-wrap gap-2.5">
              {availableColors.map(color => (
                <button
                  key={color.slug}
                  onClick={() => updateParam('color', colorVal === color.slug ? '' : color.slug)}
                  className={`w-6 h-6 rounded-full border transition-all duration-250 relative ${
                    colorVal === color.slug
                      ? 'border-brand-dark dark:border-white scale-125 ring-2 ring-offset-2 ring-neutral-400 dark:ring-offset-black'
                      : 'border-neutral-300 dark:border-neutral-800 hover:scale-110'
                  }`}
                  style={{ backgroundColor: color.code }}
                  title={color.name}
                >
                  {colorVal === color.slug && (
                    <span className="absolute inset-0 flex items-center justify-center text-[9px] text-white mix-blend-difference">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Sizes Filter Block */}
          <div className="space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-500 font-semibold block">Filter by Size</span>
            <div className="flex gap-2">
              {availableSizes.map(sz => (
                <button
                  key={sz.slug}
                  onClick={() => updateParam('size', sizeVal === sz.slug ? '' : sz.slug)}
                  className={`w-10 h-10 border text-xs font-mono tracking-wider transition-all duration-200 active:scale-95 flex items-center justify-center ${
                    sizeVal === sz.slug
                      ? 'bg-brand-dark text-white border-brand-dark dark:bg-white dark:text-brand-dark dark:border-white font-semibold'
                      : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 text-neutral-600 dark:text-neutral-400'
                  }`}
                  title={sz.name}
                >
                  {sz.name}
                </button>
              ))}
            </div>
          </div>

        </aside>

        {/* Right Column: Listing Header and Grid */}
        <div className="lg:col-span-3 space-y-8">
          
          {/* Top Sort Bar */}
          <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-900 pb-4">
            <span className="text-xs font-mono text-neutral-400">
              Showing {productsList.length} items
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest">Sort:</span>
              <select
                value={sortVal}
                onChange={(e) => updateParam('sort', e.target.value)}
                className="bg-transparent border-none text-xs font-mono font-semibold tracking-wider text-brand-dark dark:text-white outline-none cursor-pointer focus:ring-1 focus:ring-brand-dark p-1"
              >
                <option value="newest" className="dark:bg-neutral-950">Newest Drop</option>
                <option value="best-seller" className="dark:bg-neutral-950">Best Sellers</option>
                <option value="price-low-high" className="dark:bg-neutral-950">Price: Low - High</option>
                <option value="price-high-low" className="dark:bg-neutral-950">Price: High - Low</option>
              </select>
            </div>
          </div>

          {/* Grid Products list */}
          {loading ? (
            <SkeletonLoader count={6} />
          ) : productsList.length === 0 ? (
            <div className="text-center py-24 space-y-4 select-none">
              <h3 className="font-display text-xl font-light text-neutral-400">No products match your criteria.</h3>
              <p className="text-xs font-mono text-neutral-400">Try removing some filter conditions or search term keywords.</p>
              <button
                onClick={resetFilters}
                className="bg-brand-dark dark:bg-white text-white dark:text-brand-dark px-6 py-3 text-xs font-mono tracking-widest uppercase font-semibold transition-transform duration-200 active:scale-95 hover:opacity-90"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-6 md:gap-x-8">
              {productsList.map(prod => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
export default Products;
