'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { quizQuestions } from '@/features/quiz/quizData';
import api from '@/lib/api';
import { saveLocalQuiz, markLocalQuizSynced } from '@/lib/quizLocal';
import { 
  CheckCircle2, XCircle, ArrowRight, Trophy, 
  Brain, Sparkles, Target
} from 'lucide-react';
import PostInterviewForm from '@/components/evaluation/PostInterviewForm';

const shakeAnimation = {
  x: [-10, 10, -10, 10, -5, 5, 0],
  transition: { duration: 0.4 }
};

interface Answer {
  questionId: number;
  selectedAnswer: number;
  correct: boolean;
}

export default function QuizPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#FAF9F5]"><div className="w-10 h-10 border-2 border-zinc-400 border-t-zinc-900 rounded-full animate-spin" /></div>}>
      <QuizContent />
    </Suspense>
  );
}

function QuizContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const quizType = (searchParams.get('type') as 'pre' | 'post') || 'pre';

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [shake, setShake] = useState(false);
  const [checking, setChecking] = useState(true);

  const currentQuestion = quizQuestions[currentIndex];
  const totalQuestions = quizQuestions.length;

  // Access gate: for signed-in users, validate that this quiz type is allowed
  // (FR-03/FR-11). Guests can take the pre-assessment freely — the site no longer
  // requires login — so we only run the server checks when a session cookie is present.
  useEffect(() => {
    const validate = async () => {
      try {
        const status: any = await api.get('/quiz/status');
        const preCompleted = !!status.data?.preCompleted;
        const postCompleted = !!status.data?.postCompleted;

        if (quizType === 'pre' && preCompleted) {
          // Already have a baseline — no retakes.
          router.replace('/hub');
          return;
        }

        if (quizType === 'post') {
          if (!preCompleted) {
            router.replace('/quiz?type=pre');
            return;
          }
          if (postCompleted) {
            router.replace('/dashboard');
            return;
          }
          // Post-assessment requires all three rooms completed.
          const progressRes: any = await api.get('/progress');
          const progress = progressRes.data?.progress || [];
          const allComplete =
            progress.filter((p: any) => p.status === 'completed').length === 3;
          if (!allComplete) {
            router.replace('/hub');
            return;
          }
        }
      } catch {
        // Not signed in (or validation failed) — let the quiz load. Guests are
        // welcome to take it; the server still enforces one submission per user.
      } finally {
        setChecking(false);
      }
    };
    validate();
  }, [quizType, router]);

  const handleSelectOption = (optionIndex: number) => {
    if (showFeedback) return;
    setSelectedOption(optionIndex);
  };

  const handleConfirmAnswer = () => {
    if (selectedOption === null) return;
    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    const answer: Answer = {
      questionId: currentQuestion.id,
      selectedAnswer: selectedOption,
      correct: isCorrect,
    };
    
    if (!isCorrect) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }

    setAnswers((prev) => [...prev, answer]);
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      setQuizComplete(true);
    }
  };

  const handleSubmitQuiz = () => {
    if (submitting) return;
    setSubmitting(true);

    // Persist locally first so the hub/dashboard always reflect this attempt.
    saveLocalQuiz(quizType, {
      score,
      totalQuestions,
      answers: answers.map((a) => ({ questionId: a.questionId, selectedAnswer: a.selectedAnswer })),
    });

    // Fire and forget server save. Don't block navigation!
    api.post('/quiz', { type: quizType, answers })
      .then(() => markLocalQuizSynced(quizType))
      .catch(() => {});

    // Navigate immediately so it feels instant
    router.push(quizType === 'pre' ? '/hub' : '/dashboard');
  };

  const score = answers.filter((a) => a.correct).length;
  const percentage = Math.round((score / totalQuestions) * 100);

  // While validating access, show a spinner rather than flashing the quiz.
  if (checking) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#FAF9F5]">
        <div className="w-10 h-10 border-2 border-zinc-400 border-t-zinc-900 rounded-full animate-spin" />
      </main>
    );
  }

  // Results screen
  if (quizComplete) {
    return (
      <main className="relative min-h-screen flex items-center justify-center px-6 py-16 bg-[#FAF9F5]">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative w-full max-w-2xl space-y-8 my-8"
        >
          <div className="p-8 sm:p-10 rounded-2xl border border-zinc-200/80 bg-white shadow-sm text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-5 text-emerald-600">
              <Trophy strokeWidth={1.75} className="w-7 h-7" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 mb-2">
              {quizType === 'pre' ? 'Pre-Assessment Complete' : 'Post-Assessment Complete'}
            </h2>

            <p className="text-zinc-500 mb-6 text-[15px]">
              You scored <span className="text-zinc-900 font-bold">{score}</span> out of{' '}
              <span className="font-bold text-zinc-900">{totalQuestions}</span> ({percentage}%)
            </p>

            {/* Score visual */}
            <div className="mb-6">
              <div className="h-3 rounded-full bg-zinc-100 overflow-hidden border border-zinc-200/60">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
                  className="h-full rounded-full bg-emerald-600"
                />
              </div>
            </div>

            <p className="text-zinc-600 text-sm mb-6 leading-relaxed max-w-md mx-auto">
              {quizType === 'pre'
                ? 'This is your baseline diagnostic score. Head into the escape rooms to build your reflexes.'
                : 'Great job! Your post-assessment score is now recorded on your progress dashboard.'}
            </p>

            {quizType === 'pre' && (
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleSubmitQuiz}
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 text-sm font-bold text-white rounded-full bg-zinc-900 hover:bg-zinc-800 shadow-sm transition-all disabled:opacity-50"
              >
                {submitting ? 'Saving baseline...' : 'Continue to Escape Rooms'}
                <ArrowRight strokeWidth={2} className="w-4 h-4" />
              </motion.button>
            )}
          </div>

          {/* Post-Interview Evaluation Questions (Only for Post-Assessment) */}
          {quizType === 'post' && (
            <div className="space-y-6">
              <PostInterviewForm
                title="Post-Experience Evaluation"
                subtitle="Please take a moment to answer these 3 quick questions to help us evaluate the impact of this platform."
              />

              <div className="text-center pt-2">
                <button
                  onClick={handleSubmitQuiz}
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-bold text-white rounded-full bg-zinc-900 hover:bg-zinc-800 shadow-md hover:shadow-lg transition-all"
                >
                  <span>Continue to Dashboard &amp; Certificate</span>
                  <ArrowRight strokeWidth={2} className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center px-6 py-12 bg-[#FAF9F5]">
      <motion.div animate={shake ? shakeAnimation : {}} className="relative w-full max-w-2xl">
        {/* Header */}
        <motion.div layout className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Brain strokeWidth={1.5} className="w-8 h-8 text-zinc-900" />
            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
              {quizType === 'pre' ? 'Pre-Assessment' : 'Post-Assessment'}
            </h1>
          </div>
          
          <div className="h-1.5 rounded-full bg-zinc-100 overflow-hidden mt-6">
            <motion.div
              initial={false}
              animate={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
              transition={{ duration: 0.4, type: 'spring', stiffness: 100, damping: 20 }}
              className="h-full rounded-full bg-zinc-900"
            />
          </div>
        </motion.div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, type: 'spring', stiffness: 100, damping: 20 }}
          >
            <motion.div layout className="p-8 rounded-2xl bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-zinc-200">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-4 h-4 text-zinc-400" strokeWidth={1.5} />
                <span className="text-[13px] font-bold text-zinc-500 uppercase tracking-wider">
                  {currentQuestion.topic.replace('-', ' ')}
                </span>
              </div>

              <h2 className="text-xl font-bold text-zinc-900 mb-6 leading-relaxed">
                {currentQuestion.question}
              </h2>

              <div className="space-y-3 mb-6">
                {currentQuestion.options.map((option, index) => {
                  let styles = 'border-zinc-200 hover:border-zinc-400';
                  let iconEl = null;

                  if (showFeedback) {
                    if (index === currentQuestion.correctAnswer) {
                      styles = 'border-emerald-300 bg-emerald-50';
                      iconEl = <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><CheckCircle2 strokeWidth={2} className="w-5 h-5 text-emerald-600" /></motion.div>;
                    } else if (index === selectedOption && index !== currentQuestion.correctAnswer) {
                      styles = 'border-red-300 bg-red-50';
                      iconEl = <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><XCircle strokeWidth={2} className="w-5 h-5 text-red-500" /></motion.div>;
                    } else {
                      styles = 'border-zinc-100 opacity-40';
                    }
                  } else if (selectedOption === index) {
                    styles = 'border-zinc-900 bg-zinc-50 ring-1 ring-zinc-900';
                  }

                  return (
                    <motion.button
                      whileHover={!showFeedback ? { scale: 1.01 } : {}}
                      whileTap={!showFeedback ? { scale: 0.99 } : {}}
                      key={index}
                      onClick={() => handleSelectOption(index)}
                      disabled={showFeedback}
                      className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center justify-between ${styles}`}
                    >
                      <span className="text-zinc-700 font-medium text-[15px] leading-relaxed pr-4">{option}</span>
                      {iconEl}
                    </motion.button>
                  );
                })}
              </div>

              <AnimatePresence>
                {showFeedback && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
                    className="overflow-hidden"
                  >
                    <div className={`p-5 rounded-2xl border ${
                      answers[answers.length - 1]?.correct
                        ? 'bg-emerald-50 border-emerald-200'
                        : 'bg-amber-50 border-amber-200'
                    }`}>
                      <div className="flex items-start gap-3">
                        {answers[answers.length - 1]?.correct ? (
                          <Sparkles strokeWidth={1.5} className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <Brain strokeWidth={1.5} className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className="font-bold text-zinc-900 text-[15px] mb-1">
                            {answers[answers.length - 1]?.correct ? 'Excellent!' : 'Not quite right.'}
                          </p>
                          <p className="text-zinc-600 text-[15px] leading-relaxed">{currentQuestion.explanation}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div layout className="flex justify-end mt-6">
                {!showFeedback ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleConfirmAnswer}
                    disabled={selectedOption === null}
                    className="inline-flex items-center gap-2 px-6 py-3.5 text-[15px] font-bold text-white rounded-full bg-zinc-900 hover:bg-zinc-800 shadow-sm transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Confirm Answer
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleNext}
                    className="group inline-flex items-center gap-2 px-6 py-3.5 text-[15px] font-bold text-white rounded-full bg-zinc-900 hover:bg-zinc-800 shadow-sm transition-all duration-300"
                  >
                    {currentIndex < totalQuestions - 1 ? 'Next Question' : 'See Results'}
                    <ArrowRight strokeWidth={2} className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </main>
  );
}
