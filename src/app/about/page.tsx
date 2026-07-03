'use client';

import { motion } from 'framer-motion';
import { 
  Shield, Target, Users, BookOpen, Accessibility, 
  Eye, Volume2, Clock, Lightbulb, GraduationCap,
  Heart, Globe, ArrowRight
} from 'lucide-react';
import Link from 'next/link';

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

export default function AboutPage() {
  const accessibilityFeatures = [
    { icon: Eye, title: 'Large Text Mode', desc: 'Increase all text sizes with a single toggle for comfortable reading.' },
    { icon: Accessibility, title: 'High Contrast', desc: 'Enhanced colour contrast that exceeds WCAG AAA standards.' },
    { icon: Clock, title: 'No Time Pressure', desc: 'Take as long as you need. There are no countdown timers or penalties.' },
    { icon: Volume2, title: 'Audio Descriptions', desc: 'Optional audio cues and screen reader compatibility throughout.' },
    { icon: Lightbulb, title: 'Hint System', desc: 'Stuck? Request a hint at any point without losing progress.' },
    { icon: Heart, title: 'Encouraging Feedback', desc: 'Positive reinforcement at every step. No shame for wrong answers.' },
  ];

  const researchBasis = [
    { title: 'Kolb\'s Experiential Learning', desc: 'Learning by doing, reflecting, and applying. Each room follows this cycle.' },
    { title: 'Gamification Theory', desc: 'Progress tracking, achievements, and feedback loops that keep motivation high.' },
    { title: 'Universal Design for Learning', desc: 'Multiple means of engagement, representation, and action for all learners.' },
    { title: 'DigComp 2.2 Framework', desc: 'Aligned with the EU\'s digital competence framework for citizens.' },
  ];

  return (
    <main className="relative overflow-hidden bg-[#FAF9F6]">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-zinc-200/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-zinc-100/40 rounded-full blur-[100px]" />
      </div>

      {/* Hero */}
      <section className="relative px-6 pt-32 pb-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="text-center"
          >
            <motion.div variants={fadeUp} custom={0} className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-200 bg-white shadow-sm">
                <GraduationCap strokeWidth={1.5} className="w-4 h-4 text-zinc-600" />
                <span className="text-sm text-zinc-500">MSc Dissertation Project</span>
              </div>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              custom={1}
              className="text-4xl md:text-6xl font-bold text-zinc-900 leading-tight"
            >
              About CyberEscape
            </motion.h1>

            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-lg text-zinc-500 mt-6 max-w-2xl mx-auto leading-relaxed"
            >
              CyberEscape is an interactive web-based escape room designed to teach essential 
              cybersecurity skills to people who need them most. Built as part of an MSc dissertation 
              at Griffith College Dublin, it combines educational research with game design to make 
              digital safety accessible and engaging.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* The Problem */}
      <section className="relative px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} custom={0} className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-sm font-semibold text-rose-600 uppercase tracking-wider mb-3">The Problem</p>
                <h2 className="text-3xl font-bold text-zinc-900 mb-4">
                  Older Adults Are Disproportionately Targeted
                </h2>
                <p className="text-zinc-500 leading-relaxed mb-4">
                  Cybercriminals deliberately target older adults because they tend to have less experience 
                  with digital technology, are more trusting of authority figures, and often lack access to 
                  cybersecurity education that speaks their language.
                </p>
                <p className="text-zinc-500 leading-relaxed">
                  In 2024 alone, adults over 60 in the UK lost over £1.2 billion to online fraud. 
                  Traditional cybersecurity training uses jargon, assumes technical knowledge, and fails 
                  to engage this demographic. CyberEscape takes a different approach.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 rounded-xl border border-zinc-200/80 bg-white shadow-sm text-center">
                  <div className="text-2xl font-bold text-rose-600 mb-1">3.4B+</div>
                  <p className="text-xs text-zinc-500">Phishing emails sent daily</p>
                </div>
                <div className="p-6 rounded-xl border border-zinc-200/80 bg-white shadow-sm text-center">
                  <div className="text-2xl font-bold text-amber-600 mb-1">£1.2B</div>
                  <p className="text-xs text-zinc-500">Lost by UK over-60s in 2024</p>
                </div>
                <div className="p-6 rounded-xl border border-zinc-200/80 bg-white shadow-sm text-center">
                  <div className="text-2xl font-bold text-zinc-700 mb-1">82%</div>
                  <p className="text-xs text-zinc-500">Breaches involve human error</p>
                </div>
                <div className="p-6 rounded-xl border border-zinc-200/80 bg-white shadow-sm text-center">
                  <div className="text-2xl font-bold text-emerald-600 mb-1">30 min</div>
                  <p className="text-xs text-zinc-500">To learn the essentials</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="relative px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={stagger}
            className="text-center mb-14"
          >
            <motion.p variants={fadeUp} custom={0} className="text-sm font-semibold text-emerald-600 uppercase tracking-wider mb-3">
              Our Approach
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-bold text-zinc-900">
              Learning Through Play, Not Lectures
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-zinc-500 mt-4 max-w-2xl mx-auto">
              Instead of reading about threats, you experience them in a safe environment. 
              Make mistakes without consequences and build real instincts.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              { icon: Target, title: 'Scenario-Based', desc: 'Every challenge mirrors a real-world situation you might encounter in your inbox, on your phone, or at your door.', color: 'text-rose-600' },
              { icon: Users, title: 'Designed for Everyone', desc: 'Large text, clear language, no jargon, no time pressure. Built from the ground up for accessibility.', color: 'text-zinc-700' },
              { icon: BookOpen, title: 'Research-Backed', desc: 'Grounded in established learning theories and aligned with international digital competence frameworks.', color: 'text-emerald-600' },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i}
                className="p-8 rounded-xl border border-zinc-200/80 bg-white shadow-sm"
              >
                <item.icon className={`w-8 h-8 ${item.color} mb-4`} />
                <h3 className="text-lg font-semibold text-zinc-900 mb-2">{item.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Accessibility */}
      <section className="relative px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={stagger}
            className="text-center mb-14"
          >
            <motion.p variants={fadeUp} custom={0} className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">
              Accessibility First
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-bold text-zinc-900">
              Built for Real People
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {accessibilityFeatures.map((feature, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i}
                className="flex items-start gap-4 p-5 rounded-xl border border-zinc-200/80 bg-white shadow-sm"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-zinc-600" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-zinc-900 mb-1">{feature.title}</h4>
                  <p className="text-xs text-zinc-500 leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Research Foundation */}
      <section className="relative px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={stagger}
            className="text-center mb-14"
          >
            <motion.p variants={fadeUp} custom={0} className="text-sm font-semibold text-amber-600 uppercase tracking-wider mb-3">
              Research Foundation
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-bold text-zinc-900">
              Grounded in Theory
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="space-y-4"
          >
            {researchBasis.map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i}
                className="flex items-start gap-5 p-5 rounded-xl border border-zinc-200/80 bg-white shadow-sm"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center">
                  <span className="text-sm font-bold text-amber-700">{i + 1}</span>
                </div>
                <div>
                  <h4 className="text-base font-semibold text-zinc-900 mb-1">{item.title}</h4>
                  <p className="text-sm text-zinc-500">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative px-6 py-24">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} custom={0} className="w-16 h-16 rounded-xl bg-zinc-900 flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Globe strokeWidth={1.5} className="w-8 h-8 text-white" />
            </motion.div>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl font-bold text-zinc-900 mb-4">
              Start Your Journey
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-zinc-500 mb-8">
              No cost. No technical knowledge required. Just 30 minutes of your time.
            </motion.p>
            <motion.div variants={fadeUp} custom={3}>
              <Link
                href="/register"
                className="group inline-flex items-center gap-3 px-8 py-4 text-base font-semibold text-white rounded-xl bg-zinc-900 hover:bg-zinc-800 shadow-sm transition-all duration-300"
              >
                Create Your Account
                <ArrowRight strokeWidth={1.5} className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
