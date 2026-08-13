'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import { saveLocalScore, saveLocalProgress } from '@/lib/progressLocal';
import { Shield, ArrowRight, CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';

export default function CustomRoomPage() {
  const { roomId } = useParams() as { roomId: string };
  const router = useRouter();

  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<any | null>(null);
  
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response: any = await api.get(`/content/custom-room/${roomId}`);
        const data = response.data?.questions || [];
        if (data.length === 0) {
          throw new Error('No questions in this room.');
        }
        setQuestions(data);
      } catch (err: any) {
        alert(err.message || 'Failed to load room content.');
        router.push('/hub');
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [roomId, router]);

  const handleSubmit = async () => {
    if (!selectedAnswer) return;
    
    const question = questions[currentIndex];
    try {
      const response: any = await api.post(`/content/custom-room/${roomId}/check`, {
        questionId: question.id,
        answerId: selectedAnswer
      });
      
      const { correct, explanation } = response.data;
      setFeedback({ correct, explanation });
      if (correct) {
        setScore(s => s + 1);
      }
    } catch {
      alert('Error submitting answer.');
    }
  };

  const handleNext = async () => {
    setFeedback(null);
    setSelectedAnswer(null);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(c => c + 1);
    } else {
      // Room completed
      const finalScore = score + (feedback?.correct ? 1 : 0);
      
      saveLocalScore(roomId, finalScore, questions.length);
      saveLocalProgress(roomId, 'completed', questions.length);

      try {
        await api.post('/scores', { 
          roomId, 
          score: finalScore, 
          maxScore: questions.length, 
          hintsUsed: 0, 
          timeSpent: 300 
        });
        await api.put(`/progress/${roomId}`, { status: 'completed', currentStep: questions.length });
      } catch {
        // silent fail for guests
      }

      setCompleted(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
      </div>
    );
  }

  if (completed) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Room Completed!</h1>
        <p className="text-zinc-600 mb-8 max-w-md mx-auto">
          You answered {score} out of {questions.length} questions correctly.
        </p>
        <button
          onClick={() => router.push('/hub')}
          className="px-6 py-3 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition-colors"
        >
          Return to Hub
        </button>
      </div>
    );
  }

  const question = questions[currentIndex];

  return (
    <div className="min-h-screen bg-[#FAF9F6] pt-24 pb-12 px-4 selection:bg-zinc-900 selection:text-white">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push('/hub')}
            className="flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Hub
          </button>
          <div className="flex items-center gap-2 text-sm font-bold text-zinc-500">
            <Shield className="w-4 h-4" />
            Question {currentIndex + 1} of {questions.length}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white border border-zinc-200 rounded-3xl p-6 md:p-10 shadow-sm"
          >
            <h2 className="text-xl md:text-2xl font-bold text-zinc-900 mb-8 leading-relaxed">
              {question.question}
            </h2>

            <div className="space-y-3 mb-10">
              {question.options.map((opt: any) => {
                const isSelected = selectedAnswer === opt.id;
                const isCorrect = feedback?.correct && isSelected;
                const isWrong = feedback && !feedback.correct && isSelected;
                
                let btnStyle = 'border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50';
                if (isSelected) btnStyle = 'border-zinc-900 bg-zinc-50 ring-1 ring-zinc-900';
                if (isCorrect) btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-500';
                if (isWrong) btnStyle = 'border-rose-500 bg-rose-50 text-rose-900 ring-1 ring-rose-500';

                return (
                  <button
                    key={opt.id}
                    disabled={feedback !== null}
                    onClick={() => setSelectedAnswer(opt.id)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${btnStyle}`}
                  >
                    <span className="font-medium">{opt.text}</span>
                  </button>
                );
              })}
            </div>

            <AnimatePresence>
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className={`p-6 rounded-2xl mb-8 ${feedback.correct ? 'bg-emerald-50' : 'bg-rose-50'}`}
                >
                  <div className="flex items-start gap-4">
                    {feedback.correct ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                    ) : (
                      <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
                    )}
                    <div>
                      <h3 className={`font-bold mb-1 ${feedback.correct ? 'text-emerald-900' : 'text-rose-900'}`}>
                        {feedback.correct ? 'Correct!' : 'Incorrect'}
                      </h3>
                      {feedback.explanation && (
                        <p className={`text-sm ${feedback.correct ? 'text-emerald-700' : 'text-rose-700'}`}>
                          {feedback.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-end">
              {!feedback ? (
                <button
                  disabled={!selectedAnswer}
                  onClick={handleSubmit}
                  className="px-6 py-3 rounded-xl bg-zinc-900 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-800 transition-colors"
                >
                  Submit Answer
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-900 text-white font-bold hover:bg-zinc-800 transition-colors"
                >
                  {currentIndex < questions.length - 1 ? 'Next Question' : 'Complete Room'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
