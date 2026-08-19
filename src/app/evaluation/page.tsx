'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import PostInterviewForm from '@/components/evaluation/PostInterviewForm';

export default function EvaluationPage() {
  return (
    <main className="min-h-screen bg-[#FAF9F5] py-16 px-6 md:px-12 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        <PostInterviewForm
          title="Post-Interview Evaluation"
          subtitle="Research survey questions to assess platform usability, confidence gains, and user experience."
        />
      </div>
    </main>
  );
}
