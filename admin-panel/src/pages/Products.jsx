import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import AdminPageHeader from '../components/AdminPageHeader';
import { Edit2, Trash2, Plus } from 'lucide-react';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  const initialFormState = {
    name: '', slug: '', category: '', collection: '',
    price: '', discount_price: '', sku: '', stock: 0,
    description: '', published: false, featured: false
  };
  const [formData, setFormData] = useState(initialFormState);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes, colRes] = await Promise.all([
        axiosInstance.get('/catalog/admin/products/'),
        axiosInstance.get('/catalog/admin/categories/'),
        axiosInstance.get('/catalog/admin/collections/')
      ]);
      setProducts(prodRes.data.results || prodRes.data);
      setCategories(catRes.data.results || catRes.data);
      setCollections(colRes.data.results || colRes.data);
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
      if (!payload.collection) delete payload.collection;
      if (!payload.discount_price) payload.discount_price = null;
      
      if (editingProduct) {
        await axiosInstance.put(`/catalog/admin/products/${editingProduct.id}/`, payload);
      } else {
        await axiosInstance.post('/catalog/admin/products/', payload);
      }
      setModalOpen(false);
      fetchData();
    } catch (error) {
      console.error("Failed to save product", error);
      alert("Failed to save product. Check required fields.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axiosInstance.delete(`/catalog/admin/products/${id}/`);
        fetchData();
      } catch (error) {
        console.error("Failed to delete", error);
        alert("Failed to delete.");
      }
    }
  };

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name, slug: product.slug,
        category: product.category, collection: product.collection || '',
        price: product.price, discount_price: product.discount_price || '',
        sku: product.sku, stock: product.stock,
        description: product.description, published: product.published,
        featured: product.featured
      });
    } else {
      setEditingProduct(null);
      setFormData(initialFormState);
    }
    setModalOpen(true);
  };

  return (
    <div>
      <AdminPageHeader 
        title="Products" 
        description="Manage your inventory and catalog." 
        actionButton={
          <button 
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-neutral-900 text-white px-4 py-2 text-sm font-medium hover:bg-neutral-800 transition-colors"
          >
            <Plus size={16} /> Add Product
          </button>
        }
      />

      <div className="border border-neutral-200 bg-white overflow-x-auto dark:border-neutral-800 dark:bg-neutral-900">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-neutral-50 text-neutral-500 border-b border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700">
            <tr>
              <th className="px-6 py-3 font-medium">SKU</th>
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Price</th>
              <th className="px-6 py-3 font-medium">Stock</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {loading ? (
              <tr><td colSpan="6" className="px-6 py-4 text-center">Loading...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan="6" className="px-6 py-4 text-center">No products found.</td></tr>
            ) : (
              products.map(prod => (
                <tr key={prod.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                  <td className="px-6 py-3 font-mono text-xs">{prod.sku}</td>
                  <td className="px-6 py-3 font-medium text-neutral-900 dark:text-neutral-100">{prod.name}</td>
                  <td className="px-6 py-3">${prod.price}</td>
                  <td className="px-6 py-3">{prod.stock}</td>
                  <td className="px-6 py-3">
                    {prod.published ? 
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">Published</span> : 
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-neutral-100 text-neutral-800">Draft</span>
                    }
                  </td>
                  <td className="px-6 py-3 flex items-center justify-end gap-3">
                    <button onClick={() => openModal(prod)} className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(prod.id)} className="text-neutral-400 hover:text-red-600 transition-colors">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="w-full max-w-2xl border border-neutral-900 bg-white p-6 shadow-[4px_4px_0_0_#171717] dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-[4px_4px_0_0_#404040] my-8">
            <h2 className="text-xl font-bold mb-6">{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input type="text" required className="w-full border border-neutral-300 p-2 text-sm focus:border-neutral-900 focus:outline-none dark:bg-neutral-800 dark:border-neutral-700" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">SKU</label>
                  <input type="text" required className="w-full border border-neutral-300 p-2 text-sm focus:border-neutral-900 focus:outline-none dark:bg-neutral-800 dark:border-neutral-700" value={formData.sku} onChange={(e) => setFormData({...formData, sku: e.target.value})} />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select required className="w-full border border-neutral-300 p-2 text-sm focus:border-neutral-900 focus:outline-none dark:bg-neutral-800 dark:border-neutral-700" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Collection (Optional)</label>
                  <select className="w-full border border-neutral-300 p-2 text-sm focus:border-neutral-900 focus:outline-none dark:bg-neutral-800 dark:border-neutral-700" value={formData.collection} onChange={(e) => setFormData({...formData, collection: e.target.value})}>
                    <option value="">None</option>
                    {collections.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Price</label>
                  <input type="number" step="0.01" required className="w-full border border-neutral-300 p-2 text-sm focus:border-neutral-900 focus:outline-none dark:bg-neutral-800 dark:border-neutral-700" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Discount Price</label>
                  <input type="number" step="0.01" className="w-full border border-neutral-300 p-2 text-sm focus:border-neutral-900 focus:outline-none dark:bg-neutral-800 dark:border-neutral-700" value={formData.discount_price} onChange={(e) => setFormData({...formData, discount_price: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Stock</label>
                  <input type="number" required className="w-full border border-neutral-300 p-2 text-sm focus:border-neutral-900 focus:outline-none dark:bg-neutral-800 dark:border-neutral-700" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea rows="3" className="w-full border border-neutral-300 p-2 text-sm focus:border-neutral-900 focus:outline-none dark:bg-neutral-800 dark:border-neutral-700" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
              </div>

              <div className="flex gap-6 mt-2">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={formData.published} onChange={(e) => setFormData({...formData, published: e.target.checked})} /> Published
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={formData.featured} onChange={(e) => setFormData({...formData, featured: e.target.checked})} /> Featured
                </label>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400">Cancel</button>
                <button type="submit" className="bg-neutral-900 text-white px-4 py-2 text-sm font-medium hover:bg-neutral-800 dark:bg-white dark:text-neutral-900">
                  {editingProduct ? 'Update Product' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
