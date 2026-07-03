'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useAuth } from '@/features/auth/AuthContext';
import {
  Mail, Lock, Users, ArrowRight, ArrowUpRight,
  Flame, Zap, Trophy, Star, Crown, Shield,
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────────────────────
   Theme: ink (#101010) on warm off-white (#FAFAF8), one accent (#58CC02).
   Motion: single easing curve everywhere, masked reveals, scroll-linked
   parallax. Gamified content, editorial presentation.
   ───────────────────────────────────────────────────────────────────────── */

const EASE = [0.22, 1, 0.36, 1] as const;
const ACCENT = '#58CC02';

/* ─── Reveal primitives ─────────────────────────────────────────────────── */

// Word-by-word masked headline reveal
function RevealWords({ text, accentWords = [], className = '', delay = 0 }: {
  text: string;
  accentWords?: string[];
  className?: string;
  delay?: number;
}) {
  const words = text.split(' ');
  return (
    <span className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block will-change-transform"
            style={accentWords.includes(word) ? { color: ACCENT } : undefined}
            initial={{ y: '110%' }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.9, delay: delay + i * 0.045, ease: EASE }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 && <span>&nbsp;</span>}
        </span>
      ))}
    </span>
  );
}

// Fade-rise reveal for blocks
function Reveal({ children, delay = 0, className = '', y = 32 }: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

// Expanding hairline rule
function Rule({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      className="h-px bg-zinc-200 origin-left"
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, amount: 0.8 }}
      transition={{ duration: 1.2, delay, ease: EASE }}
    />
  );
}

// Section micro-label: "01 — Label"
function SectionLabel({ index, label }: { index: string; label: string }) {
  return (
    <Reveal delay={0.05} y={16} className="flex items-center gap-3 mb-10">
      <span className="font-mono text-[13px] font-medium" style={{ color: ACCENT }}>{index}</span>
      <span className="w-8 h-px bg-zinc-300" />
      <span className="text-[12px] font-bold text-zinc-400 uppercase tracking-[0.2em]">{label}</span>
    </Reveal>
  );
}

/* ─── Mascot: shield buddy (theme-matched) ──────────────────────────────── */

function ShieldBuddy({ size = 200 }: { size?: number }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      animate={{ y: [-5, 5, -5] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      aria-hidden="true"
    >
      <path
        d="M100 18 L168 42 V102 C168 146 140 172 100 186 C60 172 32 146 32 102 V42 Z"
        fill={ACCENT} stroke="#46A302" strokeWidth="6" strokeLinejoin="round"
      />
      <path
        d="M100 40 L146 57 V102 C146 134 126 152 100 163 C74 152 54 134 54 102 V57 Z"
        fill="#89E219" opacity="0.45"
      />
      <ellipse cx="78" cy="92" rx="14" ry="17" fill="#FAFAF8" />
      <ellipse cx="122" cy="92" rx="14" ry="17" fill="#FAFAF8" />
      <motion.g
        animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
        transition={{ duration: 4.5, repeat: Infinity, times: [0, 0.45, 0.5, 0.55, 1] }}
        style={{ transformOrigin: '100px 92px' }}
      >
        <circle cx="81" cy="94" r="7" fill="#101010" />
        <circle cx="119" cy="94" r="7" fill="#101010" />
        <circle cx="83.5" cy="91.5" r="2.5" fill="#FAFAF8" />
        <circle cx="121.5" cy="91.5" r="2.5" fill="#FAFAF8" />
      </motion.g>
      <path d="M84 122 Q100 136 116 122" stroke="#101010" strokeWidth="6" strokeLinecap="round" fill="none" />
    </motion.svg>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────────── */

export default function LandingPage() {
  const { user } = useAuth();
  const startHref = user ? '/hub' : '/register';

  // Hero scroll choreography
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroY = useTransform(heroProgress, [0, 1], [0, 120]);
  const heroOpacity = useTransform(heroProgress, [0, 0.75], [1, 0]);
  const mascotY = useTransform(heroProgress, [0, 1], [0, -60]);

  const pathNodes = [
    { icon: Star,   label: 'Pre-assessment', sub: 'Find your baseline',          locked: false },
    { icon: Mail,   label: 'Phishing Detection', sub: '8 emails · 80 XP',        locked: false },
    { icon: Lock,   label: 'Password Security', sub: '4 challenges · 40 XP',     locked: true },
    { icon: Users,  label: 'Social Engineering', sub: '5 scenarios · 50 XP',     locked: true },
    { icon: Trophy, label: 'Graduation', sub: 'Post-quiz · growth report',       locked: true },
  ];

  const mechanics = [
    { icon: Flame,  n: '01', title: 'Build a streak',       desc: 'A little practice every day keeps your scam radar sharp. Watch the flame grow.' },
    { icon: Zap,    n: '02', title: 'Earn XP',              desc: 'Every correct call earns experience. Level up as you outsmart the attackers.' },
    { icon: Trophy, n: '03', title: 'Climb the board',      desc: 'A friendly leaderboard, zero pressure. See your name rise as your skills do.' },
    { icon: Crown,  n: '04', title: 'Collect badges',       desc: 'Master a room, unlock its badge. Clear all three to become an Escape Artist.' },
  ];

  const marqueeItems = [
    'Spot phishing', 'Build strong passwords', 'Shut down scams',
    'Earn XP', 'Keep your streak', 'Stay safe online',
  ];

  return (
    <main className="relative min-h-screen bg-[#FAFAF8] text-[#101010] overflow-hidden selection:bg-[#101010] selection:text-[#FAFAF8]">

      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-[92vh] flex items-center px-6 md:px-12 pt-24 pb-16">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="w-full max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Copy */}
            <div className="lg:col-span-8">
              <Reveal y={16} delay={0.1} className="flex items-center gap-3 mb-8">
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: ACCENT }} />
                <span className="text-[12px] font-bold text-zinc-500 uppercase tracking-[0.25em]">
                  Free interactive cyber-safety training
                </span>
              </Reveal>

              <h1 className="text-[13vw] lg:text-[7.5rem] font-extrabold tracking-[-0.04em] leading-[0.95] mb-10">
                <RevealWords text="Outsmart" delay={0.15} />
                <br />
                <RevealWords text="the scammers." accentWords={['scammers.']} delay={0.3} />
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
                <Reveal delay={0.5} className="md:col-span-7">
                  <p className="text-lg md:text-xl font-medium text-zinc-500 leading-relaxed max-w-xl">
                    Game-like lessons that teach you to spot phishing, build
                    unbreakable passwords, and shut down social engineering —
                    one level at a time. No tech skills needed.
                  </p>
                </Reveal>

                <Reveal delay={0.65} className="md:col-span-5 flex flex-col sm:flex-row lg:justify-end gap-4">
                  <Link
                    href={startHref}
                    className="group inline-flex items-center justify-center gap-3 px-8 py-4 text-[15px] font-bold text-[#FAFAF8] bg-[#101010] rounded-full hover:bg-[#2a2a2a] transition-colors duration-300"
                  >
                    {user ? 'Continue learning' : 'Start free'}
                    <ArrowRight strokeWidth={2} className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                  {!user && (
                    <Link
                      href="/login"
                      className="inline-flex items-center justify-center gap-2 px-8 py-4 text-[15px] font-bold text-zinc-700 rounded-full border border-zinc-300 hover:border-zinc-900 transition-colors duration-300"
                    >
                      Sign in
                    </Link>
                  )}
                </Reveal>
              </div>
            </div>

            {/* Mascot */}
            <motion.div style={{ y: mascotY }} className="lg:col-span-4 hidden lg:flex justify-center">
              <Reveal delay={0.4} y={48}>
                <div className="relative">
                  <ShieldBuddy size={260} />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.9, ease: EASE }}
                    className="absolute -right-6 top-6 flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-zinc-200 shadow-sm"
                  >
                    <Shield className="w-4 h-4" strokeWidth={2.5} style={{ color: ACCENT }} />
                    <span className="text-[13px] font-bold text-zinc-700">Scam blocked</span>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 1.05, ease: EASE }}
                    className="absolute -left-8 bottom-10 flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-zinc-200 shadow-sm"
                  >
                    <Flame className="w-4 h-4 text-[#101010]" strokeWidth={2.5} />
                    <span className="text-[13px] font-bold text-zinc-700">7-day streak</span>
                  </motion.div>
                </div>
              </Reveal>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-[0.25em]">Scroll</span>
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="w-px h-8 bg-zinc-300"
          />
        </motion.div>
      </section>

      {/* ─── Marquee ──────────────────────────────────────────────────── */}
      <section className="relative py-6 border-y border-zinc-200 bg-[#101010] overflow-hidden">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ ease: 'linear', duration: 28, repeat: Infinity }}
          className="flex w-max items-center gap-10"
        >
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="flex items-center gap-10 text-[15px] font-bold uppercase tracking-[0.2em] text-[#FAFAF8]/80 whitespace-nowrap">
              {item}
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ACCENT }} />
            </span>
          ))}
        </motion.div>
      </section>

      {/* ─── 01 · Learning path ───────────────────────────────────────── */}
      <section className="relative py-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <SectionLabel index="01" label="The path" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-5">
              <h2 className="text-5xl md:text-6xl font-extrabold tracking-[-0.03em] leading-[1.02] mb-8">
                <RevealWords text="One path." />
                <br />
                <RevealWords text="Five levels." accentWords={['Five']} delay={0.1} />
              </h2>
              <Reveal delay={0.3}>
                <p className="text-lg font-medium text-zinc-500 leading-relaxed max-w-md mb-10">
                  Follow the trail from your first assessment to graduation.
                  Each room is a realistic simulation — take it at your own
                  pace, hints included, no timer breathing down your neck.
                </p>
                <Link
                  href={startHref}
                  className="group inline-flex items-center gap-2 text-[15px] font-bold border-b-2 border-[#101010] pb-1 hover:gap-4 transition-all duration-300"
                >
                  Start the path
                  <ArrowUpRight strokeWidth={2} className="w-4 h-4" />
                </Link>
              </Reveal>
            </div>

            {/* Node list — editorial rows */}
            <div className="lg:col-span-7">
              {pathNodes.map((node, i) => (
                <div key={node.label}>
                  {i === 0 && <Rule />}
                  <Reveal delay={i * 0.06} y={24}>
                    <Link href={startHref} className="group flex items-center gap-6 py-7">
                      <span className="font-mono text-[13px] text-zinc-400 w-8">0{i + 1}</span>
                      <span
                        className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                        style={{
                          backgroundColor: node.locked ? '#EDEDEA' : ACCENT,
                          color: node.locked ? '#A1A1AA' : '#FAFAF8',
                        }}
                      >
                        <node.icon className="w-6 h-6" strokeWidth={2.25} />
                      </span>
                      <span className="flex-1">
                        <span className="block text-xl md:text-2xl font-extrabold tracking-tight">{node.label}</span>
                        <span className="block text-[14px] font-medium text-zinc-400 mt-0.5">{node.sub}</span>
                      </span>
                      <span className="text-[12px] font-bold uppercase tracking-[0.15em] text-zinc-400 hidden sm:block">
                        {node.locked ? 'Locked' : 'Open'}
                      </span>
                      <ArrowUpRight
                        strokeWidth={2}
                        className="w-5 h-5 text-zinc-300 group-hover:text-[#101010] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300"
                      />
                    </Link>
                  </Reveal>
                  <Rule delay={0.1} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── 02 · Mechanics ───────────────────────────────────────────── */}
      <section className="relative py-32 px-6 md:px-12 bg-[#101010] text-[#FAFAF8]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-10">
            <span className="font-mono text-[13px] font-medium" style={{ color: ACCENT }}>02</span>
            <span className="w-8 h-px bg-zinc-700" />
            <span className="text-[12px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Why it sticks</span>
          </div>

          <h2 className="text-5xl md:text-7xl font-extrabold tracking-[-0.03em] leading-[1.0] mb-20 max-w-3xl">
            <RevealWords text="Seriously fun." />
            <br />
            <RevealWords text="Seriously effective." accentWords={['effective.']} delay={0.15} />
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {mechanics.map((m, i) => (
              <Reveal key={m.title} delay={i * 0.08} className="group border-t border-zinc-800 pt-8 pb-12 lg:pr-10">
                <div className="flex items-center justify-between mb-8">
                  <m.icon className="w-6 h-6 transition-colors duration-300 text-zinc-500 group-hover:text-[#58CC02]" strokeWidth={2} />
                  <span className="font-mono text-[13px] text-zinc-600">{m.n}</span>
                </div>
                <h3 className="text-xl font-extrabold tracking-tight mb-3">{m.title}</h3>
                <p className="text-[15px] font-medium text-zinc-400 leading-relaxed">{m.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 03 · Stakes ──────────────────────────────────────────────── */}
      <section className="relative py-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <SectionLabel index="03" label="Why it matters" />

          <div className="space-y-0">
            {[
              { value: '3.4B+', label: 'phishing emails sent every single day' },
              { value: '£1.2B', label: 'lost to fraud by UK adults over 60 in 2024' },
              { value: '30 min', label: 'is all it takes to learn the essentials' },
            ].map((s, i) => (
              <div key={i}>
                {i === 0 && <Rule />}
                <Reveal delay={i * 0.08} y={40}>
                  <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-12 py-10">
                    <span className="text-6xl md:text-8xl font-extrabold tracking-[-0.04em] md:w-[340px]" style={i === 2 ? { color: ACCENT } : undefined}>
                      {s.value}
                    </span>
                    <span className="text-lg md:text-xl font-medium text-zinc-500">{s.label}</span>
                  </div>
                </Reveal>
                <Rule delay={0.1} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 04 · CTA ─────────────────────────────────────────────────── */}
      <section className="relative py-36 px-6 md:px-12 bg-[#101010] text-[#FAFAF8] overflow-hidden">
        <div className="relative max-w-5xl mx-auto text-center">
          <Reveal y={24} className="flex justify-center mb-10">
            <ShieldBuddy size={130} />
          </Reveal>

          <h2 className="text-5xl md:text-8xl font-extrabold tracking-[-0.04em] leading-[0.98] mb-8">
            <RevealWords text="Your move," />
            <br />
            <RevealWords text="scammers." accentWords={['scammers.']} delay={0.15} />
          </h2>

          <Reveal delay={0.35}>
            <p className="text-lg font-medium text-zinc-400 mb-12 max-w-md mx-auto leading-relaxed">
              Free forever. About 30 minutes. Skills for life.
            </p>
            <Link
              href={startHref}
              className="group inline-flex items-center justify-center gap-3 px-12 py-5 text-[16px] font-bold text-[#101010] rounded-full transition-transform duration-300 hover:scale-[1.03]"
              style={{ backgroundColor: ACCENT }}
            >
              {user ? 'Continue learning' : 'Start now — it’s free'}
              <ArrowRight strokeWidth={2.5} className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
