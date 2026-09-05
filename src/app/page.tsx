'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import BackgroundFader from "@/components/ui/BackgroundFader";
import { useAuth } from '@/features/auth/AuthContext';
import {
  Mail, Lock, Users, ArrowRight, CheckCircle2,
  Shield, AlertTriangle, Trophy, Star, Sparkles,
  Award, Eye, KeyRound, MessageSquare, ArrowUpRight,
  Check, X, Clock, HelpCircle, BarChart3
} from 'lucide-react';

/* ─── Hero Interactive Product Simulation Preview ─────────────────────── */

function InteractiveRoomPreview() {
  const [activeTab, setActiveTab] = useState<'phishing' | 'password' | 'social'>('phishing');
  const [passwordInput, setPasswordInput] = useState('Summer2024!');
  const [phishingDecided, setPhishingDecided] = useState<'phishing' | 'safe' | null>(null);

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 rounded-2xl border border-zinc-200/80 bg-white shadow-xl shadow-zinc-900/5 overflow-hidden text-left">
      
      {/* Simulation Window Chrome */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-zinc-100 bg-zinc-50/70">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-zinc-200" />
            <span className="w-3 h-3 rounded-full bg-zinc-200" />
            <span className="w-3 h-3 rounded-full bg-zinc-200" />
          </div>
          <span className="ml-3 text-xs font-semibold text-zinc-500 font-mono">
            Interactive Room Sandbox Preview
          </span>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-lg bg-zinc-200/60 p-1">
          <button
            onClick={() => setActiveTab('phishing')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'phishing'
                ? 'bg-white text-zinc-900 shadow-sm'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Phishing Lab</span>
          </button>

          <button
            onClick={() => setActiveTab('password')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'password'
                ? 'bg-white text-zinc-900 shadow-sm'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Password Vault</span>
          </button>

          <button
            onClick={() => setActiveTab('social')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'social'
                ? 'bg-white text-zinc-900 shadow-sm'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Social Engineering</span>
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      <div className="p-6 md:p-8 min-h-[300px] flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {activeTab === 'phishing' && (
            <motion.div
              key="phishing"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200/60 pb-2.5 text-xs">
                  <div>
                    <span className="font-semibold text-zinc-900">From: </span>
                    <span className="text-zinc-600 font-mono bg-zinc-200/60 px-1.5 py-0.5 rounded">
                      security-update@bank-ireland-auth.com
                    </span>
                  </div>
                  <span className="text-zinc-400">Today, 09:42 AM</span>
                </div>

                <p className="text-sm font-bold text-zinc-900">
                  Action Required: Your online access has been temporarily locked
                </p>

                <p className="text-xs text-zinc-600 leading-relaxed">
                  We noticed suspicious login attempts from an unrecognized device in London, UK. To prevent unauthorized transactions, verify your identity within 24 hours:
                </p>

                <div className="pt-1">
                  <span className="inline-block px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded hover:underline cursor-pointer">
                    https://verify-banking-portal-secure.net/login
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <span className="text-xs text-zinc-500">Can you spot if this message is legitimate or a scam?</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPhishingDecided('safe')}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                      phishingDecided === 'safe'
                        ? 'bg-rose-50 border-rose-300 text-rose-700'
                        : 'border-zinc-200 hover:bg-zinc-50 text-zinc-700'
                    }`}
                  >
                    Legitimate
                  </button>
                  <button
                    onClick={() => setPhishingDecided('phishing')}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                      phishingDecided === 'phishing'
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-zinc-200 hover:bg-zinc-50 text-zinc-700'
                    }`}
                  >
                    Phishing Scam
                  </button>
                </div>
              </div>

              {phishingDecided && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className={`p-3 rounded-lg text-xs leading-relaxed ${
                    phishingDecided === 'phishing'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  <p className="font-semibold">
                    {phishingDecided === 'phishing' ? '✓ Correct! Red flags detected:' : '✗ Careful! This is a phishing attack:'}
                  </p>
                  <ul className="list-disc list-inside mt-1 space-y-0.5 text-[11px]">
                    <li>Spoofed domain (<code className="font-mono">bank-ireland-auth.com</code> is not the official domain).</li>
                    <li>Artificial urgency (&quot;within 24 hours&quot; creates panic).</li>
                    <li>Link destination (<code className="font-mono">verify-banking-portal-secure.net</code>) directs to a credential harvester.</li>
                  </ul>
                </motion.div>
              )}
            </motion.div>
          )}

          {activeTab === 'password' && (
            <motion.div
              key="password"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  Test Password Entropy &amp; Estimated Crack Time:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Type a sample password..."
                    className="flex-1 px-3 py-2 text-sm border border-zinc-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  />
                  <button
                    onClick={() => setPasswordInput('C0rr3ct-H0rs3-B@tt3ry!')}
                    className="px-3 py-2 text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 rounded-lg text-zinc-700 transition-colors"
                  >
                    Try Passphrase
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-center font-mono">
                <div className="p-3 bg-zinc-50 border border-zinc-200/60 rounded-xl">
                  <span className="block text-[11px] text-zinc-500 font-sans">Length &amp; Character Set</span>
                  <span className="text-sm font-bold text-zinc-900 mt-0.5 block">{passwordInput.length} chars</span>
                </div>
                <div className="p-3 bg-zinc-50 border border-zinc-200/60 rounded-xl">
                  <span className="block text-[11px] text-zinc-500 font-sans">Estimated Brute Force</span>
                  <span className={`text-sm font-bold mt-0.5 block ${
                    passwordInput.length > 14 ? 'text-emerald-600' : passwordInput.length > 9 ? 'text-amber-600' : 'text-rose-600'
                  }`}>
                    {passwordInput.length > 14 ? '20,000+ Years' : passwordInput.length > 9 ? '3 Weeks' : 'Instant (seconds)'}
                  </span>
                </div>
                <div className="p-3 bg-zinc-50 border border-zinc-200/60 rounded-xl">
                  <span className="block text-[11px] text-zinc-500 font-sans">Entropy Rating</span>
                  <span className={`text-sm font-bold mt-0.5 block ${
                    passwordInput.length > 14 ? 'text-emerald-600' : passwordInput.length > 9 ? 'text-amber-600' : 'text-rose-600'
                  }`}>
                    {passwordInput.length > 14 ? 'High (84 bits)' : passwordInput.length > 9 ? 'Medium (48 bits)' : 'Critical (22 bits)'}
                  </span>
                </div>
              </div>

              <p className="text-xs text-zinc-500 leading-relaxed pt-1">
                💡 In the Password Security Room, you learn how length beats complexity and why password managers protect you from credential stuffing.
              </p>
            </motion.div>
          )}

          {activeTab === 'social' && (
            <motion.div
              key="social"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-600 border-b border-zinc-200/60 pb-2">
                  <span>📱 Incoming SMS Message</span>
                  <span className="text-rose-600 font-medium">Unverified Sender</span>
                </div>
                <div className="p-3 rounded-lg bg-white border border-zinc-200 text-xs text-zinc-800 leading-relaxed">
                  <p className="font-semibold text-zinc-900 mb-1">An Post Delivery Notice:</p>
                  &quot;Your package #IE-89211 is on hold due to unpaid customs fee (€1.85). Pay within 2 hours to avoid return: http://an-post-customs-clear.info/pay&quot;
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200/60 rounded-lg text-xs text-amber-900 leading-relaxed flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p>
                  <strong>Pretexting Trap:</strong> Attackers use small financial amounts (€1.85) to make the request feel plausible and bypass suspicion. In the Social Engineering room, you learn the verification protocol to shut these down.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}

/* ─── Main Landing Page ─────────────────────────────────────────────────── */


export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace('/hub');
    }
  }, [user, loading, router]);

  const startHref = user ? '/hub' : '/register';

  if (loading || user) {
    return <div className="min-h-screen bg-[#FAF9F5]" />;
  }

  const rooms = [
    {
      id: 'phishing',
      icon: Mail,
      title: 'Phishing Detection Lab',
      tagline: '8 Interactive Inbox Challenges',
      description: 'Step into a simulated inbox. Inspect suspicious sender addresses, analyze lookalike domains, and identify deceptive phishing markers before credentials leak.',
      skills: ['Header analysis', 'Spoofed domain detection', 'Safe link previewing'],
      time: '10 Mins',
      xp: '80 XP',
      href: '/rooms/phishing',
      color: 'bg-rose-50 text-rose-700 border-rose-200/80',
      badge: 'Room 01',
    },
    {
      id: 'passwords',
      icon: Lock,
      title: 'Password Security Fortress',
      tagline: '4 Cryptographic Challenges',
      description: 'Discover how brute-force attacks crack common passwords in seconds. Learn the mathematics of entropy, passphrase construction, and two-factor authentication.',
      skills: ['Entropy calculation', 'Passphrase generation', 'MFA configuration'],
      time: '8 Mins',
      xp: '40 XP',
      href: '/rooms/passwords',
      color: 'bg-blue-50 text-blue-700 border-blue-200/80',
      badge: 'Room 02',
    },
    {
      id: 'social-engineering',
      icon: Users,
      title: 'Social Engineering Defense',
      tagline: '5 Realistic Scenarios',
      description: 'Face high-pressure psychological manipulation. Learn how attackers exploit urgency, authority, and curiosity through simulated phone calls and urgent text messages.',
      skills: ['Vishing identification', 'SMS smishing traps', 'Verification protocols'],
      time: '12 Mins',
      xp: '50 XP',
      href: '/rooms/social-engineering',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
      badge: 'Room 03',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Take the Baseline Pre-Quiz',
      desc: 'Answer 5 diagnostic questions to measure your starting cybersecurity knowledge and identify blindspots.',
    },
    {
      number: '02',
      title: 'Enter the 3 Escape Rooms',
      desc: 'Work through interactive sandbox challenges at your own pace with built-in hints and practical guidance.',
    },
    {
      number: '03',
      title: 'Earn XP & Level Up',
      desc: 'Unlock badges, track your daily cyber streak, and climb the friendly Irish security leaderboard.',
    },
    {
      number: '04',
      title: 'Measure Growth & Certify',
      desc: 'Complete the post-assessment to quantify your score improvement and download your verified completion certificate.',
    },
  ];

  return (
    <div className="bg-[#FAF9F5] text-zinc-900 selection:bg-zinc-900 selection:text-white">
      
      {/* ─── 01 · Hero Section ────────────────────────────────────────── */}
      <section className="relative pt-16 pb-24 px-6 md:px-12">
        <BackgroundFader overlayClassName="bg-gradient-to-b from-zinc-950/20 via-zinc-950/40 to-[#FAF9F5]" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          
          {/* Green Brand Mascot */}
          <div className="w-56 h-56 rounded-[3rem] bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center mx-auto mb-10 shadow-2xl">
            <img src="/images/mascot-owl.jpg" alt="CyberEscape Mascot" className="w-52 h-52 object-cover rounded-full shadow-lg" />
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-zinc-700/80 shadow-sm text-xs font-semibold text-zinc-300 mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            <span>Interactive Cyber Escape Rooms • Ireland</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.05] max-w-4xl mx-auto mb-6 drop-shadow-sm">
            Outsmart scammers before they reach your inbox.
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-zinc-300 leading-relaxed max-w-2xl mx-auto mb-10 drop-shadow">
            Interactive, game-like escape rooms designed to build your cybersecurity instincts in 30 minutes. 100% free and zero technical experience required.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={startHref}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 text-[15px] font-semibold text-zinc-900 bg-white hover:bg-zinc-100 rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              <span>Start Free Assessment</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="#rooms"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 text-[15px] font-medium text-white bg-black/40 hover:bg-black/60 border border-zinc-700 rounded-full transition-all backdrop-blur-md"
            >
              <span>Explore Escape Rooms</span>
              <ArrowRight className="w-4 h-4 text-zinc-400" />
            </a>
          </div>

          {/* Interactive Simulation Preview Box */}
          <InteractiveRoomPreview />

        </div>
      </section>

      {/* ─── Highlights / Value Props Bar ─────────────────────────────── */}
      <section className="border-y border-zinc-200/80 bg-white py-8 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="border-r-0 md:border-r border-zinc-100 pr-4">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
              <Shield className="w-4 h-4 text-zinc-900" />
              <span className="text-sm font-bold text-zinc-900">3 Escape Rooms</span>
            </div>
            <p className="text-xs text-zinc-500">Phishing, passwords, and social engineering.</p>
          </div>

          <div className="border-r-0 md:border-r border-zinc-100 pr-4">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
              <Clock className="w-4 h-4 text-zinc-900" />
              <span className="text-sm font-bold text-zinc-900">~30 Mins Total</span>
            </div>
            <p className="text-xs text-zinc-500">Bite-sized scenarios at your own pace.</p>
          </div>

          <div className="border-r-0 md:border-r border-zinc-100 pr-4">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
              <BarChart3 className="w-4 h-4 text-zinc-900" />
              <span className="text-sm font-bold text-zinc-900">Measurable Growth</span>
            </div>
            <p className="text-xs text-zinc-500">Track score improvements before &amp; after.</p>
          </div>

          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
              <Award className="w-4 h-4 text-zinc-900" />
              <span className="text-sm font-bold text-zinc-900">Verified Certificate</span>
            </div>
            <p className="text-xs text-zinc-500">Earn an official completion credential.</p>
          </div>
        </div>
      </section>

      {/* ─── 02 · The 3 Escape Rooms Showcase ─────────────────────────── */}
      <section id="rooms" className="py-24 px-6 md:px-12 max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-3 py-1 rounded-full">
            Core Curriculum
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-900 tracking-tight mt-4 mb-3">
            Three Realistic Escape Rooms
          </h2>
          <p className="text-zinc-600 text-base leading-relaxed">
            Each room puts you in the driver&apos;s seat of a real-world scenario with practical clues and instant feedback.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {rooms.map((room) => {
            const Icon = room.icon;
            return (
              <div
                key={room.id}
                className="group flex flex-col justify-between p-7 rounded-2xl bg-white border border-zinc-200/80 shadow-sm hover:shadow-md hover:border-zinc-300 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-900">
                      <Icon className="w-6 h-6" strokeWidth={1.75} />
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-700">
                      {room.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-zinc-900 mb-1">
                    {room.title}
                  </h3>
                  <p className="text-xs font-semibold text-zinc-500 mb-4">
                    {room.tagline}
                  </p>

                  <p className="text-sm text-zinc-600 leading-relaxed mb-6">
                    {room.description}
                  </p>

                  {/* Skills Learned */}
                  <div className="space-y-2 mb-6 pt-4 border-t border-zinc-100">
                    <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Skills covered:</span>
                    <ul className="space-y-1.5 text-xs text-zinc-700">
                      {room.skills.map((skill, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                          <span>{skill}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
                  <div className="flex items-center gap-3">
                    <span>⏱ {room.time}</span>
                    <span>⭐ {room.xp}</span>
                  </div>
                  <Link
                    href={startHref}
                    className="font-semibold text-zinc-900 hover:text-blue-600 inline-flex items-center gap-1 transition-colors"
                  >
                    <span>Enter Room</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── 03 · How It Works ────────────────────────────────────────── */}
      <section className="py-24 px-6 md:px-12 bg-white border-t border-zinc-200/80">
        <div className="max-w-5xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              The Learning Protocol
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-900 tracking-tight mt-3 mb-3">
              How CyberEscape Works
            </h2>
            <p className="text-zinc-600 text-base leading-relaxed">
              Designed as a measurable learning experiment. We measure your starting instincts and prove your growth.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, idx) => (
              <div key={idx} className="p-6 rounded-xl bg-[#FAF9F5] border border-zinc-200/60">
                <span className="font-mono text-xs font-bold text-zinc-400 block mb-3">
                  STAGE {s.number}
                </span>
                <h3 className="text-base font-bold text-zinc-900 mb-2">
                  {s.title}
                </h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─── 04 · Threat Reality in Ireland ───────────────────────────── */}
      <section className="py-24 px-6 md:px-12 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 border border-rose-200/60 px-3 py-1 rounded-full">
              Ireland Threat Data
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-900 tracking-tight leading-tight">
              Why Cyber Hygiene Is Essential in Ireland Today.
            </h2>
            <p className="text-sm text-zinc-600 leading-relaxed">
              Cyber criminals increasingly target individuals and small teams because technological firewalls are strong, but human instincts can be tricked by urgency and deception.
            </p>
            <p className="text-sm text-zinc-600 leading-relaxed">
              Spending 30 minutes in an escape room builds the mental muscle memory you need to pause, verify, and stay safe.
            </p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-sm">
              <span className="block text-3xl font-extrabold text-zinc-900 mb-1">€160 Million</span>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Lost to payment fraud and online scams in Ireland in 2024 (source: BPFI report).
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-sm">
              <span className="block text-3xl font-extrabold text-zinc-900 mb-1">3.4 Billion</span>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Malicious phishing emails deployed globally every single day.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-sm">
              <span className="block text-3xl font-extrabold text-zinc-900 mb-1">90%+</span>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Of all security breaches originate from social engineering and human manipulation.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-sm">
              <span className="block text-3xl font-extrabold text-emerald-600 mb-1">30 Minutes</span>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Average time to complete all 3 rooms and build lasting security reflexes.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ─── 05 · Final Call to Action ────────────────────────────────── */}
      <section className="py-24 px-6 md:px-12 bg-zinc-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-zinc-950/50 z-0" />
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          
          <div className="w-40 h-40 rounded-[2rem] bg-white/5 backdrop-blur-sm border border-emerald-500/20 flex items-center justify-center mx-auto mb-6 shadow-xl">
            <img src="/images/mascot-owl.jpg" alt="CyberEscape Mascot" className="w-36 h-36 object-cover rounded-full shadow-lg" />
          </div>

          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-3 py-1 rounded-full">
            Ready to Begin
          </span>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-2xl mx-auto leading-tight">
            Test your cybersecurity instincts in the escape room.
          </h2>

          <p className="text-sm sm:text-base text-zinc-400 max-w-lg mx-auto leading-relaxed">
            Free forever. No software to download. Start with a quick diagnostic assessment and enter your first room immediately.
          </p>

          <div className="pt-4">
            <Link
              href={startHref}
              className="inline-flex items-center gap-2.5 px-8 py-4 text-sm font-semibold text-zinc-900 bg-white hover:bg-zinc-100 rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              <span>Get Started Now — It&apos;s Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <p className="text-xs text-zinc-500 pt-4">
            Aligned with Irish National Cyber Security Educational Guidelines
          </p>
        </div>
      </section>

    </div>
  );
}
