'use client';

import { motion } from 'framer-motion';
import { 
  Shield, Target, Users, BookOpen, Accessibility, 
  Eye, Volume2, Clock, Lightbulb, GraduationCap,
  Heart, Globe, ArrowRight
} from 'lucide-react';
import Link from 'next/link';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: 'easeOut' },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
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
    { title: "Kolb's Experiential Learning", desc: 'Learning by doing, reflecting, and applying. Each room follows this cycle.' },
    { title: 'Gamification Theory', desc: 'Progress tracking, achievements, and feedback loops that keep motivation high.' },
    { title: 'Universal Design for Learning', desc: 'Multiple means of engagement, representation, and action for all learners.' },
    { title: 'DigComp 2.2 Framework', desc: "Aligned with the EU's digital competence framework for citizens." },
  ];

  return (
    <main className="relative overflow-hidden bg-[#FAF9F5]">
      {/* Hero */}
      <section className="relative px-6 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="text-center"
          >
            <motion.div variants={fadeUp} custom={0} className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-200 bg-white shadow-sm">
                <GraduationCap strokeWidth={1.75} className="w-4 h-4 text-zinc-700" />
                <span className="text-sm font-medium text-zinc-700">MSc Dissertation Project</span>
              </div>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              custom={1}
              className="text-4xl md:text-6xl font-bold text-zinc-900 leading-tight tracking-tight"
            >
              About CyberEscape
            </motion.h1>

            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-lg text-zinc-600 mt-6 max-w-2xl mx-auto leading-relaxed"
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
      <section className="relative px-6 py-16 border-t border-zinc-200/60 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} custom={0} className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-xs font-bold text-rose-700 uppercase tracking-wider mb-3">The Problem</p>
                <h2 className="text-3xl font-bold text-zinc-900 mb-4 tracking-tight">
                  Older Adults Are Disproportionately Targeted
                </h2>
                <p className="text-zinc-600 leading-relaxed mb-4 text-sm sm:text-base">
                  Cybercriminals deliberately target older adults because they tend to have less experience 
                  with digital technology, are more trusting of authority figures, and often lack access to 
                  cybersecurity education that speaks their language.
                </p>
                <p className="text-zinc-600 leading-relaxed text-sm sm:text-base">
                  In 2024, total payment fraud in Ireland reached €160 million — up 24.5% in a single year — 
                  and more than one in three Irish adults has experienced fraud or scams. 
                  Traditional cybersecurity training uses jargon, assumes technical knowledge, and fails 
                  to engage this demographic. CyberEscape takes a different approach.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 rounded-xl border border-zinc-200 bg-[#FAF9F5] text-center">
                  <div className="text-2xl font-bold text-rose-600 mb-1">3.4B+</div>
                  <p className="text-xs text-zinc-600 font-medium">Phishing emails sent daily</p>
                </div>
                <div className="p-6 rounded-xl border border-zinc-200 bg-[#FAF9F5] text-center">
                  <div className="text-2xl font-bold text-amber-600 mb-1">€160M</div>
                  <p className="text-xs text-zinc-600 font-medium">Lost to fraud in Ireland in 2024</p>
                </div>
                <div className="p-6 rounded-xl border border-zinc-200 bg-[#FAF9F5] text-center">
                  <div className="text-2xl font-bold text-zinc-800 mb-1">82%</div>
                  <p className="text-xs text-zinc-600 font-medium">Breaches involve human error</p>
                </div>
                <div className="p-6 rounded-xl border border-zinc-200 bg-[#FAF9F5] text-center">
                  <div className="text-2xl font-bold text-emerald-600 mb-1">30 min</div>
                  <p className="text-xs text-zinc-600 font-medium">To learn the essentials</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="relative px-6 py-20 bg-[#FAF9F5]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={stagger}
            className="text-center mb-14"
          >
            <motion.p variants={fadeUp} custom={0} className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-3">
              Our Approach
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-bold text-zinc-900 tracking-tight">
              Learning Through Play, Not Lectures
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-zinc-600 mt-4 max-w-2xl mx-auto leading-relaxed">
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
              { icon: Target, title: 'Scenario-Based', desc: 'Every challenge mirrors a real-world situation you might encounter in your inbox, on your phone, or at your door.' },
              { icon: Users, title: 'Designed for Everyone', desc: 'Large text, clear language, no jargon, no time pressure. Built from the ground up for accessibility.' },
              { icon: BookOpen, title: 'Research-Backed', desc: 'Grounded in established learning theories and aligned with international digital competence frameworks.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i}
                className="p-8 rounded-xl border border-zinc-200 bg-white shadow-sm"
              >
                <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center mb-4 text-zinc-900">
                  <item.icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 mb-2">{item.title}</h3>
                <p className="text-zinc-600 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Accessibility */}
      <section className="relative px-6 py-20 border-t border-zinc-200/60 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={stagger}
            className="text-center mb-14"
          >
            <motion.p variants={fadeUp} custom={0} className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">
              Accessibility First
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-bold text-zinc-900 tracking-tight">
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
                className="flex items-start gap-4 p-5 rounded-xl border border-zinc-200 bg-[#FAF9F5]"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white border border-zinc-200 flex items-center justify-center text-zinc-700">
                  <feature.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-zinc-900 mb-1">{feature.title}</h4>
                  <p className="text-xs text-zinc-600 leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Research Foundation */}
      <section className="relative px-6 py-20 bg-[#FAF9F5]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={stagger}
            className="text-center mb-14"
          >
            <motion.p variants={fadeUp} custom={0} className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-3">
              Research Foundation
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-bold text-zinc-900 tracking-tight">
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
                className="flex items-start gap-5 p-5 rounded-xl border border-zinc-200 bg-white shadow-sm"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800">
                  <span className="text-sm font-bold">{i + 1}</span>
                </div>
                <div>
                  <h4 className="text-base font-semibold text-zinc-900 mb-1">{item.title}</h4>
                  <p className="text-sm text-zinc-600 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="relative px-6 py-20 border-t border-zinc-200/80 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="p-8 sm:p-12 rounded-2xl bg-zinc-900 text-white text-center shadow-lg">
            <div className="w-14 h-14 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center mx-auto mb-5 text-white">
              <Globe strokeWidth={1.75} className="w-7 h-7" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 tracking-tight">
              Start Your Training Today
            </h2>
            <p className="text-zinc-300 mb-8 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
              No cost. No technical knowledge required. Just 30 minutes to build lifelong security habits.
            </p>
            <div>
              <Link
                href="/hub"
                className="inline-flex items-center gap-2 px-8 py-4 text-sm font-bold text-zinc-900 rounded-full bg-white hover:bg-zinc-100 shadow transition-all"
              >
                <span>Enter Escape Rooms</span>
                <ArrowRight strokeWidth={2} className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
