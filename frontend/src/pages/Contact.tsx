import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export const Contact: React.FC = () => {
  const [success, setSuccess] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      email: '',
      subject: 'Order Coordinates',
      message: ''
    }
  });

  const onSubmitForm = (data: any) => {
    setSuccess(true);
    reset();
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-28 md:py-36 space-y-24">
      
      {/* Header */}
      <div className="text-center space-y-2 max-w-xl mx-auto select-none">
        <span className="text-xs font-mono uppercase tracking-[0.25em] text-neutral-400 block font-medium">
          Contact Portal
        </span>
        <h1 className="text-3xl md:text-5xl font-display font-light text-brand-dark dark:text-white tracking-tight leading-none">
          Support Ledger
        </h1>
        <p className="text-xs text-neutral-400 font-sans font-light mt-1">Get in touch with our Parisian fashion workshop.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 select-none">
        
        {/* Left Column: Direct contact info (Cols: 5) */}
        <div className="lg:col-span-5 space-y-8 bg-neutral-50 dark:bg-neutral-900 p-6 md:p-8 border border-neutral-100 dark:border-neutral-800">
          <div className="space-y-2">
            <h3 className="font-display text-xl font-light text-brand-dark dark:text-white">Studio Address</h3>
            <p className="text-xs text-neutral-400 font-light max-w-xs leading-relaxed">
              Our workspace and creative director offices are located in the heart of Parisian haute couture.
            </p>
          </div>

          <div className="space-y-6 text-xs text-neutral-500 dark:text-neutral-400 font-mono">
            <div className="flex items-start gap-4">
              <MapPin size={16} className="text-neutral-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-brand-dark dark:text-white font-semibold uppercase tracking-wider mb-1">HQ Atelier</p>
                <p className="leading-relaxed">104 Rue du Faubourg Saint-Honoré, 75008 Paris, France</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Phone size={16} className="text-neutral-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-brand-dark dark:text-white font-semibold uppercase tracking-wider mb-1">Phone Line</p>
                <p className="leading-relaxed">+33 1 40 07 30 00</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Mail size={16} className="text-neutral-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-brand-dark dark:text-white font-semibold uppercase tracking-wider mb-1">Email Coordinates</p>
                <p className="leading-relaxed hover:underline">studio@aurafashion.com</p>
              </div>
            </div>
          </div>

          {/* Fallback Map Image Mock */}
          <div className="aspect-[4/3] w-full bg-neutral-100 overflow-hidden relative border border-neutral-200 dark:border-neutral-800">
            <img 
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80" 
              alt="Parisian Map Accent" 
              className="w-full h-full object-cover grayscale opacity-80" 
            />
            <div className="absolute inset-0 bg-neutral-900/10 dark:bg-neutral-900/30" />
            <div className="absolute bottom-4 left-4 bg-brand-dark text-white text-[9px] font-mono uppercase tracking-widest px-3 py-1.5 dark:bg-white dark:text-brand-dark font-bold">
              View Paris Location
            </div>
          </div>

        </div>

        {/* Right Column: Support submission form (Cols: 7) */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
            
            {success && (
              <div className="p-4 bg-green-50 dark:bg-green-950/20 text-green-600 border border-green-200 rounded-sm flex items-center gap-3 text-xs font-mono">
                <CheckCircle2 size={16} />
                <span>Message received. Our support compiled coordinates will review and respond shortly.</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase text-neutral-400">Full Name *</label>
              <input
                type="text"
                {...register('name', { required: 'Name is required' })}
                className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs px-4 py-3.5 outline-none focus:border-brand-dark dark:focus:border-white transition-colors text-brand-dark dark:text-white"
                placeholder="e.g. John Doe"
              />
              {errors.name && <p className="text-[10px] font-mono text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase text-neutral-400">Email Address *</label>
              <input
                type="email"
                {...register('email', { required: 'Email is required' })}
                className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs px-4 py-3.5 outline-none focus:border-brand-dark dark:focus:border-white transition-colors text-brand-dark dark:text-white"
                placeholder="e.g. customer@example.com"
              />
              {errors.email && <p className="text-[10px] font-mono text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase text-neutral-400">Ledger Subject</label>
              <select
                {...register('subject')}
                className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs px-4 py-3.5 outline-none focus:border-brand-dark dark:focus:border-white transition-colors text-brand-dark dark:text-white"
              >
                <option value="Order Coordinates">Order Dispatch & Coordinates</option>
                <option value="Sizing Support">Sizing & Tailor Support</option>
                <option value="Wholesale Inquiry">Wholesale Partnership</option>
                <option value="Other">Other Inquiry</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase text-neutral-400">Your Message *</label>
              <textarea
                rows={6}
                {...register('message', { required: 'Message body cannot be empty' })}
                className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs px-4 py-3.5 outline-none focus:border-brand-dark dark:focus:border-white transition-colors text-brand-dark dark:text-white"
                placeholder="Please outline any questions or specifications regarding our garments..."
              />
              {errors.message && <p className="text-[10px] font-mono text-red-500">{errors.message.message}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-brand-dark dark:bg-white text-white dark:text-brand-dark py-4 px-6 text-xs font-mono tracking-widest uppercase font-semibold flex items-center justify-center gap-2.5 hover:opacity-90 transition-opacity active:scale-95"
            >
              <Send size={13} />
              <span>Send Message</span>
            </button>

          </form>
        </div>

      </div>

    </div>
  );
};
export default Contact;
