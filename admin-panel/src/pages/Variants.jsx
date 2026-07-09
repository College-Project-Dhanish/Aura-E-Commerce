import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import AdminPageHeader from '../components/AdminPageHeader';
import { Layers, Plus, Trash2 } from 'lucide-react';

const Variants = () => {
  const [variants, setVariants] = useState([]);
  const [products, setProducts] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    product: '', color: '', size: '', sku: '',
    stock: 0, price_override: '', discount_price_override: ''
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [varRes, prodRes, colRes, sizeRes] = await Promise.all([
        axiosInstance.get('/catalog/admin/variants/'),
        axiosInstance.get('/catalog/admin/products/'),
        axiosInstance.get('/catalog/admin/colors/'),
        axiosInstance.get('/catalog/admin/sizes/')
      ]);
      setVariants(varRes.data.results || varRes.data);
      setProducts(prodRes.data.results || prodRes.data);
      setColors(colRes.data.results || colRes.data);
      setSizes(sizeRes.data.results || sizeRes.data);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      if (!payload.price_override) payload.price_override = null;
      if (!payload.discount_price_override) payload.discount_price_override = null;
      
      await axiosInstance.post('/catalog/admin/variants/', payload);
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error("Failed to save", error);
      alert("Failed to save variant");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this variant?")) {
      try {
        await axiosInstance.delete(`/catalog/admin/variants/${id}/`);
        fetchData();
      } catch (error) {
        console.error("Failed to delete", error);
      }
    }
  };

  return (
    <div>
      <AdminPageHeader 
        title="Product Variants" 
        description="Manage product variations like sizes and colors."
        icon={Layers} 
        actionButton={
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-neutral-900 text-white px-4 py-2 text-sm font-medium hover:bg-neutral-800 transition-colors"
          >
            <Plus size={16} /> Add Variant
          </button>
        }
      />
      
      <div className="border border-neutral-200 bg-white overflow-x-auto dark:border-neutral-800 dark:bg-neutral-900">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-neutral-50 text-neutral-500 border-b border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700">
            <tr>
              <th className="px-6 py-3 font-medium">SKU</th>
              <th className="px-6 py-3 font-medium">Product</th>
              <th className="px-6 py-3 font-medium">Color</th>
              <th className="px-6 py-3 font-medium">Size</th>
              <th className="px-6 py-3 font-medium">Stock</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {loading ? (
              <tr><td colSpan="6" className="px-6 py-4 text-center">Loading...</td></tr>
            ) : variants.length === 0 ? (
              <tr><td colSpan="6" className="px-6 py-4 text-center">No variants found.</td></tr>
            ) : (
              variants.map(v => (
                <tr key={v.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                  <td className="px-6 py-3 font-mono text-xs">{v.sku}</td>
                  <td className="px-6 py-3 font-medium text-neutral-900 dark:text-neutral-100">{v.product || 'N/A'}</td>
                  <td className="px-6 py-3 text-neutral-500">{v.color?.name || 'N/A'}</td>
                  <td className="px-6 py-3 text-neutral-500">{v.size?.name || 'N/A'}</td>
                  <td className="px-6 py-3">{v.stock}</td>
                  <td className="px-6 py-3 flex items-center justify-end gap-3">
                    <button onClick={() => handleDelete(v.id)} className="text-neutral-400 hover:text-red-600 transition-colors">
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
          <div className="w-full max-w-lg border border-neutral-900 bg-white p-6 shadow-[4px_4px_0_0_#171717] dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-[4px_4px_0_0_#404040]">
            <h2 className="text-lg font-bold mb-4">Add Variant</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Product</label>
                <select required className="w-full border border-neutral-300 p-2 text-sm focus:border-neutral-900 focus:outline-none dark:bg-neutral-800 dark:border-neutral-700" value={formData.product} onChange={(e) => setFormData({...formData, product: e.target.value})}>
                  <option value="">Select Product</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Color</label>
                  <select required className="w-full border border-neutral-300 p-2 text-sm focus:border-neutral-900 focus:outline-none dark:bg-neutral-800 dark:border-neutral-700" value={formData.color} onChange={(e) => setFormData({...formData, color: e.target.value})}>
                    <option value="">Select Color</option>
                    {colors.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Size</label>
                  <select required className="w-full border border-neutral-300 p-2 text-sm focus:border-neutral-900 focus:outline-none dark:bg-neutral-800 dark:border-neutral-700" value={formData.size} onChange={(e) => setFormData({...formData, size: e.target.value})}>
                    <option value="">Select Size</option>
                    {sizes.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">SKU</label>
                  <input required type="text" className="w-full border border-neutral-300 p-2 text-sm focus:border-neutral-900 focus:outline-none dark:bg-neutral-800 dark:border-neutral-700" value={formData.sku} onChange={(e) => setFormData({...formData, sku: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Stock</label>
                  <input required type="number" min="0" className="w-full border border-neutral-300 p-2 text-sm focus:border-neutral-900 focus:outline-none dark:bg-neutral-800 dark:border-neutral-700" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} />
                </div>
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

export default Variants;
