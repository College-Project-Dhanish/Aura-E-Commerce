import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import AdminPageHeader from '../components/AdminPageHeader';
import { Image as ImageIcon, Trash2, Plus } from 'lucide-react';

const ProductImages = () => {
  const [images, setImages] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [file, setFile] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [imgRes, prodRes] = await Promise.all([
        axiosInstance.get('/catalog/admin/images/'),
        axiosInstance.get('/catalog/admin/products/')
      ]);
      setImages(imgRes.data.results || imgRes.data);
      setProducts(prodRes.data.results || prodRes.data);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !selectedProduct) return alert("Select product and file");
    
    const formData = new FormData();
    formData.append('product', selectedProduct);
    formData.append('image', file);
    formData.append('sort_order', 0); // Default to 0 for simplicity

    try {
      await axiosInstance.post('/catalog/admin/images/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFile(null);
      fetchData();
    } catch (error) {
      console.error("Upload failed", error);
      alert("Upload failed");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      try {
        await axiosInstance.delete(`/catalog/admin/images/${id}/`);
        fetchData();
      } catch (error) {
        console.error("Delete failed", error);
      }
    }
  };

  return (
    <div>
      <AdminPageHeader title="Product Images" description="Upload and manage product gallery images." icon={ImageIcon} />
      
      <div className="mb-6 bg-white border border-neutral-200 p-6 shadow-[4px_4px_0_0_#171717] dark:bg-neutral-900 dark:border-neutral-700 flex flex-col md:flex-row md:items-end gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Product</label>
          <select className="w-full border border-neutral-300 p-2 text-sm focus:border-neutral-900 focus:outline-none dark:bg-neutral-800 dark:border-neutral-700" value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)}>
            <option value="">Select a Product</option>
            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Image File</label>
          <input type="file" onChange={e => setFile(e.target.files[0])} className="w-full border border-neutral-300 p-1.5 text-sm dark:border-neutral-700 bg-white dark:bg-neutral-800" />
        </div>
        <button onClick={handleUpload} className="flex items-center justify-center gap-2 bg-neutral-900 text-white px-6 py-2 text-sm font-medium hover:bg-neutral-800 transition-colors h-10 w-full md:w-auto">
          <Plus size={16} /> Upload
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-center text-neutral-500">Loading...</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {images.map(img => (
            <div key={img.id} className="relative group border border-neutral-200 bg-white p-2 dark:border-neutral-700 dark:bg-neutral-800">
              <img src={img.image} alt="Product" className="w-full h-32 object-cover border border-neutral-100 dark:border-neutral-700" />
              <div className="mt-2 text-xs text-neutral-500 truncate">Product ID: {img.product || 'N/A'}</div>
              <button 
                onClick={() => handleDelete(img.id)}
                className="absolute top-3 right-3 p-1.5 bg-white border border-neutral-200 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 shadow-sm"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          {images.length === 0 && (
            <div className="col-span-full py-12 text-center text-neutral-500 border border-dashed border-neutral-300 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800/50">
              No images uploaded yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductImages;
