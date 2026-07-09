import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/auth';
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
      await authService.register(formData);
      await login({ username: formData.username, password: formData.password });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to register. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-row-reverse">
      {/* Right: Form Area */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 md:px-24 xl:px-32 relative z-10 py-20 lg:py-0">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="mb-12 text-center lg:text-left">
            <h1 className="text-4xl font-bold tracking-tighter text-primary mb-3">Join Aura</h1>
            <p className="text-muted font-light text-lg">Create an account to access premium collections.</p>
          </div>

          <ErrorAlert message={error} className="mb-8" />

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input label="First Name" name="first_name" required onChange={handleChange} />
              <Input label="Last Name" name="last_name" required onChange={handleChange} />
            </div>
            
            <Input label="Username" name="username" required onChange={handleChange} />
            <Input label="Email Address" type="email" name="email" required onChange={handleChange} />
            <Input label="Password" type="password" name="password" required onChange={handleChange} />

            <Button type="submit" variant="primary" size="lg" className="w-full h-14 mt-4 shadow-xl shadow-primary/20 hover:shadow-primary/30" isLoading={isLoading}>
              Create Account
            </Button>
          </form>
          
          <div className="mt-10 pt-8 border-t border-border text-center text-sm font-medium text-muted">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-bold hover:text-accent transition-colors inline-flex items-center gap-1 group">
              Sign In <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Left: Illustration/Image Area */}
      <div className="hidden lg:block w-1/2 relative bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-50"></div>
        <div className="absolute inset-0 bg-gradient-to-bl from-primary/80 to-transparent"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-20 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <h2 className="text-5xl font-light italic font-serif mb-6 leading-tight">
              "Discover your signature style with us."
            </h2>
            <div className="w-16 h-px bg-white/30 mx-auto mb-6"></div>
            <p className="text-sm tracking-[0.3em] uppercase text-accent font-bold">Unparalleled Craftsmanship</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
