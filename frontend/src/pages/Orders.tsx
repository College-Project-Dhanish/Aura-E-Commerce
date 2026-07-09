import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { checkoutService } from '../services/api';
import { Order } from '../types';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Inbox } from 'lucide-react';

export const Orders: React.FC = () => {
  const { user } = useApp();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const history = await checkoutService.getOrders();
        setOrders(history);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-6 py-28 md:py-36 min-h-[80vh]">
      {/* Header */}
      <div className="border-b border-neutral-100 dark:border-neutral-900 pb-6 mb-12 flex flex-col sm:flex-row justify-between items-center gap-4 select-none">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-400">Order Receipts</span>
          <h1 className="text-2xl md:text-4xl font-display font-light text-brand-dark dark:text-white tracking-tight">
            Tailor Ledger History
          </h1>
        </div>
        
        <Link 
          to="/profile"
          className="text-xs font-mono text-neutral-400 hover:text-brand-dark dark:hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft size={12} />
          <span>Back to Profile</span>
        </Link>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-12 space-y-4 font-mono select-none">
          <div className="w-6 h-6 border-2 border-brand-dark dark:border-white border-t-transparent rounded-full animate-spin" />
          <span className="text-xs uppercase tracking-widest text-neutral-400">Fetching Ledger...</span>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 space-y-6 max-w-md mx-auto font-mono select-none">
          <div className="flex justify-center text-neutral-300 dark:text-neutral-700">
            <Inbox size={44} strokeWidth={1} />
          </div>
          <h2 className="font-display text-xl font-light text-brand-dark dark:text-white">No receipts found</h2>
          <p className="text-xs text-neutral-400 leading-relaxed font-sans">
            You currently have no historic receipts. Add items to your bag and check out to compile order ledger indexes.
          </p>
          <div className="pt-2">
            <Link
              to="/products"
              className="inline-flex bg-brand-dark text-white dark:bg-white dark:text-brand-dark px-6 py-3 text-xs uppercase tracking-widest font-semibold transition-transform duration-200 active:scale-95 hover:opacity-90 shadow-md"
            >
              Browse Products
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-8 select-none">
          {orders.map((order) => (
            <div 
              key={order.id}
              className="border border-neutral-200 dark:border-neutral-800 p-5 md:p-6 rounded-sm space-y-5 bg-white dark:bg-neutral-950/40"
            >
              {/* Order header detail */}
              <div className="flex flex-col sm:flex-row justify-between items-baseline gap-2 border-b border-neutral-100 dark:border-neutral-900 pb-4">
                <div className="space-y-1">
                  <p className="text-xs font-mono font-bold text-brand-dark dark:text-white uppercase">Receipt: {order.order_number}</p>
                  <p className="text-[10px] font-mono text-neutral-400">Dispatch Date: {order.date}</p>
                </div>

                <div className="flex items-center gap-3">
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

              {/* Items List */}
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

              {/* Shipment details */}
              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-900 text-[10px] font-mono text-neutral-400 flex flex-col sm:flex-row justify-between gap-2">
                <p>Shipment: {order.shipping_address.first_name} {order.shipping_address.last_name} • {order.shipping_address.line1}, {order.shipping_address.city}</p>
                {order.coupon_code && <p className="text-green-600 font-bold uppercase">Promo applied: {order.coupon_code}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default Orders;
