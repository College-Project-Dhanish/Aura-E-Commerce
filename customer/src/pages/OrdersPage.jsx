import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Truck, CheckCircle2, ChevronDown, Clock, AlertCircle } from 'lucide-react';
import { ordersService } from '../services/orders';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorAlert from '../components/ui/ErrorAlert';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await ordersService.getMyOrders();
        setOrders(data.orders || data.results || data || []);
      } catch (err) {
        setError('Failed to load orders.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <LoadingSpinner fullScreen />;

  const getStatusConfig = (status) => {
    const lowerStatus = (status || 'pending').toLowerCase();
    switch (lowerStatus) {
      case 'completed':
      case 'delivered':
        return { color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', icon: CheckCircle2, label: 'Completed' };
      case 'processing':
        return { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', icon: Package, label: 'Processing' };
      case 'shipped':
        return { color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', icon: Truck, label: 'Shipped' };
      case 'cancelled':
        return { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', icon: AlertCircle, label: 'Cancelled' };
      default:
        return { color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', icon: Clock, label: 'Pending' };
    }
  };

  return (
    <div className="bg-background min-h-screen pb-32 pt-12">
      <div className="max-w-5xl mx-auto px-6">
        
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-primary mb-4">ORDER HISTORY</h1>
          <p className="text-muted text-lg font-light">View and track your recent purchases.</p>
        </div>

        <ErrorAlert message={error} className="mb-8" />
        
        {orders.length === 0 && !error ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-border border-dashed p-16 flex flex-col items-center justify-center text-center shadow-sm"
          >
            <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mb-8">
              <Package className="w-10 h-10 text-muted" />
            </div>
            <h2 className="text-3xl font-bold text-primary mb-4">No orders yet</h2>
            <p className="text-muted text-lg font-light max-w-md mx-auto mb-10">When you place an order, it will appear here so you can track its status.</p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence>
              {orders.map((order, idx) => {
                const isExpanded = expandedOrderId === order.id;
                const statusConfig = getStatusConfig(order.status);
                const StatusIcon = statusConfig.icon;
                
                return (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={order.id || order.order_number}
                    className="bg-white rounded-3xl border border-border shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] overflow-hidden"
                  >
                    <div 
                      className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer hover:bg-secondary/50 transition-colors"
                      onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                    >
                      <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div>
                          <p className="text-xs font-bold tracking-widest uppercase text-muted mb-1">Order Number</p>
                          <p className="font-bold text-primary truncate">#{order.order_number || order.id}</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold tracking-widest uppercase text-muted mb-1">Date Placed</p>
                          <p className="font-medium text-primary">{new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold tracking-widest uppercase text-muted mb-1">Total Amount</p>
                          <p className="font-bold text-primary">${parseFloat(order.total || 0).toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold tracking-widest uppercase text-muted mb-1">Status</p>
                          <div className={cn("inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider", statusConfig.bg, statusConfig.color, statusConfig.border)}>
                            <StatusIcon className="w-3.5 h-3.5" />
                            {statusConfig.label}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end md:ml-4">
                        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-300", isExpanded ? "bg-primary text-white rotate-180" : "bg-secondary text-primary")}>
                          <ChevronDown className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                    
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-border bg-secondary/30"
                        >
                          <div className="p-6 md:p-8">
                            <h4 className="text-sm font-bold tracking-widest uppercase text-primary mb-6">Order Details</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div>
                                <h5 className="text-xs font-bold tracking-widest uppercase text-muted mb-3">Shipping Address</h5>
                                <div className="text-sm font-medium text-primary leading-relaxed bg-white p-5 rounded-2xl border border-border">
                                  {order.address ? (
                                    <>
                                      <p>{order.address.first_name} {order.address.last_name}</p>
                                      <p>{order.address.line1}</p>
                                      {order.address.line2 && <p>{order.address.line2}</p>}
                                      <p>{order.address.city}, {order.address.state} {order.address.postal_code}</p>
                                      <p>{order.address.country}</p>
                                    </>
                                  ) : (
                                    <p className="text-muted italic">Address details unavailable.</p>
                                  )}
                                </div>
                              </div>
                              
                              <div>
                                <h5 className="text-xs font-bold tracking-widest uppercase text-muted mb-3">Order Timeline</h5>
                                <div className="relative pl-6 space-y-6">
                                  <div className="absolute left-[11px] top-2 bottom-2 w-px bg-border"></div>
                                  
                                  <div className="relative">
                                    <div className="absolute left-[-29px] top-0 w-4 h-4 rounded-full border-[3px] border-white bg-primary shadow-sm z-10"></div>
                                    <p className="text-sm font-bold text-primary">Order Placed</p>
                                    <p className="text-xs text-muted">{new Date(order.created_at).toLocaleDateString()}</p>
                                  </div>
                                  
                                  <div className="relative opacity-40">
                                    <div className="absolute left-[-29px] top-0 w-4 h-4 rounded-full border-[3px] border-white bg-muted z-10"></div>
                                    <p className="text-sm font-bold text-primary">Processing</p>
                                  </div>
                                  
                                  <div className="relative opacity-40">
                                    <div className="absolute left-[-29px] top-0 w-4 h-4 rounded-full border-[3px] border-white bg-muted z-10"></div>
                                    <p className="text-sm font-bold text-primary">Delivered</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
