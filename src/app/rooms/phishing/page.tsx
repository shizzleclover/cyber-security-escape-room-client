'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import ProtectedRoute from '@/features/auth/ProtectedRoute';
import api from '@/lib/api';
import { 
  Mail, ShieldCheck, ShieldAlert, Lightbulb, 
  ArrowRight, CheckCircle2, XCircle, AlertTriangle,
  Clock, Eye, Trophy
} from 'lucide-react';

const shakeAnimation = {
  x: [-10, 10, -10, 10, -5, 5, 0],
  transition: { duration: 0.4 }
};

interface EmailLink {
  text: string;
  actualUrl: string;
}

interface Email {
  id: number;
  senderName: string;
  senderEmail: string;
  subject: string;
  timestamp: string;
  body: string;
  links: EmailLink[];
  hint: string;
  difficulty: string;
}

interface FeedbackData {
  correct: boolean;
  emailType: 'phishing' | 'legitimate';
  redFlags: string[];
  legitimateIndicators: string[];
  lesson?: string;
  externalLink?: { text: string; url: string };
}

export default function PhishingRoomPage() {
  return (
    <ProtectedRoute>
      <PhishingRoomContent />
    </ProtectedRoute>
  );
}

function PhishingRoomContent() {
  const router = useRouter();
  const [emails, setEmails] = useState<Email[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [score, setScore] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [roomComplete, setRoomComplete] = useState(false);
  const [startTime] = useState(Date.now());
  const [shake, setShake] = useState(false);

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response: any = await api.get('/content/phishing-emails');
        setEmails(response.data.emails);
      } catch {
        // Fallback
      } finally {
        setLoading(false);
      }
    };
    fetchEmails();
  }, []);

  const currentEmail = emails[currentIndex];
  const totalEmails = emails.length;

  const handleAnswer = async (answer: 'safe' | 'suspicious') => {
    if (!currentEmail || feedback) return;
    try {
      const response: any = await api.post('/content/phishing-emails/check', {
        emailId: currentEmail.id,
        answer,
      });
      const result = response.data;
      setFeedback(result);
      if (result.correct) {
        setScore((prev) => prev + 1);
      } else {
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
    } catch {
      // Fallback
    }
  };

  const handleNext = () => {
    if (currentIndex < totalEmails - 1) {
      setCurrentIndex((prev) => prev + 1);
      setFeedback(null);
      setShowHint(false);
    } else {
      handleRoomComplete();
    }
  };

  const handleRoomComplete = async () => {
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    setRoomComplete(true);
    try {
      await api.post('/scores', { roomId: 'phishing', score, maxScore: totalEmails, hintsUsed, timeSpent });
      await api.put('/progress/phishing', { status: 'completed', currentStep: totalEmails });
    } catch {}
  };

  const handleHint = () => {
    if (!showHint) setHintsUsed((prev) => prev + 1);
    setShowHint(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F7F8]">
        <div className="w-10 h-10 border-2 border-zinc-400 border-t-zinc-900 rounded-full animate-spin" />
      </div>
    );
  }

  // Room Complete Screen
  if (roomComplete) {
    const percentage = Math.round((score / totalEmails) * 100);
    return (
      <main className="relative min-h-screen flex items-center justify-center px-6 py-12 bg-[#F7F7F8]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 100, damping: 20 }}
          className="relative w-full max-w-lg"
        >
          <div className="p-10 rounded-2xl border border-zinc-200/80 bg-white shadow-sm text-center">
            <Trophy strokeWidth={1.5} className="w-16 h-16 text-zinc-900 mx-auto mb-6" />
            <h2 className="text-3xl font-extrabold text-zinc-900 mb-2">
              Phishing Room Complete!
            </h2>
            <p className="text-zinc-500 mb-6 text-[15px]">
              You correctly identified <span className="text-zinc-900 font-bold">{score}</span> out of <span className="text-zinc-900 font-bold">{totalEmails}</span> emails ({percentage}%)
            </p>
            <div className="mb-6">
              <div className="h-3 rounded-full bg-zinc-100 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1.2, delay: 0.3, type: 'spring', stiffness: 100, damping: 20 }}
                  className="h-full rounded-full bg-zinc-900"
                />
              </div>
            </div>
            <p className="text-sm font-medium text-zinc-400 mb-8 uppercase tracking-wide">Hints used: {hintsUsed}</p>
            
            <div className="flex flex-col gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/debrief?room=phishing')}
                className="group w-full inline-flex items-center justify-center gap-2 py-4 text-[15px] font-bold text-white rounded-full bg-zinc-900 hover:bg-zinc-800 shadow-sm transition-all duration-300"
              >
                View Debrief
                <ArrowRight strokeWidth={2} className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/hub')}
                className="w-full py-4 text-[15px] font-bold text-zinc-600 hover:text-zinc-900 rounded-full border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 transition-all duration-300"
              >
                Back to Rooms
              </motion.button>
            </div>
          </div>
        </motion.div>
      </main>
    );
  }

  if (!currentEmail) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 bg-[#F7F7F8]">
        <div className="text-center">
          <Mail strokeWidth={1.5} className="w-12 h-12 text-zinc-400 mx-auto mb-4" />
          <p className="text-zinc-500">No emails loaded. Please check your connection and try again.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-[#F7F7F8] flex items-center justify-center">
      <motion.div animate={shake ? shakeAnimation : {}} className="relative w-full max-w-4xl px-6 py-16">
        {/* Header */}
        <motion.div layout className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Mail strokeWidth={1.5} className="w-8 h-8 text-zinc-900" />
              <div>
                <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
                  Phishing Detection
                </h1>
                <p className="text-[13px] font-medium text-zinc-400 uppercase tracking-wider mt-1">Email {currentIndex + 1} of {totalEmails}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 bg-zinc-100 px-3 py-1.5 rounded-full border border-zinc-200">
              <Eye className="w-3.5 h-3.5" />
              <span>Hover links to inspect</span>
            </div>
          </div>

          <div className="h-1.5 rounded-full bg-zinc-100 overflow-hidden mt-6">
            <motion.div
              initial={false}
              animate={{ width: `${((currentIndex + 1) / totalEmails) * 100}%` }}
              transition={{ duration: 0.4, type: 'spring', stiffness: 100, damping: 20 }}
              className="h-full rounded-full bg-zinc-900"
            />
          </div>
        </motion.div>

        {/* Email Display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, type: 'spring', stiffness: 100, damping: 20 }}
          >
            <motion.div layout className="rounded-2xl border border-zinc-200 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden mb-6">
              {/* Email Header */}
              <div className="p-6 border-b border-zinc-100 bg-zinc-50/50">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-bold text-zinc-900 text-[15px]">{currentEmail.senderName}</p>
                    <p className="text-sm text-zinc-500 font-mono mt-1">&lt;{currentEmail.senderEmail}&gt;</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-400">
                    <Clock strokeWidth={1.5} className="w-3.5 h-3.5" />
                    <span>{currentEmail.timestamp}</span>
                  </div>
                </div>
                <p className="text-zinc-900 font-bold text-[15px] mt-4">{currentEmail.subject}</p>
              </div>

              {/* Email Body */}
              <div className="p-6 text-zinc-700 leading-relaxed text-[15px] whitespace-pre-line">
                {currentEmail.body.split(/(\[.*?\]\(.*?\))/).map((part, i) => {
                  const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
                  if (linkMatch) {
                    const linkData = currentEmail.links.find(l => l.text === linkMatch[1]);
                    return (
                      <span
                        key={i}
                        className="text-blue-600 underline cursor-help relative group inline-block font-medium"
                      >
                        {linkMatch[1]}
                        <span className="absolute bottom-full left-0 mb-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white hidden group-hover:block whitespace-nowrap z-10 shadow-lg">
                          <span className="text-zinc-400">URL: </span>
                          <span className="font-mono">{linkData?.actualUrl || linkMatch[2]}</span>
                        </span>
                      </span>
                    );
                  }
                  return <span key={i}>{part}</span>;
                })}
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Dynamic Sections */}
        <motion.div layout>
          <AnimatePresence>
            {showHint && !feedback && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mb-6"
              >
                <div className="flex items-start gap-3 p-5 rounded-2xl border border-amber-200 bg-amber-50">
                  <Lightbulb strokeWidth={1.5} className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-[15px] font-medium text-amber-800 leading-relaxed">{currentEmail.hint}</p>
                </div>
              </motion.div>
            )}

            {feedback && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="overflow-hidden mb-6"
              >
                <div className={`p-6 rounded-2xl border ${
                  feedback.correct 
                    ? 'border-emerald-200 bg-emerald-50' 
                    : 'border-red-200 bg-red-50'
                }`}>
                  <div className="flex items-start gap-3 mb-4">
                    {feedback.correct ? (
                      <CheckCircle2 strokeWidth={2} className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                    ) : (
                      <XCircle strokeWidth={2} className="w-6 h-6 text-red-600 flex-shrink-0" />
                    )}
                    <div>
                      <h3 className={`font-bold text-[15px] ${feedback.correct ? 'text-emerald-700' : 'text-red-700'}`}>
                        {feedback.correct ? 'Correct!' : 'Not quite right.'}
                      </h3>
                      <p className="text-[15px] font-medium text-zinc-700 mt-1">
                        This email was <span className="font-bold text-zinc-900">{feedback.emailType === 'phishing' ? 'a phishing attempt' : 'legitimate'}</span>.
                      </p>
                    </div>
                  </div>

                  {feedback.redFlags.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-zinc-200/50">
                      <p className="text-[11px] font-bold text-red-600 uppercase tracking-wider mb-3">Red Flags Detected</p>
                      <ul className="space-y-2">
                        {feedback.redFlags.map((flag, i) => (
                          <li key={i} className="flex items-start gap-2 text-[14px] font-medium text-zinc-700">
                            <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                            {flag}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {feedback.legitimateIndicators.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-zinc-200/50">
                      <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider mb-3">Legitimate Signs</p>
                      <ul className="space-y-2">
                        {feedback.legitimateIndicators.map((indicator, i) => (
                          <li key={i} className="flex items-start gap-2 text-[14px] font-medium text-zinc-700">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                            {indicator}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {feedback.lesson && (
                    <div className="mt-4 pt-4 border-t border-zinc-200/50">
                      <p className="text-[14px] font-medium text-zinc-700 leading-relaxed mb-3">
                        <span className="font-bold text-zinc-900">Key Lesson: </span>
                        {feedback.lesson}
                      </p>
                      {feedback.externalLink && (
                        <a 
                          href={feedback.externalLink.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[13px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full transition-colors"
                        >
                          {feedback.externalLink.text}
                          <ArrowRight strokeWidth={2} className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="w-full sm:w-auto">
              {!feedback && !showHint && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleHint}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 text-[14px] font-bold text-amber-700 hover:text-amber-800 rounded-full border border-amber-200 hover:bg-amber-50 transition-all duration-200"
                >
                  <Lightbulb strokeWidth={2} className="w-4 h-4" />
                  Need a Hint?
                </motion.button>
              )}
            </div>

            <div className="flex w-full sm:w-auto items-center gap-3">
              {!feedback ? (
                <>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer('safe')}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3.5 text-[15px] font-bold text-emerald-700 rounded-full border border-emerald-200 hover:bg-emerald-50 transition-all duration-200"
                  >
                    <ShieldCheck strokeWidth={2} className="w-4 h-4" />
                    Safe
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer('suspicious')}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3.5 text-[15px] font-bold text-rose-700 rounded-full border border-rose-200 hover:bg-rose-50 transition-all duration-200"
                  >
                    <ShieldAlert strokeWidth={2} className="w-4 h-4" />
                    Suspicious
                  </motion.button>
                </>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNext}
                  className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-[15px] font-bold text-white rounded-full bg-zinc-900 hover:bg-zinc-800 shadow-sm transition-all duration-300"
                >
                  {currentIndex < totalEmails - 1 ? 'Next Email' : 'Finish Room'}
                  <ArrowRight strokeWidth={2} className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </main>
  );
}
