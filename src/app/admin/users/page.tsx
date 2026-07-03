'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import api from '@/lib/api';
import { useAuth } from '@/features/auth/AuthContext';
import {
  X, Shield, ShieldOff, Trash2, Mail, Lock, Users as UsersIcon,
  Search, ChevronRight,
} from 'lucide-react';

const ACCENT = '#58CC02';

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  ageGroup: string;
  digitalConfidence: number;
  createdAt: string;
  roomsCompleted: number;
  totalRooms: number;
  avgPercentage: number | null;
  preQuizScore: { score: number; total: number } | null;
  postQuizScore: { score: number; total: number } | null;
}

interface UserDetail {
  user: UserRow & { _id: string };
  progress: { roomId: string; status: string; currentStep: number }[];
  scores: { roomId: string; score: number; maxScore: number; percentage: number; hintsUsed: number; timeSpent: number }[];
  quizzes: { type: 'pre' | 'post'; score: number; totalQuestions: number }[];
}

const ROOM_LABELS: Record<string, string> = {
  phishing: 'Phishing Detection',
  passwords: 'Password Security',
  'social-engineering': 'Social Engineering',
};

export default function AdminUsersPage() {
  const { user: currentAdmin } = useAuth();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<UserDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      const response: any = await api.get('/admin/users');
      setUsers(response.data.users);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!selectedId) {
      setDetail(null);
      return;
    }
    const fetchDetail = async () => {
      setDetailLoading(true);
      try {
        const response: any = await api.get(`/admin/users/${selectedId}`);
        setDetail(response.data);
      } catch {
        setDetail(null);
      } finally {
        setDetailLoading(false);
      }
    };
    fetchDetail();
  }, [selectedId]);

  const toggleRole = async (id: string, currentRole: 'user' | 'admin', name: string) => {
    const nextRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      await api.patch(`/admin/users/${id}/role`, { role: nextRole });
      setUsers((prev) => prev.map((x) => (x.id === id ? { ...x, role: nextRole } : x)));
      setDetail((prev) => (prev && prev.user._id === id ? { ...prev, user: { ...prev.user, role: nextRole } } : prev));
    } catch (err: any) {
      alert(err.message || 'Could not update role.');
    }
  };

  const deleteUser = async (id: string, name: string) => {
    if (!confirm(`Delete ${name}? This removes their account and all progress/scores permanently.`)) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers((prev) => prev.filter((x) => x.id !== id));
      if (selectedId === id) setSelectedId(null);
    } catch (err: any) {
      alert(err.message || 'Could not delete user.');
    }
  };

  const filtered = users.filter(
    (u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-2">Manage</p>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Users</h1>
        </div>
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" strokeWidth={2} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or email"
            className="pl-10 pr-4 py-2.5 rounded-full bg-zinc-950 border border-zinc-800 text-[14px] text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 w-full md:w-72"
          />
        </div>
      </header>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-2 border-zinc-700 border-t-[#58CC02] rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-zinc-500 py-12 text-center">No users found.</p>
      ) : (
        <div className="rounded-2xl border border-zinc-800 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-zinc-950 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3 hidden sm:table-cell">Age group</th>
                <th className="px-5 py-3 hidden md:table-cell">Rooms</th>
                <th className="px-5 py-3 hidden md:table-cell">Avg score</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {filtered.map((u) => (
                <tr
                  key={u.id}
                  onClick={() => setSelectedId(u.id)}
                  className="cursor-pointer hover:bg-zinc-950 transition-colors"
                >
                  <td className="px-5 py-4">
                    <p className="text-[14px] font-bold">{u.name}</p>
                    <p className="text-[12px] text-zinc-500">{u.email}</p>
                  </td>
                  <td className="px-5 py-4 hidden sm:table-cell text-[13px] text-zinc-400">{u.ageGroup}</td>
                  <td className="px-5 py-4 hidden md:table-cell text-[13px] text-zinc-400">
                    {u.roomsCompleted}/{u.totalRooms}
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell text-[13px] text-zinc-400">
                    {u.avgPercentage !== null ? `${u.avgPercentage}%` : '—'}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                      style={
                        u.role === 'admin'
                          ? { backgroundColor: 'rgba(88,204,2,0.15)', color: ACCENT }
                          : { backgroundColor: 'rgba(255,255,255,0.06)', color: '#a1a1aa' }
                      }
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <ChevronRight className="w-4 h-4 text-zinc-600 inline-block" strokeWidth={2} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail drawer */}
      <AnimatePresence>
        {selectedId && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedId(null)}
              className="fixed inset-0 bg-black/60 z-50"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 32 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-[#101010] border-l border-zinc-800 z-50 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-extrabold">User detail</h2>
                  <button onClick={() => setSelectedId(null)} className="text-zinc-500 hover:text-white">
                    <X className="w-5 h-5" strokeWidth={2} />
                  </button>
                </div>

                {detailLoading || !detail ? (
                  <div className="flex items-center justify-center py-24">
                    <div className="w-8 h-8 border-2 border-zinc-700 border-t-[#58CC02] rounded-full animate-spin" />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xl font-extrabold flex-shrink-0">
                        {detail.user.name[0]?.toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-extrabold text-lg truncate">{detail.user.name}</p>
                        <p className="text-[13px] text-zinc-500 truncate">{detail.user.email}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Age group</p>
                        <p className="text-[15px] font-bold">{detail.user.ageGroup}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Confidence</p>
                        <p className="text-[15px] font-bold">{detail.user.digitalConfidence}/5</p>
                      </div>
                    </div>

                    {/* Quiz results */}
                    <p className="text-[12px] font-bold uppercase tracking-wider text-zinc-500 mb-3">Assessment</p>
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      {(['pre', 'post'] as const).map((type) => {
                        const quiz = detail.quizzes.find((q) => q.type === type);
                        return (
                          <div key={type} className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
                            <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                              {type}-assessment
                            </p>
                            <p className="text-[15px] font-bold">
                              {quiz ? `${quiz.score}/${quiz.totalQuestions}` : 'Not taken'}
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    {/* Room progress */}
                    <p className="text-[12px] font-bold uppercase tracking-wider text-zinc-500 mb-3">Rooms</p>
                    <div className="space-y-2 mb-6">
                      {['phishing', 'passwords', 'social-engineering'].map((roomId) => {
                        const progress = detail.progress.find((p) => p.roomId === roomId);
                        const score = detail.scores.find((s) => s.roomId === roomId);
                        return (
                          <div key={roomId} className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800">
                            <span className="text-[13px] font-bold">{ROOM_LABELS[roomId]}</span>
                            <span className="text-[12px] text-zinc-500">
                              {score ? `${score.percentage}%` : progress?.status.replace('-', ' ') || 'not started'}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-zinc-900">
                      <button
                        onClick={() => toggleRole(detail.user._id, detail.user.role, detail.user.name)}
                        disabled={detail.user._id === currentAdmin?.id}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-zinc-800 text-[13px] font-bold hover:bg-zinc-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {detail.user.role === 'admin' ? (
                          <><ShieldOff className="w-4 h-4" strokeWidth={2} /> Revoke admin</>
                        ) : (
                          <><Shield className="w-4 h-4" strokeWidth={2} /> Make admin</>
                        )}
                      </button>
                      <button
                        onClick={() => deleteUser(detail.user._id, detail.user.name)}
                        disabled={detail.user._id === currentAdmin?.id}
                        className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-red-900/50 text-red-500 text-[13px] font-bold hover:bg-red-950/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="w-4 h-4" strokeWidth={2} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
