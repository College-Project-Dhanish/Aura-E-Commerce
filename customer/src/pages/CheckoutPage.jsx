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
    first_name: '',
    last_name: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'US', // default
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
      const payload = {
        address: formData,
        coupon_code: ''
      };
      await ordersService.checkout(payload);
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

  // Cart might use different field names depending on backend response.
  // In CartItemSerializer: unit_price, line_total, product_name, quantity, etc.
  const calculateTotal = () => {
    let sum = 0;
    cart?.items?.forEach(item => {
      sum += parseFloat(item.line_total || 0);
    });
    return sum.toFixed(2);
  };

  return (
    <div className="container" style={{ padding: '2rem 16px' }}>
      <h1 style={{ marginBottom: '2rem' }}>Checkout</h1>
      <ErrorAlert message={error} />
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
        <Card>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Shipping Address</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Input label="First Name" name="first_name" required value={formData.first_name} onChange={handleChange} style={{ flex: 1 }} />
              <Input label="Last Name" name="last_name" required value={formData.last_name} onChange={handleChange} style={{ flex: 1 }} />
            </div>
            
            <Input label="Phone Number" name="phone" required value={formData.phone} onChange={handleChange} />
            <Input label="Address Line 1" name="line1" required value={formData.line1} onChange={handleChange} />
            <Input label="Address Line 2 (Optional)" name="line2" value={formData.line2} onChange={handleChange} />
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Input label="City" name="city" required value={formData.city} onChange={handleChange} style={{ flex: 1 }} />
              <Input label="State" name="state" required value={formData.state} onChange={handleChange} style={{ flex: 1 }} />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <Input label="Postal Code" name="postal_code" required value={formData.postal_code} onChange={handleChange} style={{ flex: 1 }} />
              <Input label="Country Code (e.g. US)" name="country" required maxLength="2" value={formData.country} onChange={handleChange} style={{ flex: 1 }} />
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
                <span style={{ fontSize: '0.875rem' }}>{item.quantity}x {item.product_name || 'Product'}</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>${parseFloat(item.line_total || 0).toFixed(2)}</span>
              </div>
            ))}
            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1rem 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
              <span>Total</span>
              <span>${calculateTotal()}</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
