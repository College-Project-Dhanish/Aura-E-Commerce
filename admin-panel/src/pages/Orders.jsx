import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import AdminPageHeader from '../components/AdminPageHeader';
import { ShoppingBag } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/orders/admin/');
      setOrders(res.data.results || res.data);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (order_number, newStatus) => {
    try {
      await axiosInstance.put(`/orders/admin/${order_number}/`, { status: newStatus });
      fetchOrders();
    } catch (error) {
      console.error("Failed to update status", error);
      alert("Failed to update status");
    }
  };

  const statusColors = {
    'Pending': 'bg-yellow-100 text-yellow-800',
    'Confirmed': 'bg-blue-100 text-blue-800',
    'Packed': 'bg-purple-100 text-purple-800',
    'Shipped': 'bg-indigo-100 text-indigo-800',
    'Delivered': 'bg-green-100 text-green-800',
    'Cancelled': 'bg-red-100 text-red-800',
  };

  const statusOptions = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];

  return (
    <div>
      <AdminPageHeader title="Orders" description="Manage customer orders." icon={ShoppingBag} />
      
      <div className="border border-neutral-200 bg-white overflow-x-auto dark:border-neutral-800 dark:bg-neutral-900">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-neutral-50 text-neutral-500 border-b border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700">
            <tr>
              <th className="px-6 py-3 font-medium">Order #</th>
              <th className="px-6 py-3 font-medium">Customer</th>
              <th className="px-6 py-3 font-medium">Date</th>
              <th className="px-6 py-3 font-medium">Total</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {loading ? (
              <tr><td colSpan="6" className="px-6 py-4 text-center">Loading...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan="6" className="px-6 py-4 text-center">No orders found.</td></tr>
            ) : (
              orders.map(o => (
                <tr key={o.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                  <td className="px-6 py-3 font-medium text-neutral-900 dark:text-neutral-100">{o.order_number}</td>
                  <td className="px-6 py-3 text-neutral-500">{o.email}</td>
                  <td className="px-6 py-3 text-neutral-500">{new Date(o.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-3 font-medium text-neutral-900 dark:text-neutral-100">${parseFloat(o.total).toFixed(2)}</td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${statusColors[o.status] || 'bg-neutral-100 text-neutral-800'}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 flex justify-end">
                    <select 
                      className="border border-neutral-300 p-1.5 text-sm focus:border-neutral-900 focus:outline-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
                      value={o.status}
                      onChange={(e) => updateStatus(o.order_number, e.target.value)}
                    >
                      {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
