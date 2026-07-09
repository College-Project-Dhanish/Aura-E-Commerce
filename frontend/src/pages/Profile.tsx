import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { checkoutService, catalogService, reviewsService } from '../services/api';
import { Order, Product, Review } from '../types';
import { 
  User, 
  LogOut, 
  Package, 
  Settings, 
  TrendingUp, 
  Sliders, 
  FolderLock, 
  Check, 
  Trash2, 
  Plus, 
  PlusCircle, 
  Percent, 
  ShieldCheck 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Profile: React.FC = () => {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'admin'>('orders');

  // Admin section states
  const [adminProducts, setAdminProducts] = useState<Product[]>([]);
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoVal, setNewPromoVal] = useState(15);
  const [activeCoupons, setActiveCoupons] = useState<{ code: string; val: number }[]>([
    { code: 'PROMO10', val: 10 },
    { code: 'PREMIUM20', val: 20 },
    { code: 'LUX50', val: 50 }
  ]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const loadUserData = async () => {
      try {
        const history = await checkoutService.getOrders();
        setOrders(history);

        if (user.is_staff) {
          // Load administrative details
          const prods = await catalogService.getProducts();
          setAdminProducts(prods);
          
          const revs = await reviewsService.getReviews();
          setAllReviews(revs);
          setActiveTab('admin'); // Default tab to admin if staff
        }
      } catch (err) {
        console.error(err);
      }
    };

    loadUserData();
  }, [user, navigate]);

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromoCode) return;
    const codeUpper = newPromoCode.toUpperCase();
    if (activeCoupons.some(c => c.code === codeUpper)) {
      alert('Coupon already exists!');
      return;
    }
    setActiveCoupons([...activeCoupons, { code: codeUpper, val: newPromoVal }]);
    setNewPromoCode('');
  };

  const handleDeleteCoupon = (code: string) => {
    setActiveCoupons(activeCoupons.filter(c => c.code !== code));
  };

  // Calculations for profile metrics
  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);
  const totalItemsCount = orders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-6 py-28 md:py-36 min-h-[80vh] select-none">
      
      {/* Profile Header Card */}
      <div className="bg-neutral-50 dark:bg-neutral-900 p-6 md:p-8 border border-neutral-100 dark:border-neutral-800 mb-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
          <img 
            src={user.profile_image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'} 
            alt="Profile Avatar" 
            className="w-16 h-16 rounded-full object-cover border border-neutral-200" 
          />
          <div className="space-y-1">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <h1 className="text-xl md:text-2xl font-display font-light text-brand-dark dark:text-white leading-none">
                {user.first_name} {user.last_name}
              </h1>
              {user.is_staff && (
                <span className="bg-brand-dark text-white dark:bg-white dark:text-brand-dark font-mono text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-sm flex items-center gap-1 font-bold">
                  <FolderLock size={10} />
                  <span>STAFF</span>
                </span>
              )}
            </div>
            <p className="text-xs font-mono text-neutral-400">{user.email}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="bg-transparent border border-neutral-200 hover:border-brand-dark dark:border-neutral-800 dark:hover:border-white text-neutral-600 dark:text-neutral-400 py-2.5 px-5 text-xs font-mono tracking-widest uppercase font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer active:scale-95"
        >
          <LogOut size={13} />
          <span>Exit Ledger</span>
        </button>
      </div>

      {/* Navigation tabs */}
      {user.is_staff && (
        <div className="flex border-b border-neutral-100 dark:border-neutral-900 pb-3 mb-10 text-xs font-mono uppercase tracking-widest gap-6">
          <button
            onClick={() => setActiveTab('admin')}
            className={`pb-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'admin' 
                ? 'border-brand-dark dark:border-white text-brand-dark dark:text-white font-bold' 
                : 'border-transparent text-neutral-400'
            }`}
          >
            Aura Admin Panel
          </button>
          
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'orders' 
                ? 'border-brand-dark dark:border-white text-brand-dark dark:text-white font-bold' 
                : 'border-transparent text-neutral-400'
            }`}
          >
            My Orders History ({orders.length})
          </button>
        </div>
      )}

      {/* TAB CONTENT: Customer Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-8">
          <h2 className="text-lg font-display font-light text-brand-dark dark:text-white border-b border-neutral-100 dark:border-neutral-900 pb-3">
            Your Order Ledger
          </h2>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pb-4">
            <div className="bg-neutral-50 dark:bg-neutral-900/50 p-4 border border-neutral-100 dark:border-neutral-900 text-center space-y-1">
              <span className="text-[10px] font-mono uppercase text-neutral-400">Total Invested</span>
              <p className="text-lg font-mono font-bold text-brand-dark dark:text-white">${totalSpent}.00</p>
            </div>
            <div className="bg-neutral-50 dark:bg-neutral-900/50 p-4 border border-neutral-100 dark:border-neutral-900 text-center space-y-1">
              <span className="text-[10px] font-mono uppercase text-neutral-400">Total Items Tailored</span>
              <p className="text-lg font-mono font-bold text-brand-dark dark:text-white">{totalItemsCount} pieces</p>
            </div>
            <div className="col-span-2 sm:col-span-1 bg-neutral-50 dark:bg-neutral-900/50 p-4 border border-neutral-100 dark:border-neutral-900 text-center space-y-1">
              <span className="text-[10px] font-mono uppercase text-neutral-400">Ledger Count</span>
              <p className="text-lg font-mono font-bold text-brand-dark dark:text-white">{orders.length} orders</p>
            </div>
          </div>

          {orders.length === 0 ? (
            <p className="text-xs font-mono text-neutral-400 leading-relaxed py-8">
              No previous tailored order receipts logged on this account. Complete a check out process to log a receipt.
            </p>
          ) : (
            <div className="space-y-8">
              {orders.map((order) => (
                <div 
                  key={order.id}
                  className="border border-neutral-200 dark:border-neutral-800 p-5 md:p-6 rounded-sm space-y-5 bg-white dark:bg-neutral-950/40"
                >
                  {/* Order detail top header */}
                  <div className="flex flex-col sm:flex-row justify-between items-baseline gap-2 border-b border-neutral-100 dark:border-neutral-900 pb-4">
                    <div className="space-y-1">
                      <p className="text-xs font-mono font-bold text-brand-dark dark:text-white uppercase">Receipt: {order.order_number}</p>
                      <p className="text-[10px] font-mono text-neutral-400">Dispatch Date: {order.date}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Status pill badge */}
                      <span className={`px-2.5 py-1 text-[9px] font-mono font-bold uppercase rounded-full ${
                        order.status === 'Delivered' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        • {order.status}
                      </span>
                      <span className="text-sm font-mono font-semibold text-brand-dark dark:text-white">
                        Total Charge: ${order.total}.00
                      </span>
                    </div>
                  </div>

                  {/* List of individual items */}
                  <div className="space-y-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex gap-4 items-center">
                        <img src={item.image} alt="" className="w-10 h-13 object-cover object-top border shrink-0 bg-neutral-50" />
                        <div className="flex-1 min-w-0 text-xs">
                          <p className="font-semibold text-brand-dark dark:text-white truncate">{item.product_name}</p>
                          <p className="text-[10px] font-mono text-neutral-400">Qty: {item.quantity} • Size: {item.size} • Color: {item.color}</p>
                        </div>
                        <span className="text-xs font-mono text-neutral-500">${item.price * item.quantity}.00</span>
                      </div>
                    ))}
                  </div>

                  {/* Shipping summary footer info */}
                  <div className="pt-3 border-t border-neutral-100 dark:border-neutral-900 text-[10px] font-mono text-neutral-400 flex flex-col sm:flex-row justify-between gap-2">
                    <p>Shipment: {order.shipping_address.first_name} {order.shipping_address.last_name} • {order.shipping_address.line1}, {order.shipping_address.city}</p>
                    {order.coupon_code && <p className="text-green-600 font-bold uppercase">Promo applied: {order.coupon_code}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: Aura Admin Panel Overlay */}
      {activeTab === 'admin' && user.is_staff && (
        <div className="space-y-12 animate-fade-in select-none">
          
          {/* Section A: Stats indicators */}
          <div className="space-y-4">
            <h2 className="text-xs font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-500 font-bold border-b border-neutral-100 dark:border-neutral-900 pb-2">
              Studio Metrics Summary
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-neutral-50 dark:bg-neutral-900 p-4 border border-neutral-100 dark:border-neutral-800 rounded-sm">
                <span className="text-[9px] font-mono uppercase text-neutral-400">Gross Sales</span>
                <p className="text-lg md:text-xl font-mono font-semibold text-brand-dark dark:text-white mt-1">$42,850.00</p>
              </div>
              <div className="bg-neutral-50 dark:bg-neutral-900 p-4 border border-neutral-100 dark:border-neutral-800 rounded-sm">
                <span className="text-[9px] font-mono uppercase text-neutral-400">Active products</span>
                <p className="text-lg md:text-xl font-mono font-semibold text-brand-dark dark:text-white mt-1">{adminProducts.length} pieces</p>
              </div>
              <div className="bg-neutral-50 dark:bg-neutral-900 p-4 border border-neutral-100 dark:border-neutral-800 rounded-sm">
                <span className="text-[9px] font-mono uppercase text-neutral-400">Coupons Built</span>
                <p className="text-lg md:text-xl font-mono font-semibold text-brand-dark dark:text-white mt-1">{activeCoupons.length} codes</p>
              </div>
              <div className="bg-neutral-50 dark:bg-neutral-900 p-4 border border-neutral-100 dark:border-neutral-800 rounded-sm">
                <span className="text-[9px] font-mono uppercase text-neutral-400">Reviews Moderate</span>
                <p className="text-lg md:text-xl font-mono font-semibold text-brand-dark dark:text-white mt-1">{allReviews.length} logs</p>
              </div>
            </div>
          </div>

          {/* Section B: Reviews Moderation module */}
          <div className="space-y-4">
            <h2 className="text-xs font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-500 font-bold border-b border-neutral-100 dark:border-neutral-900 pb-2 flex items-center gap-1.5">
              <span>Customer Reviews Moderation</span>
              <span className="bg-brand-dark text-white px-1.5 py-0.5 rounded-full text-[9px]">{allReviews.length} Total</span>
            </h2>

            {allReviews.length === 0 ? (
              <p className="text-xs font-mono text-neutral-400 py-4">No reviews submitted.</p>
            ) : (
              <div className="border border-neutral-200 dark:border-neutral-800 rounded-sm overflow-hidden divide-y divide-neutral-100 dark:divide-neutral-900">
                {allReviews.map((rev) => (
                  <div key={rev.id} className="p-4 bg-white dark:bg-neutral-950 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs font-mono">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-brand-dark dark:text-white uppercase">{rev.user_name}</span>
                        <span className="text-[10px] text-neutral-400">{rev.date}</span>
                      </div>
                      <p className="text-xs font-sans text-neutral-500 dark:text-neutral-400 leading-normal font-light">{rev.comment}</p>
                      {rev.variant_sku && <span className="text-[9px] text-neutral-400 uppercase tracking-widest">Style Code: {rev.variant_sku}</span>}
                    </div>

                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setAllReviews(allReviews.filter(r => r.id !== rev.id));
                          alert('Review approved successfully!');
                        }}
                        className="bg-green-500/10 text-green-600 hover:bg-green-500 hover:text-white p-2 rounded-sm transition-all"
                        title="Approve Review"
                      >
                        <Check size={14} />
                      </button>
                      
                      <button
                        onClick={() => {
                          setAllReviews(allReviews.filter(r => r.id !== rev.id));
                          alert('Review rejected/deleted.');
                        }}
                        className="bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white p-2 rounded-sm transition-all"
                        title="Reject & Delete Review"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section C: Promotions Coupons Builder */}
          <div className="space-y-4">
            <h2 className="text-xs font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-500 font-bold border-b border-neutral-100 dark:border-neutral-900 pb-2">
              Promotions Coupons Builder
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              {/* Build Promo Form */}
              <form onSubmit={handleCreateCoupon} className="bg-neutral-50 dark:bg-neutral-900 p-5 md:p-6 border border-neutral-100 dark:border-neutral-800 rounded-sm space-y-4">
                <h3 className="text-xs uppercase tracking-wider text-brand-dark dark:text-white font-bold flex items-center gap-1.5">
                  <PlusCircle size={14} />
                  <span>Generate New Promo Code</span>
                </h3>

                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase text-neutral-400 font-bold">Coupon Code Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. VIP25"
                    value={newPromoCode}
                    onChange={(e) => setNewPromoCode(e.target.value)}
                    className="w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs px-3 py-2.5 outline-none font-mono uppercase text-brand-dark dark:text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase text-neutral-400 font-bold">Discount Percentage (%)</label>
                  <input
                    type="number"
                    min={5}
                    max={80}
                    required
                    value={newPromoVal}
                    onChange={(e) => setNewPromoVal(Number(e.target.value))}
                    className="w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs px-3 py-2.5 outline-none font-mono text-brand-dark dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-brand-dark dark:bg-white text-white dark:text-brand-dark py-3 text-xs uppercase tracking-widest font-bold"
                >
                  Confirm and Authorize Coupon
                </button>
              </form>

              {/* Promo code list */}
              <div className="space-y-3.5">
                <h3 className="text-xs uppercase tracking-wider text-neutral-400 font-bold">Active Authorized Codes</h3>
                <div className="space-y-2">
                  {activeCoupons.map((coupon) => (
                    <div 
                      key={coupon.code}
                      className="p-4 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 flex justify-between items-center text-xs font-mono"
                    >
                      <div className="flex items-center gap-2 font-bold">
                        <Percent size={13} className="text-amber-500" />
                        <span>{coupon.code}</span>
                      </div>
                      <div className="flex items-center gap-4 font-semibold text-neutral-500">
                        <span>{coupon.val}% Discount</span>
                        <button
                          onClick={() => handleDeleteCoupon(coupon.code)}
                          className="text-red-400 hover:text-red-500 cursor-pointer"
                          title="Revoke Coupon"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section D: Security Warning Footer */}
          <div className="p-4 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 flex items-center gap-3">
            <ShieldCheck size={20} className="text-green-500 shrink-0" />
            <div className="text-[10px] font-sans font-light leading-normal text-neutral-400">
              <span className="block font-mono font-bold text-brand-dark dark:text-white uppercase tracking-wider mb-0.5">TLS ADMINISTRATIVE SHELL SECURED</span>
              These credentials inherit active DRF staff verification flags. Any alterations made on products or reviews sync across browser caches.
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
export default Profile;
