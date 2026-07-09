import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Tag } from 'lucide-react';
import { cartService } from '../services/cart';
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
    <div className="bg-background min-h-screen pb-32 pt-12">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-primary mb-4">YOUR BAG</h1>
          {!isEmpty && (
            <p className="text-muted text-lg font-light">You have {cart.items.length} items in your bag.</p>
          )}
        </div>

        <ErrorAlert message={error} className="mb-8" />
        
        {isEmpty ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-border border-dashed p-16 flex flex-col items-center justify-center text-center max-w-3xl mx-auto shadow-sm"
          >
            <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mb-8">
              <ShoppingBag className="w-10 h-10 text-muted" />
            </div>
            <h2 className="text-3xl font-bold text-primary mb-4">Your bag is empty</h2>
            <p className="text-muted text-lg font-light max-w-md mx-auto mb-10">Looks like you haven't added anything to your cart yet. Explore our latest collections and find something you love.</p>
            <Link to="/products">
              <Button variant="primary" size="lg" className="px-12 uppercase tracking-widest text-sm shadow-lg shadow-primary/20 hover:shadow-primary/30">
                Continue Shopping
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12 xl:gap-16 items-start">
            
            {/* Left: Cart Items */}
            <div className="w-full lg:w-[65%]">
              <div className="hidden sm:grid grid-cols-12 gap-4 pb-4 border-b border-border text-xs font-bold tracking-widest uppercase text-muted mb-8">
                <div className="col-span-6">Product</div>
                <div className="col-span-3 text-center">Quantity</div>
                <div className="col-span-3 text-right">Total</div>
              </div>
              
              <div className="flex flex-col gap-8">
                <AnimatePresence>
                  {cart.items.map(item => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      key={item.id} 
                      className="group flex flex-col sm:grid sm:grid-cols-12 gap-6 sm:gap-4 items-start sm:items-center py-6 border-b border-border last:border-0"
                    >
                      <div className="col-span-6 flex gap-6 w-full">
                        <div className="w-28 aspect-[3/4] bg-secondary rounded-xl flex-shrink-0 overflow-hidden relative">
                           {/* Placeholder for item image if available, else generic */}
                           <img src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=200&auto=format&fit=crop" alt={item.product_name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        </div>
                        <div className="flex flex-col justify-center py-2">
                          <h3 className="text-lg font-bold text-primary mb-1 group-hover:text-accent transition-colors line-clamp-2">{item.product_name || 'Product'}</h3>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted font-medium mb-3">
                            {item.sku && <span>Variant: {item.sku}</span>}
                            {item.color && <span>Color: {item.color}</span>}
                            {item.size && <span>Size: {item.size}</span>}
                          </div>
                          <span className="text-primary font-bold block sm:hidden">${item.unit_price}</span>
                        </div>
                      </div>
                      
                      <div className="col-span-3 flex justify-start sm:justify-center w-full">
                        <div className="flex items-center bg-white rounded-full border border-border p-1 shadow-sm group-hover:border-primary transition-colors">
                          <button 
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-secondary transition-colors text-primary"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-10 text-center font-bold text-primary text-sm">{item.quantity}</span>
                          <button 
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-secondary transition-colors text-primary"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="col-span-3 flex justify-between sm:justify-end items-center w-full">
                        <span className="text-lg font-bold text-primary hidden sm:block">${parseFloat(item.line_total || 0).toFixed(2)}</span>
                        <button 
                          onClick={() => handleRemoveItem(item.id)}
                          className="sm:ml-6 text-muted hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50 flex items-center gap-2 sm:gap-0"
                        >
                          <Trash2 className="w-5 h-5" />
                          <span className="sm:hidden text-sm font-medium">Remove</span>
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
            
            {/* Right: Order Summary */}
            <div className="w-full lg:w-[35%] lg:sticky lg:top-[120px]">
              <div className="bg-white rounded-3xl border border-border p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <h2 className="text-2xl font-bold text-primary mb-8 tracking-tight">Order Summary</h2>
                
                <div className="space-y-4 mb-8 text-sm font-medium">
                  <div className="flex justify-between items-center text-muted">
                    <span>Subtotal</span>
                    <span className="text-primary font-bold">${calculateTotal()}</span>
                  </div>
                  <div className="flex justify-between items-center text-muted">
                    <span>Estimated Shipping</span>
                    <span className="text-primary font-bold text-accent">Free</span>
                  </div>
                  <div className="flex justify-between items-center text-muted">
                    <span>Tax</span>
                    <span className="text-primary font-bold">Calculated at checkout</span>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-border mb-8">
                  <div className="flex justify-between items-end">
                    <span className="text-base font-bold text-primary">Total</span>
                    <span className="text-3xl font-bold text-primary">${calculateTotal()}</span>
                  </div>
                </div>

                {/* Promo Code Visual Only */}
                <div className="mb-8">
                  <div className="relative">
                    <input type="text" placeholder="Promo code" className="w-full bg-secondary border border-transparent rounded-xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:border-primary focus:bg-white transition-all font-medium" />
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 text-sm font-bold text-primary hover:text-accent transition-colors px-3 py-1">Apply</button>
                  </div>
                </div>

                <Button 
                  variant="primary" 
                  size="lg" 
                  className="w-full h-16 text-sm uppercase tracking-widest shadow-xl shadow-primary/20 hover:shadow-primary/30" 
                  onClick={() => navigate('/checkout')}
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4 ml-2" />
                </Button>

                <div className="mt-8 pt-6 border-t border-border flex items-center justify-center gap-2 text-xs font-bold text-muted uppercase tracking-widest">
                  <ShieldCheck className="w-4 h-4" /> Secure SSL Checkout
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
