import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cartService } from '../services/cart';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorAlert from '../components/ui/ErrorAlert';

export default function CartPage() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const data = await cartService.getCart();
      setCart(data);
    } catch (err) {
      if (err.response?.status === 404) {
        setCart({ items: [] });
      } else {
        setError('Failed to load cart.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return handleRemoveItem(itemId);
    try {
      await cartService.updateItemQuantity(itemId, quantity);
      fetchCart();
    } catch (err) {
      setError('Failed to update quantity.');
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await cartService.removeItem(itemId);
      fetchCart();
    } catch (err) {
      setError('Failed to remove item.');
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  const isEmpty = !cart || !cart.items || cart.items.length === 0;

  const calculateTotal = () => {
    let sum = 0;
    cart?.items?.forEach(item => {
      sum += parseFloat(item.line_total || 0);
    });
    return sum.toFixed(2);
  };

  return (
    <div className="container" style={{ padding: '2rem 16px' }}>
      <h1 style={{ marginBottom: '2rem' }}>Shopping Cart</h1>
      <ErrorAlert message={error} />
      
      {isEmpty ? (
        <Card style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Your cart is empty</h2>
          <p style={{ marginBottom: '2rem' }}>Looks like you haven't added anything to your cart yet.</p>
          <Link to="/">
            <Button variant="primary">Continue Shopping</Button>
          </Link>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
          <div>
            {cart.items.map(item => (
              <Card key={item.id} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem' }}>{item.product_name || 'Product'}</h3>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    Variant: {item.sku} | Color: {item.color} | Size: {item.size}
                  </p>
                  <p style={{ margin: '0.5rem 0 0 0', fontWeight: 600 }}>${item.unit_price}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                  <Button variant="secondary" size="sm" onClick={() => handleRemoveItem(item.id)}>Remove</Button>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Button size="sm" variant="secondary" onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}>-</Button>
                    <span style={{ fontWeight: 500 }}>{item.quantity}</span>
                    <Button size="sm" variant="secondary" onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>+</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          <div>
            <Card>
              <h2 style={{ fontSize: '1.25rem', margin: '0 0 1rem 0' }}>Order Summary</h2>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span>Subtotal</span>
                <span style={{ fontWeight: 600 }}>${calculateTotal()}</span>
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1rem 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '1.125rem', fontWeight: 600 }}>
                <span>Total</span>
                <span>${calculateTotal()}</span>
              </div>
              <Button variant="primary" style={{ width: '100%' }} onClick={() => navigate('/checkout')}>
                Proceed to Checkout
              </Button>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
