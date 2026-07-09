import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Truck, CreditCard, CheckCircle2, ChevronRight } from 'lucide-react';
import { cartService } from '../services/cart';
import { ordersService } from '../services/orders';
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

  const calculateTotal = () => {
    let sum = 0;
    cart?.items?.forEach(item => {
      sum += parseFloat(item.line_total || 0);
    });
    return sum.toFixed(2);
  };

  return (
    <div className="bg-background min-h-screen pb-32 pt-12">
      <div className="max-w-[1440px] mx-auto px-6">
        
        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-16 max-w-2xl mx-auto">
          <div className="flex items-center text-sm font-bold tracking-widest uppercase">
            <span className="text-primary flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-accent"/> Cart</span>
            <ChevronRight className="w-4 h-4 mx-4 text-border" />
            <span className="text-primary flex items-center gap-2"><span className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-[10px]">2</span> Checkout</span>
            <ChevronRight className="w-4 h-4 mx-4 text-border" />
            <span className="text-muted flex items-center gap-2"><span className="w-5 h-5 rounded-full border border-border flex items-center justify-center text-[10px]">3</span> Confirmation</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 xl:gap-20 items-start">
          
          {/* Left: Forms */}
          <div className="w-full lg:w-[60%]">
            <h1 className="text-3xl font-bold tracking-tighter text-primary mb-8">Checkout</h1>
            <ErrorAlert message={error} className="mb-8" />
            
            <form onSubmit={handleSubmit} className="space-y-12">
              
              {/* Contact & Shipping */}
              <div className="bg-white rounded-3xl p-8 border border-border shadow-sm">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary"><Truck className="w-5 h-5" /></div>
                  <h2 className="text-xl font-bold text-primary">Shipping Information</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Input label="First Name" name="first_name" required value={formData.first_name} onChange={handleChange} />
                    <Input label="Last Name" name="last_name" required value={formData.last_name} onChange={handleChange} />
                  </div>
                  
                  <Input label="Phone Number" name="phone" required value={formData.phone} onChange={handleChange} />
                  <Input label="Address Line 1" name="line1" required value={formData.line1} onChange={handleChange} placeholder="Street address or P.O. Box" />
                  <Input label="Address Line 2 (Optional)" name="line2" value={formData.line2} onChange={handleChange} placeholder="Apt, suite, unit, building, floor, etc." />
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Input label="City" name="city" required value={formData.city} onChange={handleChange} />
                    <Input label="State / Province" name="state" required value={formData.state} onChange={handleChange} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Input label="Postal Code" name="postal_code" required value={formData.postal_code} onChange={handleChange} />
                    <Input label="Country Code (e.g. US)" name="country" required maxLength="2" value={formData.country} onChange={handleChange} />
                  </div>
                </div>
              </div>

              {/* Payment Visual Placeholders */}
              <div className="bg-white rounded-3xl p-8 border border-border shadow-sm">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary"><CreditCard className="w-5 h-5" /></div>
                  <h2 className="text-xl font-bold text-primary">Payment Method</h2>
                </div>
                
                <div className="p-6 rounded-2xl border-2 border-primary bg-primary/5 flex items-center justify-between cursor-pointer mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-5 h-5 rounded-full border-[5px] border-primary"></div>
                    <span className="font-bold text-primary">Cash on Delivery</span>
                  </div>
                </div>
                <p className="text-sm text-muted italic ml-2">Note: Online payment integration is not active. Your order will be placed as COD.</p>
              </div>

              <Button type="submit" variant="primary" size="lg" className="w-full h-16 text-lg uppercase tracking-widest shadow-xl shadow-primary/20 hover:shadow-primary/30" isLoading={isSubmitting}>
                Complete Order
              </Button>
            </form>
          </div>
          
          {/* Right: Order Summary */}
          <div className="w-full lg:w-[40%] lg:sticky lg:top-[120px]">
            <div className="bg-primary text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              {/* Decorative background elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl"></div>
              
              <h2 className="text-2xl font-bold mb-8 tracking-tight relative z-10">Order Summary</h2>
              
              <div className="flex flex-col gap-6 mb-8 relative z-10 max-h-[40vh] overflow-y-auto custom-scrollbar pr-2">
                {cart.items.map(item => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="w-16 h-20 bg-white/10 rounded-lg flex-shrink-0 border border-white/20 flex items-center justify-center relative">
                      <span className="absolute -top-2 -right-2 w-5 h-5 bg-accent text-primary text-[10px] font-bold rounded-full flex items-center justify-center border border-white">
                        {item.quantity}
                      </span>
                      {/* image placeholder */}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm mb-1 line-clamp-1">{item.product_name || 'Product'}</h4>
                      <p className="text-xs text-gray-400 font-medium">{item.sku}</p>
                    </div>
                    <div className="font-bold text-sm">
                      ${parseFloat(item.line_total || 0).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="pt-6 border-t border-white/20 relative z-10 space-y-4 text-sm font-medium">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span>${calculateTotal()}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Shipping</span>
                  <span className="text-accent">Complimentary</span>
                </div>
                <div className="pt-4 mt-2 border-t border-white/20 flex justify-between items-end">
                  <span className="text-base font-bold">Total</span>
                  <span className="text-3xl font-bold text-accent">${calculateTotal()}</span>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest relative z-10">
                <ShieldCheck className="w-4 h-4 text-accent" /> Encrypted & Secure checkout
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
