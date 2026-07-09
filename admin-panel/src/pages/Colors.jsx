import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import AdminPageHeader from '../components/AdminPageHeader';
import { Palette, Trash2, Plus } from 'lucide-react';

const Colors = () => {
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  
  const [formData, setFormData] = useState({ name: '', slug: '', is_active: true });

  const fetchColors = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/catalog/admin/colors/');
      setColors(res.data.results || res.data);
    } catch (error) {
      console.error("Failed to fetch colors", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = new FormData();
    payload.append('name', formData.name);
    if (formData.slug) payload.append('slug', formData.slug);
    if (file) payload.append('image', file);
    payload.append('is_active', formData.is_active);

    try {
      await axiosInstance.post('/catalog/admin/colors/', payload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setModalOpen(false);
      setFormData({ name: '', slug: '', is_active: true });
      setFile(null);
      fetchColors();
    } catch (error) {
      console.error("Failed to save color", error);
      alert("Failed to save color. Please check your input.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this color?")) {
      try {
        await axiosInstance.delete(`/catalog/admin/colors/${id}/`);
        fetchColors();
      } catch (error) {
        console.error("Failed to delete color", error);
        alert("Failed to delete. It might be in use by a variant.");
      }
    }
  };

  const openModal = () => {
    setFormData({ name: '', slug: '', is_active: true });
    setFile(null);
    setModalOpen(true);
  };

  return (
    <div>
      <AdminPageHeader 
        title="Colors" 
        description="Manage product colors and their representation." 
        icon={Palette}
        actionButton={
          <button 
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-neutral-900 text-white px-4 py-2 text-sm font-medium hover:bg-neutral-800 transition-colors"
          >
            <Plus size={16} /> Add Color
          </button>
        }
      />

      <div className="border border-neutral-200 bg-white overflow-x-auto dark:border-neutral-800 dark:bg-neutral-900">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-neutral-50 text-neutral-500 border-b border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700">
            <tr>
              <th className="px-6 py-3 font-medium w-16">Image</th>
              <th className="px-6 py-3 font-medium">ID</th>
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Slug</th>
              <th className="px-6 py-3 font-medium">Active</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {loading ? (
              <tr><td colSpan="6" className="px-6 py-4 text-center">Loading...</td></tr>
            ) : colors.length === 0 ? (
              <tr><td colSpan="6" className="px-6 py-4 text-center">No colors found.</td></tr>
            ) : (
              colors.map(color => (
                <tr key={color.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                  <td className="px-6 py-3">
                    {color.image ? (
                      <img src={color.image} alt={color.name} className="w-6 h-6 rounded-full object-cover border border-neutral-200" />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-neutral-200 border border-neutral-300 dark:bg-neutral-700 dark:border-neutral-600"></div>
                    )}
                  </td>
                  <td className="px-6 py-3 text-neutral-500">{color.id}</td>
                  <td className="px-6 py-3 font-medium text-neutral-900 dark:text-neutral-100">{color.name}</td>
                  <td className="px-6 py-3 text-neutral-500">{color.slug}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${color.is_active ? 'bg-green-100 text-green-800' : 'bg-neutral-100 text-neutral-800'}`}>
                      {color.is_active ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-6 py-3 flex items-center justify-end gap-3">
                    <button onClick={() => handleDelete(color.id)} className="text-neutral-400 hover:text-red-600 transition-colors">
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
            <h2 className="text-lg font-bold mb-4">Add Color</h2>
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
              <div>
                <label className="block text-sm font-medium mb-1">Color Circle Image</label>
                <input 
                  type="file"
                  accept="image/*"
                  className="w-full border border-neutral-300 p-1.5 text-sm dark:bg-neutral-800 dark:border-neutral-700"
                  onChange={(e) => setFile(e.target.files[0])}
                />
                <p className="text-xs text-neutral-500 mt-1">Upload a small circular image/swatch to represent the color.</p>
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox"
                  id="is_active"
                  className="w-4 h-4 border-neutral-300 rounded text-neutral-900 focus:ring-neutral-900"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                />
                <label htmlFor="is_active" className="text-sm font-medium">Active</label>
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

export default Colors;
