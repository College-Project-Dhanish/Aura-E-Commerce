import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import AdminPageHeader from '../components/AdminPageHeader';
import { Mail, Download } from 'lucide-react';

const Subscribers = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/newsletter/subscribers/');
      setSubscribers(res.data.items || res.data.results || res.data);
    } catch (error) {
      console.error("Failed to fetch subscribers", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleExport = async () => {
    try {
      const res = await axiosInstance.get('/newsletter/subscribers/export/', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'subscribers.csv');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Failed to export", error);
      alert("Failed to export CSV");
    }
  };

  return (
    <div>
      <AdminPageHeader 
        title="Newsletter Subscribers" 
        description="Manage your email subscribers."
        icon={Mail} 
        actionButton={
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 bg-neutral-900 text-white px-4 py-2 text-sm font-medium hover:bg-neutral-800 transition-colors"
          >
            <Download size={16} /> Export CSV
          </button>
        }
      />
      
      <div className="border border-neutral-200 bg-white overflow-x-auto dark:border-neutral-800 dark:bg-neutral-900">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-neutral-50 text-neutral-500 border-b border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700">
            <tr>
              <th className="px-6 py-3 font-medium">Email</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Subscribed On</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {loading ? (
              <tr><td colSpan="3" className="px-6 py-4 text-center">Loading...</td></tr>
            ) : subscribers.length === 0 ? (
              <tr><td colSpan="3" className="px-6 py-4 text-center">No subscribers found.</td></tr>
            ) : (
              subscribers.map(s => (
                <tr key={s.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                  <td className="px-6 py-3 font-medium text-neutral-900 dark:text-neutral-100">{s.email}</td>
                  <td className="px-6 py-3">
                    {s.is_active ? 
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">Active</span> : 
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">Unsubscribed</span>
                    }
                  </td>
                  <td className="px-6 py-3 text-neutral-500">{new Date(s.created_at).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Subscribers;
