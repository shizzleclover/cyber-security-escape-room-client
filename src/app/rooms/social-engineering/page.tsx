'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import ProtectedRoute from '@/features/auth/ProtectedRoute';
import api from '@/lib/api';
import { 
  Users, ArrowRight, Trophy, CheckCircle2, XCircle,
  Lightbulb, AlertTriangle, Phone, MessageSquare, Shield
} from 'lucide-react';

const shakeAnimation = {
  x: [-10, 10, -10, 10, -5, 5, 0],
  transition: { duration: 0.4 }
};

interface Message {
  sender: string;
  senderLabel: string;
  text: string;
  timestamp: string;
}

interface Option {
  id: string;
  text: string;
}

interface Scenario {
  id: number;
  type: 'text-message' | 'phone-call';
  title: string;
  difficulty: string;
  setup: string;
  messages: Message[];
  followUp?: { trigger: string; message: string };
  decisionPrompt: string;
  options: Option[];
  hint: string;
}

interface FeedbackData {
  correct: boolean;
  consequence: string;
  lesson: string;
  externalLink?: { text: string; url: string };
  redFlags: string[];
}

export default function SocialEngineeringRoomPage() {
  return (
    <ProtectedRoute>
      <SocialEngineeringContent />
    </ProtectedRoute>
  );
}

function SocialEngineeringContent() {
  const router = useRouter();
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [roomComplete, setRoomComplete] = useState(false);
  const [startTime] = useState(Date.now());
  const [shake, setShake] = useState(false);

  useEffect(() => {
    const fetchScenarios = async () => {
      try {
        const response: any = await api.get('/content/social-engineering');
        setScenarios(response.data.scenarios);
      } catch {
        // Fallback
      } finally {
        setLoading(false);
      }
    };
    fetchScenarios();
  }, []);

  const currentScenario = scenarios[currentIndex];
  const totalScenarios = scenarios.length;

  const handleAnswer = async (answerId: string) => {
    if (feedback) return;
    try {
      const response: any = await api.post('/content/social-engineering/check', {
        scenarioId: currentScenario.id,
        answerId,
      });
      setFeedback(response.data);
      if (response.data.correct) {
        setScore((prev) => prev + 1);
      } else {
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
    } catch {}
  };

  const handleNext = () => {
    if (currentIndex < totalScenarios - 1) {
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
      await api.post('/scores', { roomId: 'social-engineering', score, maxScore: totalScenarios, hintsUsed, timeSpent });
      await api.put('/progress/social-engineering', { status: 'completed', currentStep: totalScenarios });
    } catch {}
  };

  const handleHint = () => {
    if (!showHint) setHintsUsed((prev) => prev + 1);
    setShowHint(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F7F8] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-zinc-400 border-t-zinc-900 rounded-full animate-spin" />
      </div>
    );
  }

  // Room Complete Screen
  if (roomComplete) {
    const percentage = totalScenarios > 0 ? Math.round((score / totalScenarios) * 100) : 0;
    return (
      <main className="relative min-h-screen bg-[#F7F7F8] flex items-center justify-center px-6 py-12">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, type: 'spring', stiffness: 100, damping: 20 }} className="relative w-full max-w-lg">
          <div className="p-10 rounded-2xl border border-zinc-200/80 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)] text-center">
            <Trophy strokeWidth={1.5} className="w-16 h-16 text-zinc-900 mx-auto mb-6" />
            
            <h2 className="text-3xl font-extrabold text-zinc-900 mb-2">
              Social Engineering Complete!
            </h2>
            <p className="text-zinc-500 mb-6 text-[15px]">
              You made the right choice in <span className="text-zinc-900 font-bold">{score}</span> out of <span className="text-zinc-900 font-bold">{totalScenarios}</span> scenarios ({percentage}%)
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
            <p className="text-[13px] text-zinc-400 mb-8 font-bold uppercase tracking-wider">Hints used: {hintsUsed}</p>
            
            <div className="flex flex-col gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/debrief?room=social-engineering')}
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

  if (!currentScenario) {
    return (
      <main className="min-h-screen bg-[#F7F7F8] flex items-center justify-center px-6">
        <div className="text-center">
          <Users strokeWidth={1.5} className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
          <p className="text-zinc-500">No scenarios loaded. Please check your connection and try again.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-[#F7F7F8] flex items-center justify-center">
      <div className="relative w-full max-w-3xl px-6 py-16">
        {/* Header */}
        <motion.div layout className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Users strokeWidth={1.5} className="w-8 h-8 text-zinc-900" />
            <div>
              <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
                Social Engineering
              </h1>
              <p className="text-[13px] font-medium text-zinc-400 uppercase tracking-wider mt-1">Scenario {currentIndex + 1} of {totalScenarios}</p>
            </div>
          </div>
          <div className="h-1.5 rounded-full bg-zinc-100 overflow-hidden mt-6">
            <motion.div
              initial={false}
              animate={{ width: `${((currentIndex + 1) / totalScenarios) * 100}%` }}
              transition={{ duration: 0.4, type: 'spring', stiffness: 100, damping: 20 }}
              className="h-full rounded-full bg-zinc-900"
            />
          </div>
        </motion.div>

        <motion.div animate={shake ? shakeAnimation : {}}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, type: 'spring', stiffness: 100, damping: 20 }}
            >
              <motion.div layout className="p-8 rounded-2xl bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-zinc-200">
                {/* Scenario Type Badge + Title */}
                <div className="flex items-center gap-3 mb-4">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-bold tracking-tight uppercase ${
                    currentScenario.type === 'phone-call'
                      ? 'bg-violet-50 text-violet-700 border border-violet-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {currentScenario.type === 'phone-call' ? (
                      <><Phone strokeWidth={2} className="w-3.5 h-3.5" /> Phone Call</>
                    ) : (
                      <><MessageSquare strokeWidth={2} className="w-3.5 h-3.5" /> Text Message</>
                    )}
                  </span>
                  <h2 className="text-lg font-bold text-zinc-900">{currentScenario.title}</h2>
                </div>

                {/* Setup */}
                <p className="text-[15px] font-medium text-zinc-500 mb-6 leading-relaxed">{currentScenario.setup}</p>

                {/* Messages Chat Bubbles */}
                <div className="p-6 rounded-2xl border border-zinc-100 bg-zinc-50 mb-6">
                  <div className="space-y-4">
                    {currentScenario.messages.map((msg, i) => (
                      <div key={i} className="flex flex-col">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-[13px] font-bold text-zinc-500">{msg.senderLabel}</span>
                          <span className="text-[11px] font-medium uppercase text-zinc-400">{msg.timestamp}</span>
                        </div>
                        <div className={`rounded-2xl px-5 py-3.5 max-w-[85%] ${
                          msg.sender === 'caller'
                            ? 'bg-violet-100 border border-violet-200 text-violet-900'
                            : 'bg-emerald-100 border border-emerald-200 text-emerald-900'
                        }`}>
                          <p className="font-medium text-[15px] leading-relaxed whitespace-pre-line">{msg.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {currentScenario.followUp && (
                    <div className="mt-6 pt-6 border-t border-zinc-200/60">
                      <p className="text-[11px] font-bold text-zinc-400 mb-3 uppercase tracking-wider">{currentScenario.followUp.trigger}</p>
                      <div className="rounded-2xl px-5 py-3.5 bg-violet-100 border border-violet-200 text-violet-900 max-w-[85%]">
                        <p className="font-medium text-[15px] leading-relaxed">{currentScenario.followUp.message}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Decision Prompt */}
                <p className="font-bold text-zinc-900 text-lg mb-5">{currentScenario.decisionPrompt}</p>

                {/* Options */}
                {!feedback && (
                  <div className="space-y-3 mb-6">
                    {currentScenario.options.map((option) => (
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        key={option.id}
                        onClick={() => handleAnswer(option.id)}
                        className="w-full text-left p-4 rounded-xl border border-zinc-200 hover:border-zinc-900 hover:bg-zinc-50 transition-all duration-200 group bg-white"
                      >
                        <div className="flex items-center gap-4">
                          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 group-hover:border-zinc-900 group-hover:bg-zinc-900 group-hover:text-white flex items-center justify-center text-[13px] font-bold text-zinc-500 uppercase transition-colors">
                            {option.id}
                          </span>
                          <span className="text-zinc-700 font-medium text-[15px] leading-relaxed">{option.text}</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}

                {/* Hint */}
                <AnimatePresence>
                  {showHint && !feedback && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden mb-6">
                      <div className="flex items-start gap-3 p-5 rounded-2xl border border-amber-200 bg-amber-50">
                        <Lightbulb strokeWidth={2} className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-[15px] font-medium text-amber-800 leading-relaxed">{currentScenario.hint}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Feedback */}
                <AnimatePresence>
                  {feedback && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden mb-6">
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
                            <h3 className={`font-bold text-[15px] mb-1 ${feedback.correct ? 'text-emerald-700' : 'text-red-700'}`}>
                              {feedback.correct ? 'Good choice!' : 'Not the safest option.'}
                            </h3>
                            <p className="text-[15px] font-medium text-zinc-700 leading-relaxed">{feedback.consequence}</p>
                          </div>
                        </div>
                        <div className="pt-4 border-t border-zinc-200/50">
                          <div className="flex items-center gap-2 mb-2">
                            <Shield className="w-4 h-4 text-zinc-500" strokeWidth={1.5} />
                            <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Lesson</p>
                          </div>
                          <p className="text-[15px] font-medium text-zinc-700 leading-relaxed">{feedback.lesson}</p>
                          {feedback.externalLink && (
                            <div className="mt-4">
                              <a 
                                href={feedback.externalLink.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-[13px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full transition-colors"
                              >
                                {feedback.externalLink.text}
                                <ArrowRight strokeWidth={2} className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          )}
                        </div>
                      </div>

                      {feedback.redFlags.length > 0 && (
                        <div className="p-6 mt-4 rounded-2xl border border-zinc-200/80 bg-white shadow-sm">
                          <p className="text-[11px] font-bold text-red-600 uppercase tracking-wider mb-3">Red Flags</p>
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
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Actions */}
                <motion.div layout className="flex items-center justify-between">
                  <div>
                    {!feedback && !showHint && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleHint}
                        className="flex items-center gap-2 px-5 py-3 text-[14px] font-bold text-amber-700 hover:text-amber-800 rounded-full border border-amber-200 hover:bg-amber-50 transition-all duration-200"
                      >
                        <Lightbulb strokeWidth={2} className="w-4 h-4" />
                        Need a Hint?
                      </motion.button>
                    )}
                  </div>
                  <div>
                    {feedback && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleNext}
                        className="group inline-flex items-center gap-2 px-8 py-3.5 text-[15px] font-bold text-white rounded-full bg-zinc-900 hover:bg-zinc-800 shadow-sm transition-all duration-300"
                      >
                        {currentIndex < totalScenarios - 1 ? 'Next Scenario' : 'Finish Room'}
                        <ArrowRight strokeWidth={2} className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </main>
  );
}
