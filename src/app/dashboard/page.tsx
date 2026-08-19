'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/features/auth/AuthContext';
import api from '@/lib/api';
import { getLocalQuiz } from '@/lib/quizLocal';
import { getLocalScores } from '@/lib/progressLocal';
import {
  Trophy, TrendingUp, Target, CheckCircle2,
  ArrowRight, BookOpen, BarChart3, Sparkles,
  Mail, Lock, Users, Crown, Medal, Award
} from 'lucide-react';
import PostInterviewForm from '@/components/evaluation/PostInterviewForm';

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
  return <DashboardContent />;
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
        
        let fetchedScores = scoresRes.data?.scores || [];
        if (fetchedScores.length === 0) {
          const localScores = getLocalScores();
          if (localScores.length > 0) fetchedScores = localScores;
        }
        setScores(fetchedScores);
        const results = quizRes.data?.results || [];
        // If a quiz was just finished but the server save hasn't landed (slow
        // cold start), merge the local copy so the scoreboard never looks stale.
        for (const type of ['pre', 'post'] as const) {
          if (!results.some((q: QuizData) => q.type === type)) {
            const local = getLocalQuiz(type);
            if (local) {
              results.push({
                type,
                score: local.score,
                totalQuestions: local.totalQuestions,
                completedAt: local.completedAt,
              });
            }
          }
        }
        setQuizzes(results);
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
    phishing: 'from-rose-500 to-orange-500',
    passwords: 'from-violet-500 to-purple-600',
    'social-engineering': 'from-emerald-500 to-teal-600',
  };

  const roomBarColors: Record<string, string> = {
    phishing: 'bg-gradient-to-r from-rose-500 to-orange-500',
    passwords: 'bg-gradient-to-r from-violet-500 to-purple-600',
    'social-engineering': 'bg-gradient-to-r from-emerald-500 to-teal-600',
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
              <div className="p-6 rounded-2xl border border-zinc-200/40 bg-white/70 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                    <Target strokeWidth={1.25} className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-sm text-zinc-500 font-medium tracking-wide">Pre-Assessment</span>
                </div>
                <div className="text-3xl font-bold text-zinc-900 mt-2">
                  {preQuiz ? `${preQuiz.score}/${preQuiz.totalQuestions}` : '--'}
                </div>
                <p className="text-xs text-zinc-400 mt-1">Starting knowledge</p>
              </div>

              <div className="p-6 rounded-2xl border border-zinc-200/40 bg-white/70 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center">
                    <Trophy strokeWidth={1.25} className="w-5 h-5 text-amber-600" />
                  </div>
                  <span className="text-sm text-zinc-500 font-medium tracking-wide">Post-Assessment</span>
                </div>
                <div className="text-3xl font-bold text-zinc-900 mt-2">
                  {postQuiz ? `${postQuiz.score}/${postQuiz.totalQuestions}` : '--'}
                </div>
                <p className="text-xs text-zinc-400 mt-1">After completing rooms</p>
              </div>

              <div className="p-6 rounded-2xl border border-zinc-200/40 bg-white/70 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                    <TrendingUp strokeWidth={1.25} className="w-5 h-5 text-emerald-600" />
                  </div>
                  <span className="text-sm text-zinc-500 font-medium tracking-wide">Improvement</span>
                </div>
                <div className="text-3xl font-bold mt-2">
                  {improvement !== null ? (
                    <span className={improvement > 0 ? 'text-emerald-600' : 'text-zinc-900'}>
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
                <div className="p-6 rounded-2xl border border-emerald-100 bg-emerald-50/50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white border border-emerald-100 flex items-center justify-center">
                      <Sparkles strokeWidth={1.25} className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-emerald-800">+{improvement} points improvement</p>
                      <p className="text-sm text-emerald-600/80 mt-0.5">
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
                    const percentage = Math.min(100, Math.round((scoreData.score / Math.max(1, scoreData.maxScore)) * 100));
                    const minutes = Math.floor(scoreData.timeSpent / 60);
                    return (
                      <motion.div
                        key={scoreData.roomId}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        className="flex items-center gap-5 p-5 rounded-2xl border border-zinc-200/40 bg-white/70 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow duration-300"
                      >
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${roomColors[scoreData.roomId] || 'from-zinc-400 to-zinc-500'} flex items-center justify-center shadow-sm`}>
                          <Icon strokeWidth={1.5} className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h3 className="text-[15px] font-semibold text-zinc-900">
                                {roomNames[scoreData.roomId] || scoreData.roomId}
                              </h3>
                              <div className="flex items-center gap-3 text-[13px] text-zinc-500 mt-0.5">
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
                              className={`h-full rounded-full ${roomBarColors[scoreData.roomId] || 'bg-blue-600'}`}
                            />
                          </div>
                        </div>
                        <CheckCircle2 strokeWidth={1.5} className="w-5 h-5 text-blue-600 flex-shrink-0 ml-2" />
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 rounded-2xl border border-zinc-200/40 bg-white/60 backdrop-blur-sm shadow-sm text-center">
                  <Sparkles strokeWidth={1.25} className="w-8 h-8 text-zinc-400 mx-auto mb-3" />
                  <p className="text-zinc-500 text-sm">No room scores yet. Complete a room to see your results here.</p>
                  <Link
                    href="/hub"
                    className="inline-flex items-center gap-2 mt-4 text-sm font-medium text-zinc-900 underline hover:text-blue-600 transition-colors"
                  >
                    Go to rooms <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </motion.div>

            {/* Leaderboard Section */}
            <motion.div variants={fadeUp} custom={2.5} className="mb-10">
              <h2 className="text-xl font-semibold text-zinc-900 mb-5 flex items-center gap-2">
                <Crown className="w-5 h-5 text-blue-600" />
                Global Leaderboard
              </h2>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-zinc-200/40 shadow-sm overflow-hidden">
                {leaderboard.length > 0 ? (
                  <div className="divide-y divide-zinc-100/50">
                    {leaderboard.map((entry, idx) => (
                      <div key={entry._id} className={`flex items-center gap-4 p-4 ${entry._id === user?.id ? 'bg-blue-50/40' : ''}`}>
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
                    className="group flex items-center gap-4 p-5 rounded-2xl border border-zinc-200/40 bg-white/60 backdrop-blur-sm hover:bg-white hover:shadow-md transition-all duration-300 shadow-sm"
                  >
                    <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                      <Target strokeWidth={1.25} className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[15px] font-semibold text-zinc-900">Continue Rooms</h3>
                      <p className="text-[13px] text-zinc-500">{3 - completedRooms} room{3 - completedRooms > 1 ? 's' : ''} remaining</p>
                    </div>
                    <ArrowRight strokeWidth={1.5} className="w-4 h-4 text-zinc-400 group-hover:translate-x-1 group-hover:text-blue-600 transition-all" />
                  </Link>
                )}
                {allRoomsComplete && !postQuiz && (
                  <Link
                    href="/quiz?type=post"
                    className="group flex items-center gap-4 p-5 rounded-2xl border border-blue-200 bg-blue-50/50 hover:bg-blue-50 hover:shadow-md transition-all duration-300 shadow-sm"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white border border-blue-100 flex items-center justify-center">
                      <Trophy strokeWidth={1.25} className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[15px] font-semibold text-zinc-900">Take Post-Assessment</h3>
                      <p className="text-[13px] text-zinc-600">Measure your improvement</p>
                    </div>
                    <ArrowRight strokeWidth={1.5} className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}
                {allRoomsComplete && postQuiz && (
                  <Link
                    href="/certificate"
                    className="group flex items-center gap-4 p-5 rounded-2xl border border-zinc-200/40 bg-white/60 backdrop-blur-sm hover:bg-white hover:shadow-md transition-all duration-300 shadow-sm"
                  >
                    <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                      <Award strokeWidth={1.25} className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[15px] font-semibold text-zinc-900">View Certificate</h3>
                      <p className="text-[13px] text-zinc-500">Your completion certificate is ready</p>
                    </div>
                    <ArrowRight strokeWidth={1.5} className="w-4 h-4 text-zinc-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </Link>
                )}
                <Link
                  href="/resources"
                  className="group flex items-center gap-4 p-5 rounded-2xl border border-zinc-200/40 bg-white/60 backdrop-blur-sm hover:bg-white hover:shadow-md transition-all duration-300 shadow-sm"
                >
                  <div className="w-12 h-12 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center">
                    <BookOpen strokeWidth={1.25} className="w-5 h-5 text-zinc-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[15px] font-semibold text-zinc-900">Continue Learning</h3>
                    <p className="text-[13px] text-zinc-500">Explore trusted resources</p>
                  </div>
                  <ArrowRight strokeWidth={1.5} className="w-4 h-4 text-zinc-400 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>

            {/* Post-Interview Evaluation */}
            {postQuiz && (
              <motion.div variants={fadeUp} custom={3.5} className="mt-12">
                <PostInterviewForm
                  title="Research Post-Interview Questions"
                  subtitle="Help evaluate the platform by answering these 3 quick questions."
                />
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>
    </main>
  );
}
