import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { checkoutService } from '../services/api';
import { ShoppingBag, ArrowLeft, Plus, Minus, Trash2, ArrowRight, Tag } from 'lucide-react';

export const Cart: React.FC = () => {
  const { cart, cartTotal, removeFromCart, updateCartQuantity } = useApp();
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState<{ code: string; amount: number; message: string } | null>(null);
  const [couponError, setCouponError] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  // Math Calculations
  const shippingFee = cartTotal >= 100 || cartTotal === 0 ? 0 : 15;
  const taxFee = Math.round(cartTotal * 0.08); // 8% state tax
  const discountVal = couponApplied ? couponApplied.amount : 0;
  const finalTotal = cartTotal + shippingFee + taxFee - discountVal;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode) return;

    setIsValidating(true);
    setCouponError('');
    try {
      const res = await checkoutService.validateCoupon(couponCode, cartTotal);
      if (res.valid) {
        setCouponApplied({
          code: res.code,
          amount: res.discount_amount,
          message: res.message || 'Promo applied!'
        });
        setCouponCode('');
      } else {
        setCouponError(res.message || 'Invalid coupon code');
      }
    } catch (err) {
      setCouponError('Error validating coupon. Try again.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponApplied(null);
    setCouponError('');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-28 md:py-36 min-h-[70vh]">
      
      {/* Page Title */}
      <div className="border-b border-neutral-100 dark:border-neutral-900 pb-6 mb-12 text-center md:text-left space-y-1">
        <span className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-400">Your Selection</span>
        <h1 className="text-3xl md:text-5xl font-display font-light text-brand-dark dark:text-white tracking-tight">
          Shopping Bag
        </h1>
        <p className="text-xs font-mono text-neutral-400">Total Items: {cart.length}</p>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-24 space-y-6 max-w-md mx-auto select-none font-mono">
          <div className="flex justify-center text-neutral-300 dark:text-neutral-700">
            <ShoppingBag size={48} strokeWidth={1} />
          </div>
          <h2 className="font-display text-2xl font-light text-brand-dark dark:text-white normal-case font-sans">Your bag is empty</h2>
          <p className="text-xs text-neutral-400 leading-relaxed">
            There are currently no items saved in your cart. Settle for the highest grade garments today.
          </p>
          <div className="pt-2">
            <Link
              to="/products"
              className="bg-brand-dark dark:bg-white text-white dark:text-brand-dark px-8 py-4 text-xs tracking-widest uppercase font-semibold flex items-center justify-center gap-2.5 transition-transform duration-200 active:scale-95 hover:opacity-90 shadow-lg"
            >
              <ArrowLeft size={14} />
              <span>Browse capsule pieces</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 select-none">
          
          {/* Left: Item list (Cols: 7) */}
          <div className="lg:col-span-7 space-y-8">
            {cart.map((item) => {
              const displayImg = item.product.colors.find(c => c.name === item.selectedColor)?.images[0] || item.product.colors[0].images[0];
              return (
                <div 
                  key={item.id}
                  className="flex gap-4 md:gap-6 border-b border-neutral-100 dark:border-neutral-900 pb-6 items-start"
                >
                  {/* Thumbnail */}
                  <div className="w-20 md:w-28 aspect-[3/4] bg-neutral-50 dark:bg-neutral-900 shrink-0 overflow-hidden border border-neutral-100 dark:border-neutral-900">
                    <img src={displayImg} alt={item.product.name} className="w-full h-full object-cover object-top" />
                  </div>

                  {/* Info block */}
                  <div className="flex-1 flex flex-col md:flex-row md:justify-between gap-4">
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
                        {item.product.collection}
                      </span>
                      <Link 
                        to={`/products/${item.product.slug}`}
                        className="font-display font-medium text-sm text-brand-dark dark:text-white hover:text-neutral-500 transition-colors"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-xs font-mono text-neutral-400">
                        Size: <span className="text-brand-dark dark:text-white font-medium">{item.selectedSize}</span> • Color: <span className="text-brand-dark dark:text-white font-medium">{item.selectedColor}</span>
                      </p>

                      {/* Qty controller (Mobile only) */}
                      <div className="flex md:hidden items-center gap-2 pt-2">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="p-1 border border-neutral-200 rounded-sm hover:border-brand-dark transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-xs font-mono w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="p-1 border border-neutral-200 rounded-sm hover:border-brand-dark transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>

                    {/* Qty & Price row */}
                    <div className="flex items-center justify-between md:flex-col md:items-end gap-3 shrink-0">
                      
                      {/* Qty controller (Desktop only) */}
                      <div className="hidden md:flex items-center gap-3 bg-neutral-50 dark:bg-neutral-900 p-1.5 border border-neutral-100 dark:border-neutral-800">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="p-1 text-neutral-400 hover:text-brand-dark dark:hover:text-white transition-colors cursor-pointer"
                        >
                          <Minus size={11} />
                        </button>
                        <span className="text-xs font-mono w-6 text-center font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="p-1 text-neutral-400 hover:text-brand-dark dark:hover:text-white transition-colors cursor-pointer"
                        >
                          <Plus size={11} />
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-sm font-mono font-semibold text-brand-dark dark:text-white">
                          ${item.product.price * item.quantity}.00
                        </span>
                        
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-neutral-300 hover:text-red-500 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Summary panel (Cols: 5) */}
          <div className="lg:col-span-5 bg-neutral-50 dark:bg-neutral-900 p-6 md:p-8 border border-neutral-100 dark:border-neutral-800 flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              <h3 className="text-lg font-display font-light text-brand-dark dark:text-white pb-3 border-b border-neutral-200/60 dark:border-neutral-800">
                Billing Summary
              </h3>

              <div className="space-y-3.5 text-xs font-mono text-neutral-500 dark:text-neutral-400">
                <div className="flex justify-between">
                  <span>Cart Subtotal</span>
                  <span className="text-brand-dark dark:text-white font-semibold">${cartTotal}.00</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  {shippingFee === 0 ? (
                    <span className="text-green-600 dark:text-green-400 uppercase tracking-widest font-semibold">FREE</span>
                  ) : (
                    <span className="text-brand-dark dark:text-white font-semibold">${shippingFee}.00</span>
                  )}
                </div>

                <div className="flex justify-between">
                  <span>State Tax (8%)</span>
                  <span className="text-brand-dark dark:text-white font-semibold">${taxFee}.00</span>
                </div>

                {couponApplied && (
                  <div className="flex justify-between text-green-600 dark:text-green-400 items-center">
                    <span className="flex items-center gap-1.5"><Tag size={12} /><span>PROMO ({couponApplied.code})</span></span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">-${couponApplied.amount}.00</span>
                      <button onClick={handleRemoveCoupon} className="text-[9px] uppercase tracking-widest text-red-400 underline hover:text-red-500">Remove</button>
                    </div>
                  </div>
                )}
              </div>

              {/* Coupon inputs form */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2 pt-2 border-t border-b border-neutral-200/60 dark:border-neutral-800 py-4">
                <input
                  type="text"
                  placeholder="Promo coupon code"
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value);
                    if (couponError) setCouponError('');
                  }}
                  className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs px-3 py-2.5 flex-1 outline-none focus:border-brand-dark dark:focus:border-white transition-colors font-mono uppercase text-brand-dark dark:text-white"
                  disabled={isValidating || couponApplied !== null}
                />
                <button
                  type="submit"
                  disabled={isValidating || couponApplied !== null}
                  className="bg-brand-dark text-white dark:bg-white dark:text-brand-dark px-4 text-xs font-mono uppercase tracking-widest font-semibold hover:opacity-90 transition-opacity active:scale-95 disabled:opacity-50"
                >
                  {isValidating ? '...' : 'Apply'}
                </button>
              </form>
              
              {couponError && <p className="text-[10px] font-mono text-red-500">{couponError}</p>}
              {couponApplied && <p className="text-[10px] font-mono text-green-600">{couponApplied.message}</p>}
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex justify-between text-sm md:text-base text-brand-dark dark:text-white uppercase tracking-widest font-bold">
                <span>Estimated Total</span>
                <span className="font-mono">${finalTotal}.00</span>
              </div>

              <div className="space-y-2">
                <Link
                  to={{
                    pathname: "/checkout",
                  }}
                  state={{ coupon_code: couponApplied?.code, discount_total: discountVal }}
                  className="w-full bg-brand-dark hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-brand-dark py-4 px-6 text-xs font-mono tracking-widest uppercase font-semibold flex items-center justify-center gap-2.5 transition-transform duration-200 active:scale-95 shadow-xl"
                >
                  <span>Proceed to checkout</span>
                  <ArrowRight size={14} />
                </Link>

                <p className="text-[10px] text-center text-neutral-400 font-mono tracking-wider">
                  Complimentary 30-day eco-friendly exchanges.
                </p>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
export default Cart;
