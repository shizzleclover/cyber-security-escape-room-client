'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/features/auth/AuthContext';
import ProtectedRoute from '@/features/auth/ProtectedRoute';
import api from '@/lib/api';
import { 
  Mail, Lock, Users, ArrowRight, CheckCircle2, 
  Clock, Trophy, Sparkles, Play
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, type: 'spring' as const, stiffness: 100, damping: 20 },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

interface RoomProgressData {
  roomId: string;
  status: 'not-started' | 'in-progress' | 'completed';
  score?: number;
  maxScore?: number;
}

export default function HubPage() {
  return (
    <ProtectedRoute>
      <HubContent />
    </ProtectedRoute>
  );
}

function HubContent() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<RoomProgressData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response: any = await api.get('/progress');
        setProgress(response.data?.progress || []);
      } catch {
        setProgress([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  const getStatusForRoom = (roomId: string) => {
    const roomProgress = progress.find((p) => p.roomId === roomId);
    return roomProgress || null;
  };

  const rooms = [
    {
      id: 'phishing',
      icon: Mail,
      title: 'Phishing Detection',
      description: 'Inspect a simulated email inbox. Identify which messages are genuine and which are scams trying to steal your information.',
      accent: 'bg-rose-50 text-rose-600 border-rose-100',
      challenges: 8,
      time: '10 min',
      href: '/rooms/phishing',
    },
    {
      id: 'passwords',
      icon: Lock,
      title: 'Password Security',
      description: 'Learn what makes a strong password through interactive challenges. Discover why reusing passwords is dangerous and how managers help.',
      accent: 'bg-violet-50 text-violet-600 border-violet-100',
      challenges: 4,
      time: '8 min',
      href: '/rooms/passwords',
    },
    {
      id: 'social-engineering',
      icon: Users,
      title: 'Social Engineering',
      description: 'Face simulated phone calls and text messages from scammers. Choose how to respond and see the consequences of each decision.',
      accent: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      challenges: 5,
      time: '12 min',
      href: '/rooms/social-engineering',
    },
  ];

  const completedCount = progress.filter((p) => p.status === 'completed').length;
  const allComplete = completedCount === 3;

  return (
    <main className="relative overflow-hidden min-h-screen">
      <section className="relative px-6 pt-28 pb-20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            {/* Greeting */}
            <motion.div variants={fadeUp} custom={0} className="mb-12">
              <div className="flex items-center gap-3 mb-2">
                <Sparkles strokeWidth={1.5} className="w-5 h-5 text-amber-500" />
                <span className="text-sm text-zinc-500">
                  {allComplete ? 'All rooms completed!' : `${completedCount}/3 rooms completed`}
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-zinc-900">
                Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
              </h1>
              <p className="text-zinc-500 mt-3 text-lg">
                {allComplete
                  ? 'You have completed all rooms. Take the post-assessment to measure your growth.'
                  : 'Choose a room to begin. Complete all three to see your full results.'}
              </p>
            </motion.div>

            {/* Progress Bar */}
            <motion.div variants={fadeUp} custom={1} className="mb-12">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-zinc-500">Overall Progress</span>
                <span className="text-sm font-semibold text-zinc-900">{Math.round((completedCount / 3) * 100)}%</span>
              </div>
              <div className="h-2.5 rounded-full bg-zinc-100 overflow-hidden border border-zinc-200/50">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(completedCount / 3) * 100}%` }}
                  transition={{ duration: 1, delay: 0.5, type: 'spring' as const, stiffness: 100, damping: 20 }}
                  className="h-full rounded-full bg-zinc-900"
                />
              </div>
            </motion.div>

            {/* Post-assessment CTA */}
            {allComplete && (
              <motion.div variants={fadeUp} custom={1.5} className="mb-10">
                <Link
                  href="/quiz?type=post"
                  className="flex items-center justify-between p-6 rounded-3xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100/70 transition-all duration-200"
                >
                  <div className="flex items-center gap-4">
                    <Trophy strokeWidth={1.5} className="w-8 h-8 text-emerald-600" />
                    <div>
                      <h3 className="text-lg font-semibold text-zinc-900">All Rooms Complete!</h3>
                      <p className="text-sm text-zinc-500">Take the post-assessment to measure your improvement.</p>
                    </div>
                  </div>
                  <ArrowRight strokeWidth={1.5} className="w-5 h-5 text-emerald-600" />
                </Link>
              </motion.div>
            )}

            {/* Room Cards */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {rooms.map((room, i) => {
                const roomProgress = getStatusForRoom(room.id);
                const isCompleted = roomProgress?.status === 'completed';
                const isInProgress = roomProgress?.status === 'in-progress';

                return (
                  <motion.div
                    key={room.id}
                    variants={fadeUp}
                    custom={i + 2}
                  >
                    <Link href={room.href} className="block h-full">
                      <div className="group relative h-full p-8 rounded-xl border border-zinc-200/80 bg-white hover:border-zinc-300 hover:shadow-sm transition-all duration-300">
                        {/* Status badge */}
                        {isCompleted && (
                          <div className="absolute top-4 right-4">
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-xs font-medium text-emerald-700">Done</span>
                            </div>
                          </div>
                        )}
                        {isInProgress && (
                          <div className="absolute top-4 right-4">
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200">
                              <span className="text-xs font-medium text-amber-700">In Progress</span>
                            </div>
                          </div>
                        )}

                        {/* Icon */}
                        <room.icon strokeWidth={1.5} className="w-10 h-10 mb-6 text-zinc-900" />

                        {/* Content */}
                        <h3 className="text-xl font-semibold text-zinc-900 mb-3">
                          {room.title}
                        </h3>
                        <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                          {room.description}
                        </p>

                        {/* Meta */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-xs text-zinc-400">
                            <span className="flex items-center gap-1">
                              <Trophy className="w-3.5 h-3.5" /> {room.challenges}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" /> {room.time}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-sm font-medium text-zinc-400 group-hover:text-zinc-900 transition-colors">
                            <Play className="w-3.5 h-3.5" />
                            <span>{isCompleted ? 'Replay' : isInProgress ? 'Continue' : 'Start'}</span>
                          </div>
                        </div>

                        {/* Score if completed */}
                        {isCompleted && roomProgress?.score !== undefined && (
                          <div className="mt-4 pt-4 border-t border-zinc-100">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-zinc-400">Your score</span>
                              <span className="font-semibold text-zinc-900">
                                {roomProgress.score}/{roomProgress.maxScore || roomProgress.score}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              variants={fadeUp}
              custom={5}
              className="mt-12 flex flex-wrap items-center justify-center gap-4"
            >
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-5 py-2.5 text-sm text-zinc-500 hover:text-zinc-900 rounded-full border border-zinc-200 hover:border-zinc-300 hover:bg-white transition-all duration-200"
              >
                <Trophy strokeWidth={1.5} className="w-4 h-4" />
                View Dashboard
              </Link>
              <Link
                href="/resources"
                className="flex items-center gap-2 px-5 py-2.5 text-sm text-zinc-500 hover:text-zinc-900 rounded-full border border-zinc-200 hover:border-zinc-300 hover:bg-white transition-all duration-200"
              >
                <ArrowRight strokeWidth={1.5} className="w-4 h-4" />
                Resources
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
