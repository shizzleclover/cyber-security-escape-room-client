'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/features/auth/AuthContext';
import ProtectedRoute from '@/features/auth/ProtectedRoute';
import api from '@/lib/api';
import { 
  Trophy, TrendingUp, Target, CheckCircle2, 
  ArrowRight, BookOpen, BarChart3, Sparkles,
  Mail, Lock, Users, Crown, Medal
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, type: 'spring' as const, stiffness: 100, damping: 20 },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

interface ScoreData {
  roomId: string;
  score: number;
  maxScore: number;
  hintsUsed: number;
  timeSpent: number;
  completedAt: string;
}

interface QuizData {
  type: 'pre' | 'post';
  score: number;
  totalQuestions: number;
  completedAt: string;
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { user } = useAuth();
  const [scores, setScores] = useState<ScoreData[]>([]);
  const [quizzes, setQuizzes] = useState<QuizData[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [scoresRes, quizRes, leaderboardRes]: any[] = await Promise.all([
          api.get('/scores').catch(() => ({ data: { scores: [] } })),
          api.get('/quiz').catch(() => ({ data: { results: [] } })),
          api.get('/scores/leaderboard/top').catch(() => ({ data: { leaderboard: [] } })),
        ]);
        setScores(scoresRes.data?.scores || []);
        setQuizzes(quizRes.data?.results || []);
        setLeaderboard(leaderboardRes.data?.leaderboard || []);
      } catch {
        // Silent fail
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const preQuiz = quizzes.find((q) => q.type === 'pre');
  const postQuiz = quizzes.find((q) => q.type === 'post');
  const improvement = preQuiz && postQuiz ? postQuiz.score - preQuiz.score : null;

  const roomIcons: Record<string, any> = {
    phishing: Mail,
    passwords: Lock,
    'social-engineering': Users,
  };

  const roomNames: Record<string, string> = {
    phishing: 'Phishing Detection',
    passwords: 'Password Security',
    'social-engineering': 'Social Engineering',
  };

  const roomColors: Record<string, string> = {
    phishing: 'from-rose-400 to-orange-400',
    passwords: 'from-zinc-600 to-zinc-800',
    'social-engineering': 'from-emerald-400 to-teal-500',
  };

  const roomBarColors: Record<string, string> = {
    phishing: 'bg-rose-500',
    passwords: 'bg-zinc-800',
    'social-engineering': 'bg-emerald-600',
  };

  const completedRooms = scores.length;
  const allRoomsComplete = completedRooms >= 3;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
        <div className="w-10 h-10 border-2 border-zinc-400 border-t-zinc-900 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="relative overflow-hidden min-h-screen bg-[#FAF9F6]">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-zinc-200/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-stone-200/20 rounded-full blur-[100px]" />
      </div>

      <section className="relative px-6 pt-28 pb-20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            {/* Header */}
            <motion.div variants={fadeUp} custom={0} className="mb-10">
              <div className="flex items-center gap-3 mb-2">
                <BarChart3 strokeWidth={1.5} className="w-5 h-5 text-zinc-500" />
                <span className="text-sm text-zinc-500 tracking-wide uppercase">Your Progress</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-zinc-900">
                Results Dashboard
              </h1>
              <p className="text-zinc-500 mt-2">
                Track your learning journey and see how far you have come.
              </p>
            </motion.div>

            {/* Stats Grid */}
            <motion.div variants={fadeUp} custom={1} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              <div className="p-6 rounded-xl border border-zinc-200/80 bg-white shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center">
                    <Target strokeWidth={1.5} className="w-4 h-4 text-zinc-500" />
                  </div>
                  <span className="text-sm text-zinc-500">Pre-Assessment</span>
                </div>
                <div className="text-3xl font-bold text-zinc-900">
                  {preQuiz ? `${preQuiz.score}/${preQuiz.totalQuestions}` : '--'}
                </div>
                <p className="text-xs text-zinc-400 mt-1">Starting knowledge</p>
              </div>

              <div className="p-6 rounded-xl border border-zinc-200/80 bg-white shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center">
                    <Trophy strokeWidth={1.5} className="w-4 h-4 text-zinc-600" />
                  </div>
                  <span className="text-sm text-zinc-500">Post-Assessment</span>
                </div>
                <div className="text-3xl font-bold text-zinc-900">
                  {postQuiz ? `${postQuiz.score}/${postQuiz.totalQuestions}` : '--'}
                </div>
                <p className="text-xs text-zinc-400 mt-1">After completing rooms</p>
              </div>

              <div className="p-6 rounded-xl border border-zinc-200/80 bg-white shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                    <TrendingUp strokeWidth={1.5} className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span className="text-sm text-zinc-500">Improvement</span>
                </div>
                <div className="text-3xl font-bold">
                  {improvement !== null ? (
                    <span className={improvement > 0 ? 'text-emerald-700' : 'text-zinc-900'}>
                      {improvement > 0 ? '+' : ''}{improvement}
                    </span>
                  ) : <span className="text-zinc-900">--</span>}
                </div>
                <p className="text-xs text-zinc-400 mt-1">Points gained</p>
              </div>
            </motion.div>

            {/* Improvement Banner */}
            {improvement !== null && improvement > 0 && (
              <motion.div variants={fadeUp} custom={1.5} className="mb-10">
                <div className="p-6 rounded-xl border border-emerald-200 bg-emerald-50/70">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center">
                      <Sparkles strokeWidth={1.5} className="w-7 h-7 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-emerald-700">+{improvement} points improvement</p>
                      <p className="text-sm text-zinc-500 mt-1">
                        Your knowledge grew from {preQuiz?.score}/{preQuiz?.totalQuestions} to {postQuiz?.score}/{postQuiz?.totalQuestions} after the escape rooms.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Room Scores */}
            <motion.div variants={fadeUp} custom={2} className="mb-10">
              <h2 className="text-xl font-semibold text-zinc-900 mb-5">
                Room Performance
              </h2>

              {scores.length > 0 ? (
                <div className="space-y-3">
                  {scores.map((scoreData, i) => {
                    const Icon = roomIcons[scoreData.roomId] || Target;
                    const percentage = Math.round((scoreData.score / scoreData.maxScore) * 100);
                    const minutes = Math.floor(scoreData.timeSpent / 60);
                    return (
                      <motion.div
                        key={scoreData.roomId}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        className="flex items-center gap-4 p-5 rounded-xl border border-zinc-200/80 bg-white shadow-sm"
                      >
                        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${roomColors[scoreData.roomId] || 'from-zinc-400 to-zinc-500'} flex items-center justify-center shadow-sm`}>
                          <Icon strokeWidth={1.5} className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h3 className="text-sm font-semibold text-zinc-900">
                                {roomNames[scoreData.roomId] || scoreData.roomId}
                              </h3>
                              <div className="flex items-center gap-3 text-xs text-zinc-400 mt-0.5">
                                <span>{minutes} min</span>
                                <span>{scoreData.hintsUsed} hints</span>
                              </div>
                            </div>
                            <span className="text-lg font-bold text-zinc-900">{percentage}%</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-zinc-100 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }}
                              className={`h-full rounded-full ${roomBarColors[scoreData.roomId] || 'bg-zinc-700'}`}
                            />
                          </div>
                        </div>
                        <CheckCircle2 strokeWidth={1.5} className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 rounded-xl border border-zinc-200/80 bg-white shadow-sm text-center">
                  <Sparkles strokeWidth={1.5} className="w-8 h-8 text-zinc-300 mx-auto mb-3" />
                  <p className="text-zinc-500 text-sm">No room scores yet. Complete a room to see your results here.</p>
                  <Link
                    href="/hub"
                    className="inline-flex items-center gap-2 mt-4 text-sm text-zinc-900 underline hover:text-zinc-600 transition-colors"
                  >
                    Go to rooms <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </motion.div>

            {/* Leaderboard Section */}
            <motion.div variants={fadeUp} custom={2.5} className="mb-10">
              <h2 className="text-xl font-semibold text-zinc-900 mb-5 flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-500" />
                Global Leaderboard
              </h2>
              <div className="bg-white rounded-xl border border-zinc-200/80 shadow-sm overflow-hidden">
                {leaderboard.length > 0 ? (
                  <div className="divide-y divide-zinc-100">
                    {leaderboard.map((entry, idx) => (
                      <div key={entry._id} className={`flex items-center gap-4 p-4 ${entry._id === user?.id ? 'bg-amber-50/30' : ''}`}>
                        <div className="w-8 font-bold text-zinc-400 text-center flex-shrink-0">
                          {idx === 0 ? <Crown className="w-5 h-5 text-amber-500 mx-auto" /> : 
                           idx === 1 ? <Medal className="w-5 h-5 text-zinc-400 mx-auto" /> : 
                           idx === 2 ? <Medal className="w-5 h-5 text-amber-700 mx-auto" /> : 
                           `#${idx + 1}`}
                        </div>
                        <div className="flex-1">
                          <p className={`font-semibold ${entry._id === user?.id ? 'text-zinc-900' : 'text-zinc-700'}`}>
                            {entry.name || 'Anonymous User'} {entry._id === user?.id && '(You)'}
                          </p>
                          <p className="text-xs text-zinc-500">Level {Math.floor(entry.xp / 1000) + 1} • {entry.roomsCompleted} rooms completed</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-zinc-900">{entry.xp} XP</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-zinc-500 text-sm">
                    No leaderboard data available yet. Be the first to score!
                  </div>
                )}
              </div>
            </motion.div>

            {/* Next Steps */}
            <motion.div variants={fadeUp} custom={3}>
              <h2 className="text-xl font-semibold text-zinc-900 mb-5">
                Next Steps
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {!allRoomsComplete && (
                  <Link
                    href="/hub"
                    className="group flex items-center gap-4 p-5 rounded-xl border border-amber-200 bg-amber-50/70 hover:bg-amber-50 transition-all duration-300 shadow-sm"
                  >
                    <div className="w-10 h-10 rounded-lg bg-amber-100 border border-amber-200 flex items-center justify-center">
                      <Target strokeWidth={1.5} className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-zinc-900">Continue Rooms</h3>
                      <p className="text-xs text-zinc-500">{3 - completedRooms} room{3 - completedRooms > 1 ? 's' : ''} remaining</p>
                    </div>
                    <ArrowRight strokeWidth={1.5} className="w-4 h-4 text-amber-600 group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}
                {allRoomsComplete && !postQuiz && (
                  <Link
                    href="/quiz?type=post"
                    className="group flex items-center gap-4 p-5 rounded-xl border border-zinc-300 bg-zinc-900 hover:bg-zinc-800 transition-all duration-300 shadow-sm"
                  >
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                      <Trophy strokeWidth={1.5} className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-white">Take Post-Assessment</h3>
                      <p className="text-xs text-zinc-400">Measure your improvement</p>
                    </div>
                    <ArrowRight strokeWidth={1.5} className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}
                <Link
                  href="/resources"
                  className="group flex items-center gap-4 p-5 rounded-xl border border-zinc-200/80 bg-white hover:shadow-sm transition-all duration-300 shadow-sm"
                >
                  <div className="w-10 h-10 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center">
                    <BookOpen strokeWidth={1.5} className="w-5 h-5 text-zinc-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-zinc-900">Continue Learning</h3>
                    <p className="text-xs text-zinc-500">Explore trusted resources</p>
                  </div>
                  <ArrowRight strokeWidth={1.5} className="w-4 h-4 text-zinc-400 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
