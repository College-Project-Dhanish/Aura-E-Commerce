import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { checkoutService } from '../services/api';
import { Address } from '../types';
import { ArrowLeft, CheckCircle2, Lock, ShoppingBag, ShieldCheck } from 'lucide-react';

export const Checkout: React.FC = () => {
  const { cart, cartTotal, clearCart } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<{ orderNumber: string } | null>(null);

  // Retrieve state passed from Cart.tsx (promo coupon codes / discount totals)
  const passedState = location.state as { coupon_code?: string; discount_total?: number } | null;
  const couponCode = passedState?.coupon_code || '';
  const discountTotal = passedState?.discount_total || 0;

  // Pricing math
  const shippingTotal = cartTotal >= 100 ? 0 : 15;
  const taxTotal = Math.round(cartTotal * 0.08);
  const finalTotal = cartTotal + shippingTotal + taxTotal - discountTotal;

  // React Hook Form initialization
  const { register, handleSubmit, formState: { errors } } = useForm<Address>({
    defaultValues: {
      first_name: '',
      last_name: '',
      phone: '',
      line1: '',
      line2: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'France'
    }
  });

  const onSubmitForm = async (addressData: Address) => {
    setIsSubmitting(true);
    try {
      const order = await checkoutService.placeOrder({
        address: addressData,
        coupon_code: couponCode || undefined,
        shipping_total: shippingTotal,
        tax_total: taxTotal,
        discount_total: discountTotal
      });

      // Clear the local state shopping cart
      clearCart();

      // Show success screen
      setOrderSuccess({ orderNumber: order.order_number });
    } catch (err) {
      console.error(err);
      alert('Error placing order. Please check that you have items in your bag.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="max-w-md mx-auto px-6 py-32 md:py-40 text-center space-y-8 select-none font-mono">
        <div className="flex justify-center text-green-500 animate-bounce">
          <CheckCircle2 size={56} />
        </div>
        
        <div className="space-y-3">
          <h1 className="font-display text-3xl font-light text-brand-dark dark:text-white normal-case font-sans">Order Confirmed</h1>
          <p className="text-xs text-neutral-400">Ledger Index: {orderSuccess.orderNumber}</p>
        </div>

        <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-sans font-light">
          Your tailored order has been successfully logged. An email with shipment tracking coordinates is being compiled for you.
        </p>

        <div className="pt-4 space-y-3">
          <Link
            to="/profile"
            className="block w-full bg-brand-dark dark:bg-white text-white dark:text-brand-dark py-3.5 text-xs uppercase tracking-widest font-semibold hover:opacity-90 transition-opacity active:scale-95 text-center"
          >
            Track Order History
          </Link>
          <Link
            to="/"
            className="block w-full border border-neutral-200 dark:border-neutral-800 text-brand-dark dark:text-white py-3.5 text-xs uppercase tracking-widest font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors text-center"
          >
            Return to Studio
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto px-6 py-32 md:py-40 text-center space-y-6 font-mono select-none">
        <h2 className="font-display text-xl font-light">No Items to Checkout</h2>
        <p className="text-xs text-neutral-400 font-sans">You cannot checkout an empty bag.</p>
        <Link
          to="/products"
          className="inline-flex bg-brand-dark text-white dark:bg-white dark:text-brand-dark px-6 py-3 text-xs uppercase tracking-widest font-semibold"
        >
          Browse Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-28 md:py-36">
      
      {/* Header */}
      <div className="border-b border-neutral-100 dark:border-neutral-900 pb-6 mb-12 flex flex-col md:flex-row justify-between items-center gap-4 select-none">
        <div className="space-y-1 text-center md:text-left">
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-400">Checkout Portal</span>
          <h1 className="text-2xl md:text-4xl font-display font-light text-brand-dark dark:text-white tracking-tight">
            Billing & Dispatch
          </h1>
        </div>
        
        <Link 
          to="/cart"
          className="text-xs font-mono text-neutral-400 hover:text-brand-dark dark:hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft size={12} />
          <span>Modify selection bag</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 select-none">
        
        {/* Left Column: Form entries (Cols: 7) */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-8">
            
            {/* Form Section: Personal Info */}
            <div className="space-y-4">
              <h2 className="text-xs font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-500 font-bold border-b border-neutral-100 dark:border-neutral-900 pb-2">
                1. Personal Coordinates
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase text-neutral-400">First Name *</label>
                  <input
                    type="text"
                    {...register('first_name', { required: 'First name is required' })}
                    className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs px-4 py-3.5 outline-none focus:border-brand-dark dark:focus:border-white transition-colors text-brand-dark dark:text-white"
                    placeholder="e.g. Jean"
                  />
                  {errors.first_name && <p className="text-[10px] font-mono text-red-500">{errors.first_name.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase text-neutral-400">Last Name *</label>
                  <input
                    type="text"
                    {...register('last_name', { required: 'Last name is required' })}
                    className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs px-4 py-3.5 outline-none focus:border-brand-dark dark:focus:border-white transition-colors text-brand-dark dark:text-white"
                    placeholder="e.g. Dupont"
                  />
                  {errors.last_name && <p className="text-[10px] font-mono text-red-500">{errors.last_name.message}</p>}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase text-neutral-400">Contact Phone Number *</label>
                <input
                  type="tel"
                  {...register('phone', { required: 'Contact phone is required' })}
                  className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs px-4 py-3.5 outline-none focus:border-brand-dark dark:focus:border-white transition-colors text-brand-dark dark:text-white"
                  placeholder="e.g. +33 6 1234 5678"
                />
                {errors.phone && <p className="text-[10px] font-mono text-red-500">{errors.phone.message}</p>}
              </div>
            </div>

            {/* Form Section: Shipping details */}
            <div className="space-y-4">
              <h2 className="text-xs font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-500 font-bold border-b border-neutral-100 dark:border-neutral-900 pb-2">
                2. Shipping Address
              </h2>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase text-neutral-400">Street Address *</label>
                <input
                  type="text"
                  {...register('line1', { required: 'Street address is required' })}
                  className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs px-4 py-3.5 outline-none focus:border-brand-dark dark:focus:border-white transition-colors text-brand-dark dark:text-white mb-2"
                  placeholder="Street name, house number, apartment"
                />
                <input
                  type="text"
                  {...register('line2')}
                  className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs px-4 py-3.5 outline-none focus:border-brand-dark dark:focus:border-white transition-colors text-brand-dark dark:text-white"
                  placeholder="Suite, unit, floor (optional)"
                />
                {errors.line1 && <p className="text-[10px] font-mono text-red-500">{errors.line1.message}</p>}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-1.5 col-span-2 md:col-span-1">
                  <label className="text-[10px] font-mono uppercase text-neutral-400">City / Township *</label>
                  <input
                    type="text"
                    {...register('city', { required: 'City is required' })}
                    className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs px-4 py-3.5 outline-none focus:border-brand-dark dark:focus:border-white transition-colors text-brand-dark dark:text-white"
                    placeholder="e.g. Paris"
                  />
                  {errors.city && <p className="text-[10px] font-mono text-red-500">{errors.city.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase text-neutral-400">State / Region *</label>
                  <input
                    type="text"
                    {...register('state', { required: 'State/Region is required' })}
                    className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs px-4 py-3.5 outline-none focus:border-brand-dark dark:focus:border-white transition-colors text-brand-dark dark:text-white"
                    placeholder="e.g. Île-de-France"
                  />
                  {errors.state && <p className="text-[10px] font-mono text-red-500">{errors.state.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase text-neutral-400">Postal Code *</label>
                  <input
                    type="text"
                    {...register('postal_code', { required: 'Postal code is required' })}
                    className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs px-4 py-3.5 outline-none focus:border-brand-dark dark:focus:border-white transition-colors text-brand-dark dark:text-white"
                    placeholder="e.g. 75001"
                  />
                  {errors.postal_code && <p className="text-[10px] font-mono text-red-500">{errors.postal_code.message}</p>}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase text-neutral-400">Country *</label>
                <select
                  {...register('country')}
                  className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs px-4 py-3.5 outline-none focus:border-brand-dark dark:focus:border-white transition-colors text-brand-dark dark:text-white"
                >
                  <option value="France">France</option>
                  <option value="Italy">Italy</option>
                  <option value="Japan">Japan</option>
                  <option value="Germany">Germany</option>
                  <option value="Portugal">Portugal</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="United States">United States</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-brand-dark dark:bg-white text-white dark:text-brand-dark py-4 px-6 text-xs font-mono tracking-widest uppercase font-semibold flex items-center justify-center gap-2.5 hover:opacity-90 transition-opacity active:scale-95 disabled:opacity-50 shadow-xl"
            >
              <Lock size={13} />
              <span>{isSubmitting ? 'SECURELY RECORDING...' : `AUTHORIZE DISPATCH & CHARGE $${finalTotal}.00`}</span>
            </button>

          </form>
        </div>

        {/* Right Column: Order Review ledger (Cols: 5) */}
        <div className="lg:col-span-5 bg-neutral-50 dark:bg-neutral-900 p-6 md:p-8 border border-neutral-100 dark:border-neutral-800 flex flex-col justify-between space-y-8 h-fit">
          
          <div className="space-y-6">
            <h3 className="text-xs font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-500 font-bold border-b border-neutral-200 dark:border-neutral-800 pb-2 flex items-center gap-1.5">
              <ShoppingBag size={13} />
              <span>Ledger Review</span>
            </h3>

            {/* List items brief */}
            <div className="space-y-4 max-h-56 overflow-y-auto no-scrollbar">
              {cart.map(item => {
                const img = item.product.colors.find(c => c.name === item.selectedColor)?.images[0] || item.product.colors[0].images[0];
                return (
                  <div key={item.id} className="flex gap-3.5 items-center">
                    <img src={img} alt="" className="w-10 h-13 object-cover object-top border shrink-0 bg-white" />
                    <div className="flex-1 min-w-0 text-xs">
                      <p className="font-semibold text-brand-dark dark:text-white truncate">{item.product.name}</p>
                      <p className="text-[10px] font-mono text-neutral-400">Qty: {item.quantity} • Size: {item.selectedSize} • Color: {item.selectedColor}</p>
                    </div>
                    <span className="text-xs font-mono font-semibold text-brand-dark dark:text-white shrink-0">${item.product.price * item.quantity}.00</span>
                  </div>
                );
              })}
            </div>

            {/* Price list brief */}
            <div className="space-y-3 pt-4 border-t border-neutral-200/60 dark:border-neutral-800 text-xs font-mono text-neutral-500">
              <div className="flex justify-between">
                <span>Subtotal Items</span>
                <span className="text-brand-dark dark:text-white font-semibold">${cartTotal}.00</span>
              </div>
              <div className="flex justify-between">
                <span>Dispatch shipping</span>
                <span>${shippingTotal}.00</span>
              </div>
              <div className="flex justify-between">
                <span>State VAT / Duties</span>
                <span>${taxTotal}.00</span>
              </div>
              {discountTotal > 0 && (
                <div className="flex justify-between text-green-600 dark:text-green-400 font-bold">
                  <span>Promo discount code</span>
                  <span>-${discountTotal}.00</span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-neutral-200/60 dark:border-neutral-800 flex justify-between text-sm md:text-base text-brand-dark dark:text-white uppercase tracking-widest font-bold">
              <span>Final Charge</span>
              <span className="font-mono">${finalTotal}.00</span>
            </div>
          </div>

          {/* Secure details info */}
          <div className="p-4 bg-white dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-800 rounded-sm space-y-2 select-none">
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-brand-dark dark:text-white font-semibold">
              <ShieldCheck size={14} className="text-green-500" />
              <span>TLS Security Shield Active</span>
            </div>
            <p className="text-[9px] text-neutral-400 leading-normal font-sans font-light">
              We encrypt billing pipelines in standard SHA-256 protocols. Your credit card information is routed directly to stripe sandboxes and never logs on our servers.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
export default Checkout;
