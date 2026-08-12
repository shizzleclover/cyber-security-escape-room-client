'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/features/auth/AuthContext';
import api from '@/lib/api';
import { Shield, Award, Printer, ArrowLeft } from 'lucide-react';

const ROOM_NAMES: Record<string, string> = {
  phishing: 'Phishing Detection',
  passwords: 'Password Security',
  'social-engineering': 'Social Engineering',
};

export default function CertificatePage() {
  return <CertificateContent />;
}

function CertificateContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [eligible, setEligible] = useState(false);
  const [completedRooms, setCompletedRooms] = useState<string[]>([]);
  const [issuedDate, setIssuedDate] = useState('');

  useEffect(() => {
    const check = async () => {
      try {
        const [scoresRes, quizRes]: any[] = await Promise.all([
          api.get('/scores').catch(() => ({ data: { scores: [] } })),
          api.get('/quiz').catch(() => ({ data: { results: [] } })),
        ]);
        const scores = scoresRes.data?.scores || [];
        const quizzes = quizRes.data?.results || [];
        const postQuiz = quizzes.find((q: any) => q.type === 'post');

        // The certificate is only issued once all three rooms AND the
        // post-assessment are complete (FR-15 / FR-11).
        const roomsDone = scores.map((s: any) => s.roomId);
        const allRooms = ['phishing', 'passwords', 'social-engineering'].every((r) =>
          roomsDone.includes(r)
        );

        if (allRooms && postQuiz) {
          setEligible(true);
          setCompletedRooms(roomsDone);
          // Prefer the post-quiz completion date; fall back to today.
          const d = postQuiz.completedAt ? new Date(postQuiz.completedAt) : new Date();
          setIssuedDate(
            d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
          );
        }
      } catch {
        // Fall through to the ineligible state.
      } finally {
        setLoading(false);
      }
    };
    check();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#F7F7F8]">
        <div className="w-10 h-10 border-2 border-zinc-400 border-t-zinc-900 rounded-full animate-spin" />
      </main>
    );
  }

  if (!eligible) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 bg-[#F7F7F8]">
        <div className="max-w-md text-center">
          <Award strokeWidth={1.5} className="w-14 h-14 text-zinc-300 mx-auto mb-5" />
          <h1 className="text-2xl font-bold text-zinc-900 mb-3">Certificate not ready yet</h1>
          <p className="text-zinc-500 text-[15px] mb-8 leading-relaxed">
            Your certificate unlocks once you have completed all three rooms and the
            post-assessment quiz. Keep going — you are almost there.
          </p>
          <Link
            href="/hub"
            className="inline-flex items-center gap-2 px-6 py-3.5 text-[15px] font-bold text-white rounded-full bg-zinc-900 hover:bg-zinc-800 transition-all duration-300"
          >
            <ArrowLeft strokeWidth={2} className="w-4 h-4" />
            Back to Rooms
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-12 bg-[#F7F7F8] flex flex-col items-center">
      {/* Certificate */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 100, damping: 20 }}
        className="certificate-print-area w-full max-w-2xl bg-white border border-zinc-200 rounded-2xl shadow-sm p-10 md:p-14 text-center relative overflow-hidden"
      >
        {/* Decorative border frame */}
        <div className="absolute inset-3 border-2 border-zinc-100 rounded-xl pointer-events-none" />

        <div className="relative">
          <div className="flex items-center justify-center gap-2 mb-8">
            <Shield strokeWidth={2} className="w-6 h-6 text-zinc-900" />
            <span className="text-lg font-bold tracking-tight text-zinc-900">CyberEscape</span>
          </div>

          <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-6">
            <Award strokeWidth={1.5} className="w-8 h-8 text-amber-500" />
          </div>

          <p className="text-[13px] uppercase tracking-[0.2em] text-zinc-400 font-semibold mb-3">
            Certificate of Completion
          </p>

          <p className="text-zinc-500 text-[15px] mb-2">This certifies that</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-zinc-900 mb-4">
            {user?.name || 'Valued Learner'}
          </h1>

          <p className="text-zinc-600 text-[15px] leading-relaxed max-w-md mx-auto mb-8">
            has successfully completed the CyberEscape interactive cybersecurity training,
            demonstrating practical skills in recognising phishing, securing passwords, and
            resisting social engineering.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {completedRooms.map((r) => (
              <span
                key={r}
                className="px-3 py-1.5 rounded-full bg-zinc-50 border border-zinc-200 text-[13px] font-medium text-zinc-700"
              >
                {ROOM_NAMES[r] || r}
              </span>
            ))}
          </div>

          <div className="pt-6 border-t border-zinc-100 flex items-center justify-between text-left">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">Issued</p>
              <p className="text-[14px] font-semibold text-zinc-900">{issuedDate}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">Programme</p>
              <p className="text-[14px] font-semibold text-zinc-900">Digital Safety Training</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Actions (hidden when printing) */}
      <div className="no-print flex items-center gap-3 mt-8">
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-6 py-3.5 text-[15px] font-bold text-white rounded-full bg-zinc-900 hover:bg-zinc-800 shadow-sm transition-all duration-300"
        >
          <Printer strokeWidth={2} className="w-4 h-4" />
          Print / Save as PDF
        </button>
        <button
          onClick={() => router.push('/dashboard')}
          className="inline-flex items-center gap-2 px-6 py-3.5 text-[15px] font-bold text-zinc-600 hover:text-zinc-900 rounded-full border border-zinc-200 hover:border-zinc-300 hover:bg-white transition-all duration-300"
        >
          <ArrowLeft strokeWidth={2} className="w-4 h-4" />
          Dashboard
        </button>
      </div>
    </main>
  );
}
