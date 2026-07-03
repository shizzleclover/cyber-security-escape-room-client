'use client';

import Link from 'next/link';
import { useAuth } from '@/features/auth/AuthContext';
import { useAudio } from '@/features/audio/AudioContext';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, User, LogOut, Menu, X, Music, VolumeX, LayoutDashboard } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Header() {
  const { user, logout } = useAuth();
  const { isPlaying, toggleAudio } = useAudio();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
  };

  const navLinks = user
    ? [
        { href: '/hub', label: 'Rooms' },
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/profile', label: 'Profile' },
        { href: '/about', label: 'About' },
        { href: '/resources', label: 'Resources' },
      ]
    : [
        { href: '/about', label: 'About' },
        { href: '/resources', label: 'Resources' },
      ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200/60">
      <div className="mx-auto max-w-5xl px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <Shield strokeWidth={2} className="w-5 h-5 text-zinc-900 group-hover:scale-110 transition-transform" />
          <span className="text-[15px] font-bold tracking-tight text-zinc-900">
            CyberEscape
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[14px] font-medium transition-colors duration-150 ${
                  isActive ? 'text-zinc-900' : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Section */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={toggleAudio}
            className="text-zinc-400 hover:text-zinc-900 transition-colors relative flex items-center justify-center w-8 h-8 rounded-full hover:bg-zinc-100"
            aria-label="Toggle music"
          >
            {isPlaying ? (
              <Music strokeWidth={2} className="w-4 h-4 text-zinc-900 animate-pulse" />
            ) : (
              <VolumeX strokeWidth={1.5} className="w-4 h-4" />
            )}
          </button>
          <div className="w-px h-4 bg-zinc-200" />
          
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link href="/admin" className="flex items-center gap-2 text-zinc-600 hover:text-zinc-900 transition-colors">
                  <LayoutDashboard className="w-4 h-4" strokeWidth={1.5} />
                  <span className="text-[14px] font-medium">Admin</span>
                </Link>
              )}
              <Link href="/dashboard" className="flex items-center gap-2 text-zinc-600 hover:text-zinc-900 transition-colors group">
                <User className="w-4 h-4" strokeWidth={1.5} />
                <span className="text-[14px] font-medium">{user.name.split(' ')[0]}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-zinc-400 hover:text-zinc-900 transition-colors"
              >
                <LogOut className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-[14px] font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 text-[14px] font-semibold text-white bg-zinc-900 rounded-full hover:bg-zinc-800 hover:scale-[0.98] transition-all"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-zinc-500 hover:text-zinc-900"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" strokeWidth={1.5} /> : <Menu className="w-6 h-6" strokeWidth={1.5} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-zinc-200/60 bg-white overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-3">
              <button
                onClick={toggleAudio}
                className="text-[15px] font-medium text-zinc-500 text-left flex items-center gap-2 py-2"
              >
                {isPlaying ? <Music className="w-4 h-4 text-zinc-900" /> : <VolumeX className="w-4 h-4" />} 
                {isPlaying ? 'Mute Music' : 'Play Music'}
              </button>
              <div className="h-px bg-zinc-100 my-1" />
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-[15px] font-medium ${pathname === link.href ? 'text-zinc-900' : 'text-zinc-500'}`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="h-px bg-zinc-100 my-1" />
              {user ? (
                <>
                  {user.role === 'admin' && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-[15px] font-medium text-zinc-500 flex items-center gap-2"
                    >
                      <LayoutDashboard className="w-4 h-4" /> Admin
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-[15px] font-medium text-red-600 text-left flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> Log out
                  </button>
                </>
              ) : (
                <div className="flex gap-3 mt-1">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="py-2.5 text-[15px] font-semibold text-zinc-900 bg-zinc-100 rounded-full text-center flex-1">
                    Log in
                  </Link>
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="py-2.5 text-[15px] font-semibold text-white bg-zinc-900 rounded-full text-center flex-1">
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
