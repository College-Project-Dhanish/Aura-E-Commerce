import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import AdminPageHeader from '../components/AdminPageHeader';
import { Ruler, Trash2, Plus } from 'lucide-react';

const Sizes = () => {
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', slug: '' });

  const fetchSizes = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/catalog/admin/sizes/');
      setSizes(res.data.results || res.data);
    } catch (error) {
      console.error("Failed to fetch sizes", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSizes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/catalog/admin/sizes/', formData);
      setModalOpen(false);
      fetchSizes();
    } catch (error) {
      console.error("Failed to save size", error);
      alert("Failed to save size. Please check your input.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this size?")) {
      try {
        await axiosInstance.delete(`/catalog/admin/sizes/${id}/`);
        fetchSizes();
      } catch (error) {
        console.error("Failed to delete size", error);
        alert("Failed to delete. It might be in use.");
      }
    }
  };

  const openModal = () => {
    setFormData({ name: '', slug: '' });
    setModalOpen(true);
  };

  return (
    <div>
      <AdminPageHeader 
        title="Sizes" 
        description="Manage product sizes (e.g. S, M, L, XL)." 
        icon={Ruler}
        actionButton={
          <button 
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-neutral-900 text-white px-4 py-2 text-sm font-medium hover:bg-neutral-800 transition-colors"
          >
            <Plus size={16} /> Add Size
          </button>
        }
      />

      <div className="border border-neutral-200 bg-white overflow-x-auto dark:border-neutral-800 dark:bg-neutral-900">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-neutral-50 text-neutral-500 border-b border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700">
            <tr>
              <th className="px-6 py-3 font-medium">ID</th>
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Slug</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {loading ? (
              <tr><td colSpan="4" className="px-6 py-4 text-center">Loading...</td></tr>
            ) : sizes.length === 0 ? (
              <tr><td colSpan="4" className="px-6 py-4 text-center">No sizes found.</td></tr>
            ) : (
              sizes.map(size => (
                <tr key={size.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                  <td className="px-6 py-3 text-neutral-500">{size.id}</td>
                  <td className="px-6 py-3 font-medium text-neutral-900 dark:text-neutral-100">{size.name}</td>
                  <td className="px-6 py-3 text-neutral-500">{size.slug}</td>
                  <td className="px-6 py-3 flex items-center justify-end gap-3">
                    <button onClick={() => handleDelete(size.id)} className="text-neutral-400 hover:text-red-600 transition-colors">
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
            <h2 className="text-lg font-bold mb-4">Add Size</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input 
                  type="text" required
                  className="w-full border border-neutral-300 p-2 text-sm focus:border-neutral-900 focus:outline-none dark:bg-neutral-800 dark:border-neutral-700"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Slug (Optional)</label>
                <input 
                  type="text"
                  className="w-full border border-neutral-300 p-2 text-sm focus:border-neutral-900 focus:outline-none dark:bg-neutral-800 dark:border-neutral-700"
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button 
                  type="button" 
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-neutral-900 text-white px-4 py-2 text-sm font-medium hover:bg-neutral-800 dark:bg-white dark:text-neutral-900"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sizes;
