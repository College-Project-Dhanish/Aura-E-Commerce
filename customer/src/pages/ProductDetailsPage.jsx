import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { ENDPOINTS } from '../services/endpoints';
import { useAuth } from '../contexts/AuthContext';
import { cartService } from '../services/cart';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorAlert from '../components/ui/ErrorAlert';

export default function ProductDetailsPage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState(null);
  const [reviews, setReviews] = useState([]);

  const [selectedVariantSku, setSelectedVariantSku] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [postingReview, setPostingReview] = useState(false);
  const [postReviewError, setPostReviewError] = useState(null);
  const [postReviewSuccess, setPostReviewSuccess] = useState(null);
  
  const [addingToCart, setAddingToCart] = useState(false);
  const [addToCartError, setAddToCartError] = useState(null);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const url = ENDPOINTS.CATALOG.PRODUCT_DETAIL(slug);
      const res = await axiosInstance.get(url);
      setProduct(res.data?.results ? res.data.results[0] : res.data);
    } catch (e) {
      setError(e?.response?.data?.detail || e.message || 'Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const productName = useMemo(() => {
    if (!product) return '';
    return product?.name || product?.title || product?.slug || '';
  }, [product]);

  const variants = useMemo(() => {
    if (!product?.variants || !Array.isArray(product.variants)) return [];
    return product.variants;
  }, [product]);

  const variantSkuOptions = useMemo(() => {
    const skus = variants.map((v) => v?.sku).filter(Boolean).filter((sku, idx, arr) => arr.indexOf(sku) === idx);
    if (skus.length === 0 && product?.sku) return [product.sku];
    return skus;
  }, [variants, product?.sku]);

  const inferredDefaultVariantSku = useMemo(() => {
    if (!variantSkuOptions.length) return '';
    if (variantSkuOptions.length === 1) return variantSkuOptions[0];
    const first = variants?.[0]?.sku;
    return first || variantSkuOptions[0] || '';
  }, [variants, variantSkuOptions]);

  useEffect(() => {
    if (slug) fetchProduct();
  }, [slug]);

  useEffect(() => {
    if (!product) return;
    setSelectedVariantSku((prev) => {
      if (prev) return prev;
      return inferredDefaultVariantSku || (variantSkuOptions[0] ?? '') || '';
    });
  }, [product, inferredDefaultVariantSku, variantSkuOptions]);

  const fetchReviews = async () => {
    if (!productName) return;
    try {
      setReviewsLoading(true);
      setReviewsError(null);
      const params = new URLSearchParams();
      params.set('product_name', productName);
      if (selectedVariantSku) params.set('variant_sku', selectedVariantSku);
      const res = await axiosInstance.get(`${ENDPOINTS.REVIEWS.LIST_CREATE}?${params.toString()}`);
      const items = res.data?.items ? res.data.items : [];
      setReviews(Array.isArray(items) ? items : []);
    } catch (e) {
      setReviewsError(e?.response?.data?.detail || e.message || 'Failed to load reviews');
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    if (!productName) return;
    fetchReviews();
  }, [productName, selectedVariantSku]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setPostReviewError(null);
    setPostReviewSuccess(null);

    if (!user) {
      setPostReviewError('Please login to post a review.');
      return;
    }
    if (!productName) {
      setPostReviewError('Product name unavailable.');
      return;
    }
    if (!selectedVariantSku) {
      setPostReviewError('Please select a variant to review.');
      return;
    }

    try {
      setPostingReview(true);
      await axiosInstance.post(ENDPOINTS.REVIEWS.LIST_CREATE, {
        product_name: productName,
        variant_sku: selectedVariantSku,
        rating: reviewRating,
        comment: reviewComment,
      });
      setReviewComment('');
      setPostReviewSuccess('Review submitted successfully (pending approval).');
      await fetchReviews();
    } catch (err) {
      setPostReviewError(err?.response?.data?.detail || err?.message || 'Failed to submit review');
    } finally {
      setPostingReview(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setAddToCartError(null);
    setAddingToCart(true);
    try {
      const selectedVariant = variants.find(v => v.sku === selectedVariantSku);
      await cartService.addItem(product.id, 1, selectedVariant?.id || null);
      navigate('/cart');
    } catch (err) {
      setAddToCartError('Failed to add to cart.');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  if (error) {
    return (
      <div className="container" style={{ padding: '2rem 16px' }}>
        <ErrorAlert message={error} />
        <Link to="/"><Button variant="secondary">Go Back</Button></Link>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="container" style={{ padding: '2rem 16px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>← Back to Catalog</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', marginBottom: '4rem' }}>
        {/* Product Images */}
        <div style={{ backgroundColor: 'var(--bg-color)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px', overflow: 'hidden' }}>
           {product.images && product.images.length > 0 ? (
            <img src={product.images[0].image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ color: 'var(--text-muted)' }}>No Image Available</span>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{productName}</h1>
          <p style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
            ${product.price}
          </p>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.6 }}>
            {product.description || 'No description available for this product.'}
          </p>

          <ErrorAlert message={addToCartError} />

          {variantSkuOptions.length > 1 && (
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Variant</label>
              <select
                value={selectedVariantSku}
                onChange={(e) => setSelectedVariantSku(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  fontFamily: 'inherit',
                  fontSize: '1rem'
                }}
              >
                {variantSkuOptions.map((sku) => (
                  <option key={sku} value={sku}>{sku}</option>
                ))}
              </select>
            </div>
          )}

          <Button 
            variant="primary" 
            size="lg" 
            style={{ width: '100%' }} 
            onClick={handleAddToCart}
            isLoading={addingToCart}
          >
            Add to Cart
          </Button>
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', marginBottom: '3rem' }} />

      {/* Reviews Section */}
      <div>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Customer Reviews</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
          <div>
            {reviewsLoading && <LoadingSpinner />}
            {reviewsError && <ErrorAlert message={reviewsError} />}
            
            {!reviewsLoading && !reviewsError && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {reviews.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No reviews yet.</p>}
                {reviews.map((r) => (
                  <Card key={r.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <div style={{ fontWeight: 600 }}>{r.user_display || 'Customer'}</div>
                      <div style={{ display: 'flex', color: '#fbbf24' }}>
                        {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                      </div>
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.75rem' }}>
                      Variant: {r.variant_sku} · {r.created_at ? new Date(r.created_at).toLocaleDateString() : ''}
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9375rem', whiteSpace: 'pre-wrap' }}>{r.comment}</p>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div>
            <Card>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Write a Review</h3>
              {!user ? (
                <p style={{ color: 'var(--text-muted)' }}>
                  Please <Link to="/login" style={{ color: 'var(--accent-color)', fontWeight: 500 }}>login</Link> to post a review.
                </p>
              ) : (
                <form onSubmit={handleSubmitReview}>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Rating</label>
                    <select
                      value={reviewRating}
                      onChange={(e) => setReviewRating(parseInt(e.target.value, 10))}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-md)',
                        fontFamily: 'inherit',
                        fontSize: '1rem'
                      }}
                    >
                      {[5, 4, 3, 2, 1].map((n) => (
                        <option key={n} value={n}>{n} Star{n !== 1 && 's'}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Review</label>
                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      required
                      maxLength={5000}
                      rows={4}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-md)',
                        fontFamily: 'inherit',
                        fontSize: '1rem',
                        resize: 'vertical'
                      }}
                      placeholder="Share your thoughts..."
                    />
                  </div>

                  <ErrorAlert message={postReviewError} />
                  {postReviewSuccess && (
                    <div style={{ color: 'var(--success-color)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                      {postReviewSuccess}
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    variant="primary" 
                    style={{ width: '100%' }}
                    isLoading={postingReview}
                  >
                    Submit Review
                  </Button>
                </form>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
