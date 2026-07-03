'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import AdminRoute from '@/features/auth/AdminRoute';
import { useAuth } from '@/features/auth/AuthContext';
import {
  LayoutDashboard, Users, BookOpen, LinkIcon, Shield,
  LogOut, ArrowLeft,
} from 'lucide-react';

const ACCENT = '#58CC02';

const NAV_ITEMS = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/content', label: 'Rooms & Content', icon: BookOpen },
  { href: '/admin/resources', label: 'Resources', icon: LinkIcon },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminRoute>
      <AdminShell>{children}</AdminShell>
    </AdminRoute>
  );
}

function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-[#101010] text-[#FAFAF8] flex">
      {/* Sidebar */}
      <aside className="hidden md:flex md:w-64 flex-col border-r border-zinc-800 flex-shrink-0">
        <div className="h-16 flex items-center gap-2.5 px-6 border-b border-zinc-800">
          <Shield className="w-5 h-5" style={{ color: ACCENT }} strokeWidth={2.5} />
          <span className="font-extrabold tracking-tight text-[15px]">CyberEscape</span>
          <span className="ml-auto text-[10px] font-bold uppercase tracking-wider text-zinc-500 bg-zinc-900 px-2 py-1 rounded-full border border-zinc-800">
            Admin
          </span>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-bold transition-colors duration-150 ${
                  isActive ? 'text-[#101010]' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="admin-nav-active"
                    className="absolute inset-0 rounded-xl"
                    style={{ backgroundColor: ACCENT }}
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <item.icon className="relative w-4 h-4" strokeWidth={2.25} />
                <span className="relative">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-zinc-800 space-y-1">
          <Link
            href="/hub"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-bold text-zinc-500 hover:text-white hover:bg-zinc-900 transition-colors duration-150"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={2.25} />
            Back to learner view
          </Link>
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-[12px] font-bold flex-shrink-0">
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-bold truncate">{user?.name}</p>
              <p className="text-[11px] text-zinc-500 truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-zinc-500 hover:text-white transition-colors flex-shrink-0"
              aria-label="Log out"
            >
              <LogOut className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-[#101010] border-b border-zinc-800 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4" style={{ color: ACCENT }} strokeWidth={2.5} />
          <span className="font-extrabold text-[14px]">Admin</span>
        </div>
        <Link href="/hub" className="text-[12px] font-bold text-zinc-400">Exit</Link>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-16 bg-[#101010] border-t border-zinc-800 flex items-center justify-around px-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-[10px] font-bold ${
                isActive ? '' : 'text-zinc-500'
              }`}
              style={isActive ? { color: ACCENT } : undefined}
            >
              <item.icon className="w-5 h-5" strokeWidth={2.25} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Main content */}
      <main className="flex-1 min-w-0 pt-14 md:pt-0 pb-16 md:pb-0">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-10">{children}</div>
      </main>
    </div>
  );
}
