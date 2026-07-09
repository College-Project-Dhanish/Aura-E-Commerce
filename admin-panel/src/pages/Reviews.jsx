import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import AdminPageHeader from '../components/AdminPageHeader';
import { Star, Check, X } from 'lucide-react';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/reviews/admin/pending/');
      setReviews(res.data.items || res.data.results || res.data);
    } catch (error) {
      console.error("Failed to fetch reviews", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleAction = async (id, action) => {
    try {
      await axiosInstance.patch(`/reviews/admin/${id}/${action}/`);
      fetchReviews();
    } catch (error) {
      console.error(`Failed to ${action} review`, error);
      alert(`Failed to ${action} review`);
    }
  };

  return (
    <div>
      <AdminPageHeader title="Pending Reviews" description="Approve or reject customer reviews." icon={Star} />
      
      <div className="border border-neutral-200 bg-white overflow-x-auto dark:border-neutral-800 dark:bg-neutral-900">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-neutral-50 text-neutral-500 border-b border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700">
            <tr>
              <th className="px-6 py-3 font-medium">Product</th>
              <th className="px-6 py-3 font-medium">Rating</th>
              <th className="px-6 py-3 font-medium">Comment</th>
              <th className="px-6 py-3 font-medium">User</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {loading ? (
              <tr><td colSpan="5" className="px-6 py-4 text-center">Loading...</td></tr>
            ) : reviews.length === 0 ? (
              <tr><td colSpan="5" className="px-6 py-4 text-center">No pending reviews.</td></tr>
            ) : (
              reviews.map(r => (
                <tr key={r.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                  <td className="px-6 py-3 font-medium text-neutral-900 dark:text-neutral-100">{r.product_name}</td>
                  <td className="px-6 py-3 text-neutral-900 font-medium">{r.rating} / 5</td>
                  <td className="px-6 py-3 text-neutral-500 truncate max-w-xs">{r.comment}</td>
                  <td className="px-6 py-3 text-neutral-500">{r.user_name || 'Anonymous'}</td>
                  <td className="px-6 py-3 flex items-center justify-end gap-3">
                    <button onClick={() => handleAction(r.id, 'approve')} className="text-green-600 hover:text-green-800 transition-colors flex items-center gap-1">
                      <Check size={16} /> Approve
                    </button>
                    <button onClick={() => handleAction(r.id, 'reject')} className="text-red-600 hover:text-red-800 transition-colors flex items-center gap-1">
                      <X size={16} /> Reject
                    </button>
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

export default Reviews;
