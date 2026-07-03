'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ProtectedRoute from '@/features/auth/ProtectedRoute';
import { 
  CheckCircle2, ArrowRight, Shield, Mail, Lock, 
  Users, Lightbulb
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

interface RoomDebrief {
  title: string;
  icon: any;
  color: string;
  gradient: string;
  shadow: string;
  keyTakeaways: string[];
  actionItems: string[];
  nextRoom: { id: string; name: string; href: string } | null;
}

const debriefData: Record<string, RoomDebrief> = {
  phishing: {
    title: 'Phishing Detection',
    icon: Mail,
    color: 'text-rose-600',
    gradient: 'from-rose-500 to-orange-400',
    shadow: 'shadow-rose-200/50',
    keyTakeaways: [
      'Always check the sender email address carefully. Scammers often use addresses that look similar to real ones but have small differences.',
      'Hover over links before clicking them. The URL shown and the actual destination can be completely different.',
      'Legitimate organisations will never ask for passwords, PINs, or full bank details via email.',
      'Urgency and threats are manipulation tactics. Real companies give you time to respond.',
    ],
    actionItems: [
      'Check the sender address on the next 5 emails you receive',
      'Enable two-factor authentication on your email account',
      'Report any suspicious emails to your email provider',
      'Tell a friend or family member about one red flag you learned today',
    ],
    nextRoom: { id: 'passwords', name: 'Password Security', href: '/rooms/passwords' },
  },
  passwords: {
    title: 'Password Security',
    icon: Lock,
    color: 'text-zinc-700',
    gradient: 'from-zinc-700 to-zinc-500',
    shadow: 'shadow-zinc-300/50',
    keyTakeaways: [
      'Longer passwords are stronger passwords. A passphrase of 4 random words is harder to crack than a short complex password.',
      'Never reuse passwords across different accounts. If one site is breached, all your accounts become vulnerable.',
      'Password managers generate and store unique passwords for every site. You only need to remember one master password.',
      'Two-factor authentication adds a second layer of protection even if your password is compromised.',
    ],
    actionItems: [
      'Install a free password manager like Bitwarden',
      'Change any passwords you currently reuse across multiple sites',
      'Enable two-factor authentication on your most important accounts (email, banking)',
      'Create a strong master password using a memorable passphrase',
    ],
    nextRoom: { id: 'social-engineering', name: 'Social Engineering', href: '/rooms/social-engineering' },
  },
  'social-engineering': {
    title: 'Social Engineering',
    icon: Users,
    color: 'text-emerald-700',
    gradient: 'from-emerald-500 to-teal-400',
    shadow: 'shadow-emerald-200/50',
    keyTakeaways: [
      'Scammers create urgency to prevent you from thinking clearly. Take a breath and pause before acting.',
      'No legitimate organisation will ever ask you to transfer money to a "safe account" or buy gift cards as payment.',
      'It is always acceptable to hang up, verify independently, and call back on an official number.',
      'Social engineers exploit trust, authority, and fear. Being aware of these tactics is your best defence.',
    ],
    actionItems: [
      'If you receive an unexpected call about money, hang up and call the organisation directly',
      'Discuss common scam tactics with family members, especially those who live alone',
      'Save official phone numbers for your bank and utility companies',
      'Remember: it is never rude to verify someone\'s identity before giving information',
    ],
    nextRoom: null,
  },
};

export default function DebriefPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]"><div className="w-10 h-10 border-2 border-zinc-400 border-t-zinc-900 rounded-full animate-spin" /></div>}>
      <ProtectedRoute>
        <DebriefContent />
      </ProtectedRoute>
    </Suspense>
  );
}

function DebriefContent() {
  const searchParams = useSearchParams();
  const room = searchParams.get('room') || 'phishing';
  const data = debriefData[room] || debriefData.phishing;
  const Icon = data.icon;

  return (
    <main className="relative overflow-hidden min-h-screen bg-[#FAF9F6]">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-zinc-200/30 rounded-full blur-[120px]" />
      </div>

      <section className="relative px-6 pt-28 pb-20">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            {/* Success Header */}
            <motion.div variants={fadeUp} custom={0} className="text-center mb-12">
              <div className={`w-20 h-20 rounded-xl bg-gradient-to-br ${data.gradient} flex items-center justify-center mx-auto mb-6 shadow-sm ${data.shadow}`}>
                <CheckCircle2 strokeWidth={1.5} className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-3">
                Room Complete!
              </h1>
              <p className="text-zinc-500 text-lg">
                You have finished the <span className={`font-semibold ${data.color}`}>{data.title}</span> room.
              </p>
            </motion.div>

            {/* Key Takeaways */}
            <motion.div variants={fadeUp} custom={1} className="mb-10">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center">
                  <Lightbulb strokeWidth={1.5} className="w-4 h-4 text-amber-600" />
                </div>
                <h2 className="text-xl font-semibold text-zinc-900">
                  Key Takeaways
                </h2>
              </div>

              <div className="space-y-3">
                {data.keyTakeaways.map((takeaway, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="flex items-start gap-4 p-4 rounded-xl border border-zinc-200/80 bg-white shadow-sm"
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mt-0.5">
                      <span className="text-xs font-bold text-amber-700">{i + 1}</span>
                    </div>
                    <p className="text-sm text-zinc-600 leading-relaxed">{takeaway}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Action Items */}
            <motion.div variants={fadeUp} custom={2} className="mb-12">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                  <Shield strokeWidth={1.5} className="w-4 h-4 text-emerald-600" />
                </div>
                <h2 className="text-xl font-semibold text-zinc-900">
                  What You Can Do Today
                </h2>
              </div>

              <div className="space-y-3">
                {data.actionItems.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    className="flex items-start gap-3 p-4 rounded-xl border border-emerald-200 bg-emerald-50"
                  >
                    <CheckCircle2 strokeWidth={1.5} className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-zinc-700">{item}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Navigation */}
            <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {data.nextRoom ? (
                <Link
                  href={data.nextRoom.href}
                  className="group inline-flex items-center gap-3 px-6 py-3.5 text-sm font-semibold text-white rounded-xl bg-zinc-900 hover:bg-zinc-800 shadow-sm transition-all duration-300"
                >
                  Next Room: {data.nextRoom.name}
                  <ArrowRight strokeWidth={1.5} className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <Link
                  href="/quiz?type=post"
                  className="group inline-flex items-center gap-3 px-6 py-3.5 text-sm font-semibold text-white rounded-xl bg-zinc-900 hover:bg-zinc-800 shadow-sm transition-all duration-300"
                >
                  Take Post-Assessment
                  <ArrowRight strokeWidth={1.5} className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
              <Link
                href="/hub"
                className="inline-flex items-center gap-2 px-5 py-3 text-sm text-zinc-600 hover:text-zinc-900 rounded-xl border border-zinc-200 hover:border-zinc-300 hover:bg-white transition-all duration-300"
              >
                Back to Room Hub
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
