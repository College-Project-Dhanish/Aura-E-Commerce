import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/auth';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import ErrorAlert from '../components/ui/ErrorAlert';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: ''
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      // Assuming register endpoint creates the user
      await authService.register(formData);
      // Auto-login after register
      await login({ username: formData.username, password: formData.password });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to register. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '4rem 0' }}>
      <Card style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Create an Account</h1>
          <p style={{ margin: 0 }}>Join Aura and start shopping.</p>
        </div>
        
        <ErrorAlert message={error} />
        
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Input label="First Name" name="first_name" required onChange={handleChange} />
            <Input label="Last Name" name="last_name" required onChange={handleChange} />
          </div>
          <Input label="Username" name="username" required onChange={handleChange} />
          <Input label="Email" type="email" name="email" required onChange={handleChange} />
          <Input label="Password" type="password" name="password" required onChange={handleChange} />
          
          <Button type="submit" variant="primary" style={{ width: '100%', marginTop: '1rem' }} isLoading={isLoading}>
            Register
          </Button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--accent-color)', fontWeight: 500 }}>Login here</Link>
        </div>
      </Card>
    </div>
  );
}
