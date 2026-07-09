import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function ProfilePage() {
  const { user } = useAuth();
  
  if (!user) return null;

  return (
    <div className="container" style={{ maxWidth: '600px', padding: '2rem 16px' }}>
      <h1 style={{ marginBottom: '2rem' }}>My Profile</h1>
      <Card>
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Personal Information</h2>
          <p style={{ margin: 0 }}>Update your personal details below.</p>
        </div>
        
        <form>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Input label="First Name" defaultValue={user.first_name || ''} readOnly />
            <Input label="Last Name" defaultValue={user.last_name || ''} readOnly />
          </div>
          <Input label="Username" defaultValue={user.username || ''} readOnly />
          <Input label="Email Address" type="email" defaultValue={user.email || ''} readOnly />
          <div style={{ marginTop: '1rem' }}>
            <Button variant="secondary" disabled>Update Profile</Button>
            <p style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>* Profile updates are disabled in this demo.</p>
          </div>
        </form>
      </Card>
    </div>
  );
}
