'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/features/auth/AuthContext';
import { Shield, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      router.push('/hub');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex w-full">
      {/* Left Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 lg:px-16 bg-[#F7F7F8]">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <div className="mb-10">
            <Link href="/" className="inline-flex items-center gap-2 mb-10 group">
              <Shield strokeWidth={2} className="w-6 h-6 text-zinc-900 group-hover:scale-110 transition-transform" />
              <span className="text-lg font-bold tracking-tight text-zinc-900">CyberEscape</span>
            </Link>
            <h1 className="text-3xl md:text-4xl font-extrabold text-zinc-900 tracking-tight">
              Welcome Back
            </h1>
            <p className="text-zinc-500 mt-2 text-[15px]">
              Sign in to continue your cybersecurity training.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium"
              >
                {error}
              </motion.div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-zinc-900">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" strokeWidth={1.5} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 text-[15px] focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all duration-200"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-zinc-900">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" strokeWidth={1.5} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full pl-12 pr-12 py-4 rounded-2xl bg-white border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 text-[15px] focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-900 transition-colors"
                >
                  {showPassword ? <EyeOff strokeWidth={1.5} className="w-5 h-5" /> : <Eye strokeWidth={1.5} className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 mt-2 rounded-full bg-zinc-900 text-white font-bold text-[15px] shadow-sm hover:shadow-md hover:bg-zinc-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-zinc-400 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight strokeWidth={2} className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <p className="text-left text-[15px] text-zinc-500 mt-8">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-zinc-900 font-bold hover:underline transition-all">
              Create one here.
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Interactive Section (Desktop Only) */}
      <div className="hidden lg:flex w-1/2 bg-zinc-900 p-12 items-center justify-center relative overflow-hidden">
        {/* Animated Background Elements */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-1/2 -right-1/2 w-[800px] h-[800px] border-[40px] border-zinc-800/50 rounded-full opacity-20"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 70, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-1/2 -left-1/2 w-[600px] h-[600px] border-[30px] border-zinc-800/50 rounded-full opacity-20"
        />
        
        <div className="relative z-10 max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
            className="space-y-6 text-white"
          >
            <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center border border-zinc-700">
              <Shield strokeWidth={1.5} className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight leading-tight">
              Master the art of <br/>digital defense.
            </h2>
            <p className="text-lg text-zinc-400 leading-relaxed">
              Step into interactive escape rooms designed to build real-world cybersecurity skills. Detect phishing, secure accounts, and learn social engineering tactics.
            </p>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
