'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/features/auth/AuthContext';
import ProtectedRoute from '@/features/auth/ProtectedRoute';
import api from '@/lib/api';
import { 
  User, Shield, Mail, Lock, Users, Trophy, 
  Award, Sparkles, Star, Zap
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, type: 'spring' as const, stiffness: 100, damping: 20 },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}

function ProfileContent() {
  const { user } = useAuth();
  const [scores, setScores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response: any = await api.get('/scores');
        setScores(response.data?.scores || []);
      } catch {
        // Silent fail
      } finally {
        setLoading(false);
      }
    };
    fetchScores();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F7F8]">
        <div className="w-10 h-10 border-2 border-zinc-400 border-t-zinc-900 rounded-full animate-spin" />
      </div>
    );
  }

  // Calculate XP and Levels
  const totalXP = scores.reduce((acc, curr) => acc + (curr.score * 100), 0);
  const currentLevel = Math.floor(totalXP / 1000) + 1;
  const xpForNextLevel = currentLevel * 1000;
  const xpProgress = (totalXP % 1000) / 1000 * 100;

  // Badges logic
  const badges = [];
  if (scores.some(s => s.roomId === 'phishing' && s.percentage === 100)) {
    badges.push({ name: 'Phishing Expert', icon: Mail, color: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-200' });
  }
  if (scores.some(s => s.roomId === 'passwords' && s.percentage === 100)) {
    badges.push({ name: 'Security Master', icon: Lock, color: 'text-violet-500', bg: 'bg-violet-50', border: 'border-violet-200' });
  }
  if (scores.some(s => s.roomId === 'social-engineering' && s.percentage === 100)) {
    badges.push({ name: 'Social Shield', icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-200' });
  }
  if (scores.length >= 3) {
    badges.push({ name: 'Escape Artist', icon: Trophy, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200' });
  }

  return (
    <main className="min-h-screen bg-[#F7F7F8] py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div initial="hidden" animate="visible" variants={stagger}>
          {/* Header Profile Card */}
          <motion.div variants={fadeUp} custom={0} className="p-8 rounded-3xl bg-white border border-zinc-200/80 shadow-sm mb-8 flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 border-4 border-white shadow-lg flex items-center justify-center relative flex-shrink-0">
              <User strokeWidth={1.5} className="w-12 h-12 text-white" />
              <div className="absolute -bottom-3 -right-3 w-12 h-12 rounded-full bg-amber-400 border-4 border-white shadow-sm flex items-center justify-center">
                <span className="font-bold text-amber-900 text-sm">{currentLevel}</span>
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">{user?.name}</h1>
                <div className="px-3 py-1 bg-zinc-100 rounded-full text-xs font-bold text-zinc-600 uppercase tracking-wider">
                  Level {currentLevel}
                </div>
              </div>
              <p className="text-zinc-500 font-medium mb-6">{user?.email}</p>
              
              <div className="w-full max-w-md mx-auto md:mx-0">
                <div className="flex justify-between text-sm font-bold mb-2">
                  <span className="text-zinc-400">XP Progress</span>
                  <span className="text-zinc-900">{totalXP} / {xpForNextLevel} XP</span>
                </div>
                <div className="h-3 bg-zinc-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${xpProgress}%` }}
                    transition={{ duration: 1, delay: 0.5, type: 'spring' }}
                    className="h-full bg-zinc-900 rounded-full"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Badges Section */}
          <motion.div variants={fadeUp} custom={1} className="mb-8">
            <h2 className="text-xl font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Earned Badges
            </h2>
            {badges.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {badges.map((badge, idx) => (
                  <motion.div 
                    key={badge.name}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 + (idx * 0.1) }}
                    className={`p-6 rounded-2xl border ${badge.border} ${badge.bg} flex flex-col items-center text-center group hover:-translate-y-1 transition-transform`}
                  >
                    <badge.icon strokeWidth={1.5} className={`w-10 h-10 ${badge.color} mb-3 group-hover:scale-110 transition-transform`} />
                    <span className={`font-bold text-sm ${badge.color}`}>{badge.name}</span>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-white border border-zinc-200/80 text-center">
                <Sparkles className="w-8 h-8 text-zinc-300 mx-auto mb-3" />
                <p className="text-zinc-500 font-medium">No badges earned yet. Complete rooms with 100% to unlock them!</p>
              </div>
            )}
          </motion.div>

          {/* Account Details */}
          <motion.div variants={fadeUp} custom={2}>
            <h2 className="text-xl font-bold text-zinc-900 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-zinc-500" />
              Account Details
            </h2>
            <div className="bg-white rounded-3xl border border-zinc-200/80 p-8 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <p className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-1">Age Group</p>
                  <p className="text-zinc-900 font-medium">{user?.ageGroup}</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-1">Digital Confidence</p>
                  <div className="flex gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`w-5 h-5 ${star <= (user?.digitalConfidence || 0) ? 'fill-amber-400 text-amber-400' : 'text-zinc-200'}`} 
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </main>
  );
}
