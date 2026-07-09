import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import AdminPageHeader from '../components/AdminPageHeader';
import { Tag, Plus, Trash2 } from 'lucide-react';

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    code: '',
    discount_type: 'percentage',
    value: '',
    is_active: true,
  });

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/promotions/admin/coupons/');
      setCoupons(res.data.results || res.data);
    } catch (error) {
      console.error("Failed to fetch coupons", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/promotions/admin/coupons/', formData);
      setIsModalOpen(false);
      setFormData({ code: '', discount_type: 'percentage', value: '', is_active: true });
      fetchCoupons();
    } catch (error) {
      console.error("Failed to save", error);
      alert("Failed to save coupon");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      try {
        await axiosInstance.delete(`/promotions/admin/coupons/${id}/`);
        fetchCoupons();
      } catch (error) {
        console.error("Failed to delete", error);
      }
    }
  };

  return (
    <div>
      <AdminPageHeader 
        title="Coupons" 
        description="Manage promotional discount codes."
        icon={Tag} 
        actionButton={
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-neutral-900 text-white px-4 py-2 text-sm font-medium hover:bg-neutral-800 transition-colors"
          >
            <Plus size={16} /> Add Coupon
          </button>
        }
      />
      
      <div className="border border-neutral-200 bg-white overflow-x-auto dark:border-neutral-800 dark:bg-neutral-900">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-neutral-50 text-neutral-500 border-b border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700">
            <tr>
              <th className="px-6 py-3 font-medium">Code</th>
              <th className="px-6 py-3 font-medium">Type</th>
              <th className="px-6 py-3 font-medium">Value</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {loading ? (
              <tr><td colSpan="5" className="px-6 py-4 text-center">Loading...</td></tr>
            ) : coupons.length === 0 ? (
              <tr><td colSpan="5" className="px-6 py-4 text-center">No coupons found.</td></tr>
            ) : (
              coupons.map(c => (
                <tr key={c.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                  <td className="px-6 py-3 font-medium text-neutral-900 dark:text-neutral-100">{c.code}</td>
                  <td className="px-6 py-3 capitalize text-neutral-500">{c.discount_type}</td>
                  <td className="px-6 py-3 font-medium text-neutral-900">{c.discount_type === 'percentage' ? `${c.value}%` : `$${c.value}`}</td>
                  <td className="px-6 py-3">
                    {c.is_active ? 
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">Active</span> : 
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">Inactive</span>
                    }
                  </td>
                  <td className="px-6 py-3 flex items-center justify-end gap-3">
                    <button onClick={() => handleDelete(c.id)} className="text-neutral-400 hover:text-red-600 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md border border-neutral-900 bg-white p-6 shadow-[4px_4px_0_0_#171717] dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-[4px_4px_0_0_#404040]">
            <h2 className="text-lg font-bold mb-4">Add Coupon</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Code</label>
                <input required type="text" className="w-full border border-neutral-300 p-2 text-sm focus:border-neutral-900 focus:outline-none dark:bg-neutral-800 dark:border-neutral-700 uppercase" value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select className="w-full border border-neutral-300 p-2 text-sm focus:border-neutral-900 focus:outline-none dark:bg-neutral-800 dark:border-neutral-700" value={formData.discount_type} onChange={(e) => setFormData({...formData, discount_type: e.target.value})}>
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Value</label>
                  <input required type="number" step="0.01" className="w-full border border-neutral-300 p-2 text-sm focus:border-neutral-900 focus:outline-none dark:bg-neutral-800 dark:border-neutral-700" value={formData.value} onChange={(e) => setFormData({...formData, value: e.target.value})} />
                </div>
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <input type="checkbox" id="is_active" checked={formData.is_active} onChange={(e) => setFormData({...formData, is_active: e.target.checked})} />
                <label htmlFor="is_active" className="text-sm">Active</label>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400">Cancel</button>
                <button type="submit" className="bg-neutral-900 text-white px-4 py-2 text-sm font-medium hover:bg-neutral-800 dark:bg-white dark:text-neutral-900">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Coupons;
