'use client';

import Link from 'next/link';
import { useAuth } from '@/features/auth/AuthContext';
import { useAudio } from '@/features/audio/AudioContext';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, User, LogOut, Menu, X, Music, VolumeX, LayoutDashboard, ArrowRight } from 'lucide-react';
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

  const navLinks = [
    { href: '/hub', label: 'Escape Rooms' },
    { href: '/dashboard', label: 'Dashboard' },
  ];
  if (user) {
    navLinks.push({ href: '/profile', label: 'Profile' });
  }
  navLinks.push(
    { href: '/resources', label: 'Resources' },
    { href: '/about', label: 'About' }
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#FAF9F5]/90 backdrop-blur-md border-b border-zinc-200/70">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href={user ? '/hub' : '/'} className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
            <Shield strokeWidth={2.25} className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-[15px] font-bold tracking-tight text-zinc-900">
              CyberEscape
            </span>
            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.2 rounded">
              IE
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[14px] font-medium transition-colors duration-150 ${
                  isActive ? 'text-zinc-900 font-semibold' : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Section */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={toggleAudio}
            className="text-zinc-400 hover:text-zinc-700 transition-colors flex items-center justify-center w-8 h-8 rounded-full hover:bg-zinc-200/60"
            aria-label="Toggle ambient sound"
            title={isPlaying ? 'Mute sound effects' : 'Sound effects active'}
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
                <Link href="/admin" className="flex items-center gap-1.5 text-zinc-600 hover:text-zinc-900 text-xs font-medium px-2 py-1 rounded-md hover:bg-zinc-100 transition-colors">
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </Link>
              )}
              <Link href="/dashboard" className="flex items-center gap-2 text-zinc-700 hover:text-zinc-900 text-sm font-medium">
                <div className="w-7 h-7 rounded-full bg-zinc-200 flex items-center justify-center text-xs font-bold text-zinc-800">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span>{user.name.split(' ')[0]}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-zinc-400 hover:text-rose-600 transition-colors p-1.5 rounded-md hover:bg-zinc-100"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-[14px] font-medium text-zinc-600 hover:text-zinc-900 transition-colors px-2 py-1"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-white bg-zinc-900 hover:bg-zinc-800 rounded-full shadow-sm hover:shadow transition-all"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-zinc-600 hover:text-zinc-900 rounded-lg hover:bg-zinc-100"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-zinc-200 bg-[#FAF9F5] px-6 py-5 overflow-hidden"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-[15px] font-medium ${pathname === link.href ? 'text-zinc-900 font-semibold' : 'text-zinc-600'}`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="h-px bg-zinc-200 my-1" />

              {user ? (
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center font-bold text-xs">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-900">{user.name}</p>
                      <p className="text-xs text-zinc-500">{user.email}</p>
                    </div>
                  </div>
                  <button onClick={handleLogout} className="text-xs font-semibold text-rose-600 hover:underline">
                    Log out
                  </button>
                </div>
              ) : (
                <div className="flex gap-3 pt-2">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="flex-1 py-2.5 text-center text-sm font-semibold text-zinc-800 bg-zinc-100 rounded-lg border border-zinc-200">
                    Log in
                  </Link>
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="flex-1 py-2.5 text-center text-sm font-semibold text-white bg-zinc-900 rounded-lg shadow-sm">
                    Sign up free
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
