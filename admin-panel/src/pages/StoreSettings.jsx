import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import AdminPageHeader from '../components/AdminPageHeader';
import { Settings } from 'lucide-react';

const StoreSettings = () => {
  const [settings, setSettings] = useState({
    store_name: '',
    store_email: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axiosInstance.get('/dashboard/admin/settings/');
        setSettings(res.data);
      } catch (error) {
        console.error("Failed to fetch settings", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axiosInstance.put('/dashboard/admin/settings/', settings);
      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Failed to save settings", error);
      alert("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    setSettings({...settings, [e.target.name]: e.target.value});
  };

  return (
    <div>
      <AdminPageHeader title="Store Settings" description="Update global store configurations." icon={Settings} />
      
      {loading ? (
        <div className="p-8 text-center text-neutral-500">Loading...</div>
      ) : (
        <div className="bg-white border border-neutral-200 shadow-[4px_4px_0_0_#171717] p-8 max-w-2xl dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-[4px_4px_0_0_#404040]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">Store Name</label>
              <input required type="text" name="store_name" className="w-full border border-neutral-300 p-2.5 text-sm focus:border-neutral-900 focus:outline-none dark:bg-neutral-800 dark:border-neutral-700" value={settings.store_name} onChange={handleChange} />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Store Email</label>
              <input required type="email" name="store_email" className="w-full border border-neutral-300 p-2.5 text-sm focus:border-neutral-900 focus:outline-none dark:bg-neutral-800 dark:border-neutral-700" value={settings.store_email} onChange={handleChange} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Phone Number</label>
              <input required type="text" name="phone" className="w-full border border-neutral-300 p-2.5 text-sm focus:border-neutral-900 focus:outline-none dark:bg-neutral-800 dark:border-neutral-700" value={settings.phone} onChange={handleChange} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <textarea required name="address" rows="4" className="w-full border border-neutral-300 p-2.5 text-sm focus:border-neutral-900 focus:outline-none dark:bg-neutral-800 dark:border-neutral-700" value={settings.address} onChange={handleChange}></textarea>
            </div>

            <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800">
              <button disabled={saving} type="submit" className="bg-neutral-900 text-white px-6 py-2.5 text-sm font-medium hover:bg-neutral-800 transition-colors disabled:opacity-50 dark:bg-white dark:text-neutral-900">
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default StoreSettings;
