import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { ENDPOINTS } from '../services/endpoints';
import { catalogService } from '../services/catalog';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorAlert from '../components/ui/ErrorAlert';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter options state
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);

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

  // Local state for debounced search
  const [searchInput, setSearchInput] = useState(queryParams.get('search') || '');

  useEffect(() => {
    // Sync searchInput when URL changes externally (e.g. back button or clear filters)
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

  return (
    <div className="container" style={{ padding: '2rem 16px' }}>
      
      {/* Header and Filters */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', letterSpacing: '-0.025em' }}>Explore Our Collection</h1>
        
        <Card style={{ padding: '1rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            
            <div style={{ flex: '1 1 200px' }}>
              <Input
                label="Search"
                placeholder="Product name..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                style={{ marginBottom: 0 }}
              />
            </div>
            
            <div style={{ flex: '1 1 150px', marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>Category</label>
              <select
                value={queryParams.get('category') || ''}
                onChange={(e) => updateParam('category', e.target.value)}
                style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', fontFamily: 'inherit', fontSize: '1rem' }}
              >
                <option value="">All Categories</option>
                {categories.map(c => (
                  <option key={c.slug || c.id} value={c.slug || c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div style={{ flex: '1 1 150px', marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>Collection</label>
              <select
                value={queryParams.get('collection') || ''}
                onChange={(e) => updateParam('collection', e.target.value)}
                style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', fontFamily: 'inherit', fontSize: '1rem' }}
              >
                <option value="">All Collections</option>
                {collections.map(c => (
                  <option key={c.slug || c.id} value={c.slug || c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div style={{ flex: '1 1 120px', marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>Color</label>
              <select
                value={queryParams.get('color') || ''}
                onChange={(e) => updateParam('color', e.target.value)}
                style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', fontFamily: 'inherit', fontSize: '1rem' }}
              >
                <option value="">All Colors</option>
                {colors.map(c => (
                  <option key={c.slug || c.id} value={c.slug || c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div style={{ flex: '1 1 120px', marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>Size</label>
              <select
                value={queryParams.get('size') || ''}
                onChange={(e) => updateParam('size', e.target.value)}
                style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', fontFamily: 'inherit', fontSize: '1rem' }}
              >
                <option value="">All Sizes</option>
                {sizes.map(s => (
                  <option key={s.slug || s.id} value={s.slug || s.name}>{s.name}</option>
                ))}
              </select>
            </div>
            
            <div style={{ flex: '1 1 150px', marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>Sort By</label>
              <select
                value={queryParams.get('sort') || 'newest'}
                onChange={(e) => updateParam('sort', e.target.value === 'newest' ? '' : e.target.value)}
                style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', fontFamily: 'inherit', fontSize: '1rem' }}
              >
                <option value="newest">Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <Button variant="secondary" onClick={() => {
                setSearchInput('');
                navigate({ search: '' });
              }}>
                Clear
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <ErrorAlert message={error} />

      {loading ? (
        <LoadingSpinner fullScreen={false} />
      ) : (
        <>
          {products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <h2 style={{ color: 'var(--text-muted)' }}>No products found</h2>
              <p>Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
              gap: '2rem' 
            }}>
              {products.map((p) => {
                const slug = p.slug || p.id;
                const name = p.name || p.title || `Product ${slug}`;
                let imagePath = p.thumbnail || p.images?.[0]?.image;
                
                let imageUrl = 'https://via.placeholder.com/400x500?text=No+Image';
                if (imagePath) {
                  if (imagePath.startsWith('http')) {
                    imageUrl = imagePath;
                  } else {
                    const API_URL = (import.meta.env?.VITE_API_BASE_URL) || 'http://127.0.0.1:8000/api';
                    const BASE_URL = API_URL.replace('/api', '').replace(/\/$/, '');
                    imageUrl = `${BASE_URL}${imagePath.startsWith('/') ? imagePath : '/' + imagePath}`;
                  }
                }
                
                return (
                  <Link to={`/products/${slug}`} key={p.id || slug} style={{ display: 'block' }}>
                    <Card noPadding style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                      <div style={{ position: 'relative', paddingTop: '125%', backgroundColor: 'var(--bg-color)' }}>
                        <img 
                          src={imageUrl} 
                          alt={name} 
                          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                        <h3 style={{ fontSize: '1.125rem', margin: '0 0 0.5rem 0', fontWeight: 600, color: 'var(--text-primary)' }}>{name}</h3>
                        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '1.125rem', fontWeight: 700 }}>${p.effective_price || p.price}</span>
                          <span style={{ color: 'var(--accent-color)', fontSize: '0.875rem', fontWeight: 500 }}>View Details</span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
