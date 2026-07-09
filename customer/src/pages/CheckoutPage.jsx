import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cartService } from '../services/cart';
import { ordersService } from '../services/orders';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorAlert from '../components/ui/ErrorAlert';

export default function CheckoutPage() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    shipping_address: '',
    billing_address: '',
    payment_method: 'credit_card'
  });

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const data = await cartService.getCart();
        if (!data.items || data.items.length === 0) {
          navigate('/cart');
          return;
        }
        setCart(data);
      } catch (err) {
        navigate('/cart');
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await ordersService.checkout(formData);
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to place order.');
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="container" style={{ padding: '2rem 16px' }}>
      <h1 style={{ marginBottom: '2rem' }}>Checkout</h1>
      <ErrorAlert message={error} />
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
        <Card>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Shipping & Payment</h2>
          <form onSubmit={handleSubmit}>
            <Input 
              label="Shipping Address" 
              name="shipping_address" 
              required 
              value={formData.shipping_address}
              onChange={handleChange}
            />
            <Input 
              label="Billing Address" 
              name="billing_address" 
              required 
              value={formData.billing_address}
              onChange={handleChange}
            />
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Payment Method</label>
              <select 
                name="payment_method"
                value={formData.payment_method}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  fontFamily: 'inherit',
                  fontSize: '1rem'
                }}
              >
                <option value="credit_card">Credit Card (Mock)</option>
                <option value="paypal">PayPal (Mock)</option>
              </select>
            </div>
            
            <Button type="submit" variant="primary" style={{ width: '100%', marginTop: '1rem' }} isLoading={isSubmitting}>
              Place Order
            </Button>
          </form>
        </Card>
        
        <div>
          <Card>
            <h2 style={{ fontSize: '1.25rem', margin: '0 0 1rem 0' }}>Order Summary</h2>
            {cart.items.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.875rem' }}>{item.quantity}x {item.product_details?.name || 'Product'}</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>${(parseFloat(item.product_details?.price || 0) * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1rem 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
              <span>Total</span>
              <span>${cart.total_price}</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
