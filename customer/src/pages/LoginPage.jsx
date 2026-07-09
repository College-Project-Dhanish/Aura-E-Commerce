import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Lock, Mail } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import ErrorAlert from '../components/ui/ErrorAlert';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login({ email, password });
      navigate('/profile');
    } catch (err) {
      setError(err?.response?.data?.detail || err?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left: Form Area */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 md:px-24 xl:px-32 relative z-10 py-20 lg:py-0">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="mb-12 text-center lg:text-left">
            <h1 className="text-4xl font-bold tracking-tighter text-primary mb-3">Welcome Back</h1>
            <p className="text-muted font-light text-lg">Sign in to access your exclusive benefits.</p>
          </div>

          <ErrorAlert message={error} className="mb-8" />

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-1">
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
              <div className="flex justify-end pt-2">
                <Link to="#" className="text-sm font-medium text-muted hover:text-accent transition-colors">
                  Forgot Password?
                </Link>
              </div>
            </div>

            <Button type="submit" variant="primary" size="lg" className="w-full h-14 mt-4 shadow-xl shadow-primary/20 hover:shadow-primary/30" isLoading={loading}>
              Sign In
            </Button>
          </form>
          
          <div className="mt-10 pt-8 border-t border-border text-center text-sm font-medium text-muted">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-bold hover:text-accent transition-colors inline-flex items-center gap-1 group">
              Register here <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Right: Illustration/Image Area */}
      <div className="hidden lg:block w-1/2 relative bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1612423284934-2850a4ea6b0f?q=80&w=1740&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-50"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-transparent"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-20 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <h2 className="text-5xl font-light italic font-serif mb-6 leading-tight">
              "Elegance is not standing out, but being remembered."
            </h2>
            <div className="w-16 h-px bg-white/30 mx-auto mb-6"></div>
            <p className="text-sm tracking-[0.3em] uppercase text-accent font-bold">Aura Premium Collection</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
