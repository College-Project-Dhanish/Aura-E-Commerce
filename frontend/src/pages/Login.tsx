import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useApp } from '../context/AppContext';
import { Mail, Lock, ArrowRight, Info } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    setErrorMsg('');
    try {
      await login(data.email, data.password);
      navigate('/profile');
    } catch (err: any) {
      setErrorMsg(err?.message || 'Invalid login coordinates. Please check email/password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-28 md:py-36 min-h-[80vh] flex flex-col justify-center select-none font-mono">
      
      <div className="space-y-3 mb-10 text-center">
        <span className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-400">Authentic Ledger</span>
        <h1 className="text-3xl font-display font-light text-brand-dark dark:text-white tracking-tight leading-none font-sans normal-case">
          Welcome back
        </h1>
        <p className="text-xs text-neutral-400 font-sans font-light">Settle into your premium wardrobe portal.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {errorMsg && (
          <p className="text-xs font-mono text-red-500 text-center">{errorMsg}</p>
        )}

        <div className="space-y-1.5">
          <label className="text-[10px] uppercase text-neutral-400 font-bold">Email address *</label>
          <div className="relative flex items-center bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus-within:border-brand-dark dark:focus-within:border-white transition-colors duration-200">
            <div className="pl-4 text-neutral-400 shrink-0"><Mail size={14} /></div>
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className="w-full py-4.5 px-3 bg-transparent text-xs outline-none text-brand-dark dark:text-white"
              placeholder="e.g. fashion@aura.com"
            />
          </div>
          {errors.email && <p className="text-[10px] text-red-500">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] uppercase text-neutral-400 font-bold">Password *</label>
          <div className="relative flex items-center bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus-within:border-brand-dark dark:focus-within:border-white transition-colors duration-200">
            <div className="pl-4 text-neutral-400 shrink-0"><Lock size={14} /></div>
            <input
              type="password"
              {...register('password', { required: 'Password is required' })}
              className="w-full py-4.5 px-3 bg-transparent text-xs outline-none text-brand-dark dark:text-white"
              placeholder="Minimum 6 characters"
            />
          </div>
          {errors.password && <p className="text-[10px] text-red-500">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-dark dark:bg-white text-white dark:text-brand-dark py-4 px-6 text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity active:scale-95 disabled:opacity-50 shadow-lg"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>Enter Portal</span>
              <ArrowRight size={14} />
            </>
          )}
        </button>
      </form>

      {/* Admin Demo accounts box */}
      <div className="mt-8 p-4 bg-brand-beige dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-sm space-y-2 font-sans font-light text-[11px] leading-relaxed select-none">
        <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase font-bold text-neutral-500">
          <Info size={13} />
          <span>Demo Access Ledger</span>
        </div>
        <p className="text-neutral-500 dark:text-neutral-400">
          We support dynamic mock authorization. Enter any email with a valid format (e.g., <strong className="font-mono">studio@aurafashion.com</strong>) with any password to gain access instantly. To log in as <strong className="font-bold">Staff/Admin</strong>, use an email starting with admin (e.g. <strong className="font-mono">admin@aura.com</strong>).
        </p>
      </div>

      <div className="mt-8 text-center text-xs font-sans font-light text-neutral-500">
        <span>No account? </span>
        <Link to="/register" className="text-brand-dark dark:text-white font-semibold underline hover:text-neutral-500">Register ledger</Link>
      </div>

    </div>
  );
};
export default Login;
