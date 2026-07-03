'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import {
  Users, Mail, Lock, TrendingUp, Sparkles, ArrowUpRight,
} from 'lucide-react';

const ACCENT = '#58CC02';

interface Overview {
  totalUsers: number;
  usersByAgeGroup: { ageGroup: string; count: number }[];
  roomStats: { roomId: string; attempts: number; avgPercentage: number | null; avgHints: number | null }[];
  quizzesTaken: { pre: number; post: number };
  avgLearningGain: number | null;
  recentUsers: { _id: string; name: string; email: string; ageGroup: string; createdAt: string }[];
}

const ROOM_LABELS: Record<string, string> = {
  phishing: 'Phishing Detection',
  passwords: 'Password Security',
  'social-engineering': 'Social Engineering',
};

const ROOM_ICONS: Record<string, any> = {
  phishing: Mail,
  passwords: Lock,
  'social-engineering': Users,
};

export default function AdminOverviewPage() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const response: any = await api.get('/admin/overview');
        setOverview(response.data.overview);
      } catch {
        setOverview(null);
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-2 border-zinc-700 border-t-[#58CC02] rounded-full animate-spin" />
      </div>
    );
  }

  if (!overview) {
    return <p className="text-zinc-500">Couldn&apos;t load analytics. Try refreshing.</p>;
  }

  const statCards = [
    { label: 'Total learners', value: overview.totalUsers, icon: Users },
    { label: 'Pre-assessments taken', value: overview.quizzesTaken.pre, icon: Sparkles },
    { label: 'Post-assessments taken', value: overview.quizzesTaken.post, icon: TrendingUp },
    {
      label: 'Avg. learning gain',
      value: overview.avgLearningGain !== null ? `${overview.avgLearningGain > 0 ? '+' : ''}${overview.avgLearningGain}%` : '—',
      icon: ArrowUpRight,
    },
  ];

  return (
    <div>
      <header className="mb-10">
        <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-2">Dashboard</p>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Overview</h1>
      </header>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {statCards.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800"
          >
            <s.icon className="w-4 h-4 text-zinc-500 mb-4" strokeWidth={2} />
            <p className="text-2xl md:text-3xl font-extrabold tracking-tight mb-1">{s.value}</p>
            <p className="text-[12px] font-medium text-zinc-500">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {/* Room performance */}
        <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800">
          <h2 className="text-[13px] font-bold uppercase tracking-wider text-zinc-500 mb-6">Room performance</h2>
          <div className="space-y-5">
            {overview.roomStats.map((room) => {
              const Icon = ROOM_ICONS[room.roomId] || Mail;
              return (
                <div key={room.roomId}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex items-center gap-2 text-[14px] font-bold">
                      <Icon className="w-4 h-4 text-zinc-500" strokeWidth={2} />
                      {ROOM_LABELS[room.roomId] || room.roomId}
                    </span>
                    <span className="text-[13px] font-medium text-zinc-500">
                      {room.attempts} attempt{room.attempts === 1 ? '' : 's'}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-zinc-900 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${room.avgPercentage ?? 0}%`, backgroundColor: ACCENT }}
                    />
                  </div>
                  <div className="flex justify-between mt-1.5 text-[11px] text-zinc-600 font-medium">
                    <span>{room.avgPercentage !== null ? `${room.avgPercentage}% avg score` : 'No data yet'}</span>
                    {room.avgHints !== null && <span>{room.avgHints} hints avg</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Age group breakdown */}
        <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800">
          <h2 className="text-[13px] font-bold uppercase tracking-wider text-zinc-500 mb-6">Learners by age group</h2>
          {overview.usersByAgeGroup.length === 0 ? (
            <p className="text-[14px] text-zinc-500">No users yet.</p>
          ) : (
            <div className="space-y-4">
              {overview.usersByAgeGroup.map((g) => {
                const pct = overview.totalUsers ? Math.round((g.count / overview.totalUsers) * 100) : 0;
                return (
                  <div key={g.ageGroup}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[14px] font-bold">{g.ageGroup}</span>
                      <span className="text-[13px] font-medium text-zinc-500">{g.count} ({pct}%)</span>
                    </div>
                    <div className="h-2 rounded-full bg-zinc-900 overflow-hidden">
                      <div className="h-full rounded-full bg-zinc-600" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recent users */}
      <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[13px] font-bold uppercase tracking-wider text-zinc-500">Recently joined</h2>
          <Link href="/admin/users" className="text-[13px] font-bold flex items-center gap-1 hover:gap-2 transition-all" style={{ color: ACCENT }}>
            View all <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        {overview.recentUsers.length === 0 ? (
          <p className="text-[14px] text-zinc-500">No users yet.</p>
        ) : (
          <div className="divide-y divide-zinc-900">
            {overview.recentUsers.map((u) => (
              <div key={u._id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[12px] font-bold">
                    {u.name[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-[14px] font-bold">{u.name}</p>
                    <p className="text-[12px] text-zinc-500">{u.email}</p>
                  </div>
                </div>
                <span className="text-[12px] font-medium text-zinc-500">{u.ageGroup}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
