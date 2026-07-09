import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Settings, Camera, ShieldCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import ErrorAlert from '../components/ui/ErrorAlert';
import { API_URL } from '../api/axiosInstance';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    phone: user?.phone || '',
  });
  const [imageFile, setImageFile] = useState(null);

  if (!user) return null;

  const BASE_HOST = API_URL.replace(/\/api$/, '');
  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${BASE_HOST}${url}`;
  };

  const [imagePreview, setImagePreview] = useState(getImageUrl(user.profile_image));

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const data = new FormData();
      data.append('first_name', formData.first_name);
      data.append('last_name', formData.last_name);
      data.append('phone', formData.phone);
      if (imageFile) {
        data.append('profile_image', imageFile);
      }

      await updateProfile(data);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.detail || err.response?.data?.profile_image?.[0] || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-screen pb-32 pt-12">
      <div className="max-w-[1440px] mx-auto px-6">
        
        {/* Profile Header */}
        <div className="mb-12 border-b border-border pb-12">
          <div className="flex flex-col md:flex-row items-center gap-8 max-w-4xl mx-auto">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl bg-secondary">
                {imagePreview ? (
                  <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary text-white text-4xl font-bold">
                    {(formData.first_name || user.email || 'A').charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <label className="absolute bottom-0 right-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-accent transition-colors">
                <Camera className="w-5 h-5" />
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              </label>
            </div>
            
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tighter text-primary mb-2">
                {formData.first_name || formData.last_name ? `${formData.first_name} ${formData.last_name}` : 'Welcome, Member'}
              </h1>
              <p className="text-muted flex items-center justify-center md:justify-start gap-2">
                <Mail className="w-4 h-4" /> {user.email}
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-12">
          
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-3xl p-4 border border-border shadow-sm sticky top-[120px]">
              <nav className="flex flex-col gap-2">
                <button className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary text-white font-bold text-sm transition-colors">
                  <User className="w-4 h-4" /> Personal Details
                </button>
                <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted hover:bg-secondary hover:text-primary font-medium text-sm transition-colors cursor-not-allowed opacity-50">
                  <MapPin className="w-4 h-4" /> Saved Addresses
                </button>
                <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted hover:bg-secondary hover:text-primary font-medium text-sm transition-colors cursor-not-allowed opacity-50">
                  <ShieldCheck className="w-4 h-4" /> Security
                </button>
                <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted hover:bg-secondary hover:text-primary font-medium text-sm transition-colors cursor-not-allowed opacity-50">
                  <Settings className="w-4 h-4" /> Preferences
                </button>
              </nav>
            </div>
          </div>
          
          {/* Main Form Area */}
          <div className="flex-1">
            <div className="bg-white rounded-3xl p-8 md:p-10 border border-border shadow-sm">
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-primary mb-2">Personal Information</h2>
                <p className="text-muted font-light">Update your personal details and how we can reach you.</p>
              </div>

              {error && <ErrorAlert message={error} className="mb-8" />}
              {success && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-50 text-green-700 p-4 rounded-xl border border-green-200 flex items-start gap-3 shadow-sm mb-8"
                >
                  <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">Profile updated successfully.</span>
                </motion.div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="First Name" name="first_name" value={formData.first_name} onChange={handleChange} />
                  <Input label="Last Name" name="last_name" value={formData.last_name} onChange={handleChange} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} />
                  <Input label="Email Address" type="email" value={user.email || ''} readOnly disabled className="opacity-70 cursor-not-allowed" />
                </div>
                
                <div className="pt-8 border-t border-border mt-8 flex justify-end">
                  <Button type="submit" variant="primary" size="lg" className="px-10 shadow-lg shadow-primary/20" disabled={loading} isLoading={loading}>
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
