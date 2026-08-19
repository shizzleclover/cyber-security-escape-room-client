'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, MessageSquare, Send, Sparkles, Star, ThumbsUp, HelpCircle } from 'lucide-react';
import api from '@/lib/api';

interface PostInterviewFormProps {
  onCompleted?: () => void;
  title?: string;
  subtitle?: string;
  className?: string;
}

const STORAGE_KEY = 'cyberescape:postInterview';

export default function PostInterviewForm({
  onCompleted,
  title = 'Post-Experience Feedback',
  subtitle = 'Please answer these 3 quick questions to help us evaluate the platform.',
  className = '',
}: PostInterviewFormProps) {
  const [q1, setQ1] = useState<string>('');
  const [q2, setQ2] = useState<string>('');
  const [q3, setQ3] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.q1) setQ1(parsed.q1);
        if (parsed.q2) setQ2(parsed.q2);
        if (parsed.q3) setQ3(parsed.q3);
        if (parsed.submitted) setSubmitted(true);
      }
    } catch {
      // Ignore parse error
    }
  }, []);

  const q1Options = [
    'Very easy',
    'Easy',
    'Neutral',
    'Difficult',
    'Very difficult',
  ];

  const q2Options = [
    'Much more confident',
    'Somewhat more confident',
    'About the same',
    'Not confident',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!q1 || !q2) return;

    setSubmitting(true);
    const payload = {
      q1_easeOfUse: q1,
      q2_confidence: q2,
      q3_feedbackAndImprovements: q3,
      submittedAt: new Date().toISOString(),
      submitted: true,
    };

    // Save locally
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Ignore
    }

    // Try backend save if endpoint exists (silent failover)
    try {
      await api.post('/feedback', payload).catch(() => {});
    } catch {
      // Silent
    }

    setSubmitting(false);
    setSubmitted(true);

    if (onCompleted) {
      setTimeout(() => {
        onCompleted();
      }, 1200);
    }
  };

  if (submitted) {
    return (
      <div className={`p-8 rounded-2xl border border-emerald-200 bg-emerald-50/50 text-center ${className}`}>
        <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center mx-auto mb-4 text-emerald-600">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-emerald-950 mb-2">
          Thank you for your feedback!
        </h3>
        <p className="text-sm text-emerald-800 leading-relaxed max-w-md mx-auto">
          Your responses have been recorded and will help evaluate and improve the platform for future learners across Ireland.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-5 text-xs font-semibold text-emerald-700 hover:text-emerald-900 underline underline-offset-2"
        >
          Edit your feedback
        </button>
      </div>
    );
  }

  return (
    <div className={`p-6 sm:p-8 rounded-2xl border border-zinc-200/80 bg-white shadow-sm text-left ${className}`}>
      
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
          <MessageSquare className="w-4 h-4 text-zinc-700" />
          <span>Post-Interview Questions</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
          {title}
        </h3>
        <p className="text-sm text-zinc-500 mt-1">
          {subtitle}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Question 1 */}
        <div className="space-y-3">
          <label className="block text-sm font-bold text-zinc-900 leading-snug">
            1. Was the platform easy to use and understand? <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
            {q1Options.map((opt) => (
              <button
                type="button"
                key={opt}
                onClick={() => setQ1(opt)}
                className={`py-2.5 px-3 text-xs font-semibold rounded-xl border transition-all text-center ${
                  q1 === opt
                    ? 'bg-zinc-900 border-zinc-900 text-white shadow-sm'
                    : 'bg-zinc-50/70 border-zinc-200 hover:bg-zinc-100 text-zinc-700'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Question 2 */}
        <div className="space-y-3">
          <label className="block text-sm font-bold text-zinc-900 leading-snug">
            2. Do you feel more confident identifying and avoiding online scams after using the platform? <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {q2Options.map((opt) => (
              <button
                type="button"
                key={opt}
                onClick={() => setQ2(opt)}
                className={`py-2.5 px-4 text-xs font-semibold rounded-xl border transition-all text-left flex items-center justify-between ${
                  q2 === opt
                    ? 'bg-zinc-900 border-zinc-900 text-white shadow-sm'
                    : 'bg-zinc-50/70 border-zinc-200 hover:bg-zinc-100 text-zinc-700'
                }`}
              >
                <span>{opt}</span>
                {q2 === opt && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </button>
            ))}
          </div>
        </div>

        {/* Question 3 */}
        <div className="space-y-2">
          <label htmlFor="q3-feedback" className="block text-sm font-bold text-zinc-900 leading-snug">
            3. What did you like most, and what improvements would you suggest?
          </label>
          <textarea
            id="q3-feedback"
            rows={4}
            value={q3}
            onChange={(e) => setQ3(e.target.value)}
            placeholder="Share what worked well for you and any suggestions to make the escape rooms even better..."
            className="w-full p-3.5 text-sm rounded-xl border border-zinc-200 bg-zinc-50/50 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2 flex items-center justify-between">
          <span className="text-xs text-zinc-400">
            * Questions 1 &amp; 2 are required
          </span>
          <button
            type="submit"
            disabled={!q1 || !q2 || submitting}
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-zinc-900 hover:bg-zinc-800 rounded-full shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {submitting ? 'Submitting...' : 'Submit Feedback'}
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>

      </form>
    </div>
  );
}
