'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import BackgroundFader from "@/components/ui/BackgroundFader";
import { useAuth } from '@/features/auth/AuthContext';
import { Shield, Mail, User, ArrowRight, Calendar, Gauge } from 'lucide-react';

const AGE_GROUPS = [
  { value: 'under-60', label: 'Under 60' },
  { value: '60-69', label: '60–69' },
  { value: '70-79', label: '70–79' },
  { value: '80+', label: '80+' },
];

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    ageGroup: '',
    digitalConfidence: 3,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: 'NoPassword123!', // Dummy password for the backend
        ageGroup: formData.ageGroup,
        digitalConfidence: formData.digitalConfidence,
      });
      router.push('/hub');
    } catch (err: any) {
      // api.ts rejects with a plain Error(message); there is no err.response here.
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-50 flex">
      {/* Left Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-2 mb-12 group">
            <img src="/images/mascot-owl.jpg" alt="CyberEscape Mascot" className="w-8 h-8 object-cover rounded-full group-hover:scale-110 transition-transform" />
            <span className="text-lg font-bold tracking-tight text-zinc-900">
              CyberEscape
            </span>
          </Link>

          {/* Headers */}
          <h1 className="text-4xl font-extrabold text-zinc-900 mb-3 tracking-tight">
            Create Account
          </h1>
          <p className="text-zinc-500 mb-8 text-[15px]">
            Start your journey to becoming digitally secure today.
          </p>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 mb-6 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl font-medium">
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-[13px] font-bold text-zinc-900 mb-1.5 ml-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User strokeWidth={2} className="h-4 w-4 text-zinc-400" />
                </div>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="block w-full pl-11 pr-4 py-3 bg-white border border-zinc-200 rounded-xl text-[15px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all shadow-sm"
                  placeholder="Jane Doe"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-[13px] font-bold text-zinc-900 mb-1.5 ml-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail strokeWidth={2} className="h-4 w-4 text-zinc-400" />
                </div>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="block w-full pl-11 pr-4 py-3 bg-white border border-zinc-200 rounded-xl text-[15px] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all shadow-sm"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            {/* Age Group */}
            <div>
              <label className="block text-[13px] font-bold text-zinc-900 mb-1.5 ml-1">Age Group</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Calendar strokeWidth={2} className="h-4 w-4 text-zinc-400" />
                </div>
                <select
                  required
                  value={formData.ageGroup}
                  onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value })}
                  className="block w-full pl-11 pr-10 py-3 bg-white border border-zinc-200 rounded-xl text-[15px] text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all shadow-sm appearance-none cursor-pointer"
                >
                  <option value="" disabled>Select your age group</option>
                  {AGE_GROUPS.map(group => (
                    <option key={group.value} value={group.value}>{group.label}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Digital Confidence */}
            <div>
              <label className="block text-[13px] font-bold text-zinc-900 mb-1.5 ml-1">
                How confident are you online? <span className="text-zinc-400 font-medium">({formData.digitalConfidence}/5)</span>
              </label>
              <div className="relative pt-2 pb-6 px-1">
                <div className="absolute -top-1 left-0 flex items-center pointer-events-none opacity-50">
                  <Gauge strokeWidth={2} className="h-3.5 w-3.5 text-zinc-500" />
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={formData.digitalConfidence}
                  onChange={(e) => setFormData({ ...formData, digitalConfidence: parseInt(e.target.value) })}
                  className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-900"
                />
                <div className="flex justify-between text-[11px] font-bold text-zinc-400 uppercase tracking-wider mt-2">
                  <span>Not confident</span>
                  <span>Very confident</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 bg-zinc-900 text-white rounded-xl text-[15px] font-bold shadow-md hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight strokeWidth={2} className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <p className="text-left text-[15px] text-zinc-500 mt-8">
            Already have an account?{' '}
            <Link href="/login" className="text-zinc-900 font-bold hover:underline transition-all">
              Log in here.
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Interactive Section (Desktop Only) */}
      <div className="hidden lg:flex w-1/2 bg-zinc-950 items-center justify-center relative overflow-hidden">
        {/* Rotating Background Image */}
        <BackgroundFader  />
        
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-1/2 -right-1/2 w-[800px] h-[800px] border-[40px] border-zinc-800/30 rounded-full opacity-20"
        />
        
        <div className="relative z-10 max-w-lg p-12">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/20 shadow-2xl">
            <img src="/images/mascot-owl.jpg" alt="Mascot" className="w-10 h-10 object-cover rounded-full shadow-md" />
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-4xl font-bold text-white mb-6 leading-tight drop-shadow-sm">
            Your security<br />starts here.
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-lg text-zinc-300 leading-relaxed font-medium drop-shadow-sm">
            Join thousands of users who are building their digital confidence through our immersive, hands-on escape rooms.
          </motion.p>
        </div>
      </div>
    </main>
  );
}
