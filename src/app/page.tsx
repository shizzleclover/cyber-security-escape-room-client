'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/features/auth/AuthContext';
import { 
  Shield, Mail, Lock, Users, ArrowRight, 
  CheckCircle2, Clock, Zap, Eye, Brain, 
  Fingerprint, AlertTriangle, BookOpen, Target, Sparkles
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

export default function LandingPage() {
  const { user } = useAuth();

  const rooms = [
    {
      icon: Mail,
      title: 'Phishing Detection',
      description: 'Inspect suspicious emails, identify red flags, and learn to spot scams before they catch you.',
      accent: 'text-rose-600',
      bg: 'bg-rose-50',
      border: 'border-rose-100 hover:border-rose-300',
      challenges: 8,
      time: '10 min',
    },
    {
      icon: Lock,
      title: 'Password Security',
      description: 'Build unbreakable passwords, understand what makes them strong, and discover password managers.',
      accent: 'text-violet-600',
      bg: 'bg-violet-50',
      border: 'border-violet-100 hover:border-violet-300',
      challenges: 4,
      time: '8 min',
    },
    {
      icon: Users,
      title: 'Social Engineering',
      description: 'Face real-world manipulation tactics and learn to recognise when someone is trying to trick you.',
      accent: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100 hover:border-emerald-300',
      challenges: 5,
      time: '12 min',
    },
  ];

  const steps = [
    { icon: Target, title: 'Take a Quick Assessment', desc: 'A short quiz measures your current knowledge so we can track your improvement.' },
    { icon: Brain, title: 'Explore Interactive Rooms', desc: 'Work through realistic scenarios at your own pace. No time pressure, hints available.' },
    { icon: Sparkles, title: 'See Your Growth', desc: 'Compare your before and after scores. Walk away with practical skills you can use today.' },
  ];

  const stats = [
    { value: '3.4B+', label: 'Phishing emails sent daily worldwide', icon: AlertTriangle },
    { value: '£1.2B', label: 'Lost to fraud by UK adults over 60 in 2024', icon: Fingerprint },
    { value: '30 min', label: 'Is all it takes to learn the essentials', icon: Clock },
  ];

  return (
    <main className="relative min-h-screen bg-[#F7F7F8] overflow-hidden selection:bg-zinc-900 selection:text-white">
      


      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-6 pt-32 pb-20">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="space-y-10"
          >
            {/* Badge */}
            <motion.div variants={fadeUp} custom={0} className="flex justify-center">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-zinc-200/80 bg-white/50 backdrop-blur-md shadow-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-[13px] font-bold text-zinc-600 tracking-wide uppercase">Free interactive learning platform</span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              custom={1}
              className="text-6xl md:text-8xl font-extrabold tracking-tight leading-[1.05] text-zinc-900"
            >
              Learn to Stay
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-900">
                Safe Online.
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-lg md:text-xl font-medium text-zinc-500 max-w-2xl mx-auto leading-relaxed"
            >
              An interactive escape room that teaches you to recognise phishing, build strong passwords, 
              and spot scams. No technical experience needed.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              {user ? (
                <Link
                  href="/hub"
                  className="group flex items-center justify-center gap-3 px-8 py-4 w-full sm:w-auto text-[15px] font-bold text-white rounded-full bg-zinc-900 hover:bg-zinc-800 shadow-sm transition-all duration-300"
                >
                  Continue to Rooms
                  <ArrowRight strokeWidth={2} className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/register"
                    className="group flex items-center justify-center gap-3 px-8 py-4 w-full sm:w-auto text-[15px] font-bold text-white rounded-full bg-zinc-900 hover:bg-zinc-800 shadow-sm transition-all duration-300"
                  >
                    Start Your Escape
                    <ArrowRight strokeWidth={2} className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="/about"
                    className="flex items-center justify-center gap-2 px-8 py-4 w-full sm:w-auto text-[15px] font-bold text-zinc-700 hover:text-zinc-900 rounded-full border border-zinc-200 hover:border-zinc-300 hover:bg-white transition-all duration-300"
                  >
                    <BookOpen strokeWidth={2} className="w-4 h-4" />
                    Learn More
                  </Link>
                </>
              )}
            </motion.div>

            {/* Trust indicators */}
            <motion.div variants={fadeUp} custom={4} className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 pt-8 text-[13px] font-bold text-zinc-400 uppercase tracking-wider">
              <span className="flex items-center gap-2"><CheckCircle2 strokeWidth={2} className="w-4 h-4 text-emerald-500" /> No cost</span>
              <span className="flex items-center gap-2"><Clock strokeWidth={2} className="w-4 h-4 text-zinc-400" /> ~30 minutes</span>
              <span className="flex items-center gap-2"><Zap strokeWidth={2} className="w-4 h-4 text-amber-500" /> No tech skills</span>
              <span className="flex items-center gap-2"><Eye strokeWidth={2} className="w-4 h-4 text-zinc-400" /> Accessible</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-24 px-6 border-y border-zinc-200/60 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i}
                className="text-center p-8 rounded-3xl bg-white shadow-[0_2px_20px_rgba(0,0,0,0.02)] border border-zinc-100"
              >
                <div className="w-12 h-12 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center mx-auto mb-6">
                  <stat.icon strokeWidth={1.5} className="w-5 h-5 text-zinc-400" />
                </div>
                <div className="text-4xl md:text-5xl font-extrabold text-zinc-900 tracking-tight mb-3">
                  {stat.value}
                </div>
                <p className="text-[15px] font-medium text-zinc-500 leading-relaxed max-w-[200px] mx-auto">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Rooms Section */}
      <section className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={stagger}
            className="text-center mb-20"
          >
            <motion.p variants={fadeUp} custom={0} className="text-[13px] font-bold text-zinc-400 uppercase tracking-wider mb-4">
              Three Interactive Rooms
            </motion.p>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="text-4xl md:text-6xl font-extrabold tracking-tight text-zinc-900"
            >
              Real Threats. <br className="md:hidden" />Safe Environment.
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-lg font-medium text-zinc-500 mt-6 max-w-2xl mx-auto leading-relaxed">
              Each room simulates a different type of cyber threat you might encounter in everyday life.
            </motion.p>
          </motion.div>

          <div className="relative w-full max-w-6xl mx-auto overflow-hidden px-4 md:px-0">
            {/* Fade gradients on edges */}
            <div className="absolute top-0 bottom-0 left-0 w-16 md:w-32 bg-gradient-to-r from-[#F7F7F8] to-transparent z-10 pointer-events-none" />
            <div className="absolute top-0 bottom-0 right-0 w-16 md:w-32 bg-gradient-to-l from-[#F7F7F8] to-transparent z-10 pointer-events-none" />
            
            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{ ease: "linear", duration: 30, repeat: Infinity }}
              className="flex w-max gap-6"
            >
              {[...rooms, ...rooms].map((room, i) => (
                <div
                  key={i}
                  className={`w-[320px] md:w-[380px] flex-shrink-0 group relative p-8 rounded-3xl bg-white border ${room.border} shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-xl hover:-translate-y-1 transition-all duration-400`}
                >
                  <div className={`w-14 h-14 rounded-2xl ${room.bg} border ${room.border} flex items-center justify-center mb-8`}>
                    <room.icon strokeWidth={2} className={`w-6 h-6 ${room.accent}`} />
                  </div>
                  <h3 className="text-2xl font-bold text-zinc-900 mb-4 tracking-tight">
                    {room.title}
                  </h3>
                  <p className="text-zinc-500 font-medium text-[15px] leading-relaxed mb-8">
                    {room.description}
                  </p>
                  <div className="flex items-center gap-5 text-[13px] font-bold uppercase tracking-wider text-zinc-400 pt-6 border-t border-zinc-100">
                    <span className="flex items-center gap-2">
                      <Zap strokeWidth={2} className="w-4 h-4 text-amber-500" /> {room.challenges} tasks
                    </span>
                    <span className="flex items-center gap-2">
                      <Clock strokeWidth={2} className="w-4 h-4 text-emerald-500" /> {room.time}
                    </span>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-32 px-6 bg-white border-t border-zinc-200/60">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={stagger}
            className="text-center mb-20"
          >
            <motion.p variants={fadeUp} custom={0} className="text-[13px] font-bold text-zinc-400 uppercase tracking-wider mb-4">
              Simple Process
            </motion.p>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="text-4xl md:text-6xl font-extrabold tracking-tight text-zinc-900"
            >
              Three Steps to Confidence
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {steps.map((step, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-zinc-900 text-white flex items-center justify-center text-xl font-bold mb-6 shadow-xl shadow-zinc-900/10">
                  {i + 1}
                </div>
                <h3 className="text-xl font-bold text-zinc-900 mb-3 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-zinc-500 font-medium text-[15px] leading-relaxed max-w-sm mx-auto">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
        <div className="relative max-w-3xl mx-auto text-center z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6"
            >
              Ready to Test Your
              <br />
              Cyber Awareness?
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-lg font-medium text-zinc-300 mb-12 max-w-xl mx-auto leading-relaxed">
              It takes about 30 minutes. No technical experience needed. 
              Just you, some simulated scenarios, and a willingness to learn.
            </motion.p>
            <motion.div variants={fadeUp} custom={2}>
              <Link
                href={user ? '/hub' : '/register'}
                className="group inline-flex items-center justify-center gap-3 px-10 py-5 text-[15px] font-bold text-zinc-900 rounded-full bg-white hover:bg-zinc-100 shadow-xl shadow-white/10 transition-all duration-300"
              >
                Begin Your Escape
                <ArrowRight strokeWidth={2} className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
