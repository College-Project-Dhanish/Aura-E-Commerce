import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import ErrorAlert from '../components/ui/ErrorAlert';
import { API_URL } from '../api/axiosInstance';

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
    <div className="container" style={{ maxWidth: '600px', padding: '2rem 16px' }}>
      <h1 style={{ marginBottom: '2rem' }}>My Profile</h1>
      <Card>
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Personal Information</h2>
          <p style={{ margin: 0 }}>Update your personal details below.</p>
        </div>

        {error && <div style={{ marginBottom: '1rem' }}><ErrorAlert message={error} /></div>}
        {success && (
          <div style={{ padding: '1rem', backgroundColor: '#d4edda', color: '#155724', borderRadius: '4px', marginBottom: '1rem' }}>
            Profile updated successfully!
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', backgroundColor: '#f0f0f0', border: '1px solid #ddd' }}>
              {imagePreview ? (
                <img src={imagePreview} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', fontSize: '0.8rem' }}>No Image</div>
              )}
            </div>
            <div>
              <Input type="file" accept="image/*" onChange={handleImageChange} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <Input label="First Name" name="first_name" value={formData.first_name} onChange={handleChange} />
            <Input label="Last Name" name="last_name" value={formData.last_name} onChange={handleChange} />
          </div>
          <Input label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} />
          <Input label="Email Address" type="email" value={user.email || ''} readOnly disabled style={{ backgroundColor: '#f9f9f9' }} />
          
          <div style={{ marginTop: '1.5rem' }}>
            <Button type="submit" variant="primary" disabled={loading} isLoading={loading}>
              {loading ? 'Updating...' : 'Update Profile'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
