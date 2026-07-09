import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useApp } from '../context/AppContext';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';

export const Register: React.FC = () => {
  const { register: registerContext } = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      first_name: '',
      last_name: '',
      password: ''
    }
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    setErrorMsg('');
    try {
      await registerContext(data.email, data.first_name, data.last_name, data.password);
      navigate('/profile');
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error creating account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-28 md:py-36 min-h-[80vh] flex flex-col justify-center select-none font-mono">
      
      <div className="space-y-3 mb-10 text-center">
        <span className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-400">Authentic Ledger</span>
        <h1 className="text-3xl font-display font-light text-brand-dark dark:text-white tracking-tight leading-none font-sans normal-case">
          Register account
        </h1>
        <p className="text-xs text-neutral-400 font-sans font-light">Join the AURA inner circle today.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {errorMsg && (
          <p className="text-xs font-mono text-red-500 text-center">{errorMsg}</p>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase text-neutral-400 font-bold">First Name *</label>
            <div className="relative flex items-center bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus-within:border-brand-dark dark:focus-within:border-white transition-colors duration-200">
              <div className="pl-4 text-neutral-400 shrink-0"><User size={14} /></div>
              <input
                type="text"
                {...register('first_name', { required: 'Required' })}
                className="w-full py-4 px-3 bg-transparent text-xs outline-none text-brand-dark dark:text-white"
                placeholder="e.g. Jean"
              />
            </div>
            {errors.first_name && <p className="text-[10px] text-red-500">{errors.first_name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase text-neutral-400 font-bold">Last Name *</label>
            <div className="relative flex items-center bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus-within:border-brand-dark dark:focus-within:border-white transition-colors duration-200">
              <div className="pl-4 text-neutral-400 shrink-0"><User size={14} /></div>
              <input
                type="text"
                {...register('last_name', { required: 'Required' })}
                className="w-full py-4 px-3 bg-transparent text-xs outline-none text-brand-dark dark:text-white"
                placeholder="e.g. Dupont"
              />
            </div>
            {errors.last_name && <p className="text-[10px] text-red-500">{errors.last_name.message}</p>}
          </div>
        </div>

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
              {...register('password', { 
                required: 'Password is required',
                minLength: { value: 6, message: 'Minimum 6 characters' }
              })}
              className="w-full py-4.5 px-3 bg-transparent text-xs outline-none text-brand-dark dark:text-white"
              placeholder="Password ledger (min 6 chars)"
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
              <span>Compile Account</span>
              <ArrowRight size={14} />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 text-center text-xs font-sans font-light text-neutral-500">
        <span>Already in inner circle? </span>
        <Link to="/login" className="text-brand-dark dark:text-white font-semibold underline hover:text-neutral-500">Login ledger</Link>
      </div>

    </div>
  );
};
export default Register;
