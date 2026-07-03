'use client';

import { motion } from 'framer-motion';
import { 
  ExternalLink, Shield, BookOpen, Phone, Globe,
  AlertTriangle, Lock, Users, FileText, Landmark
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
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function ResourcesPage() {
  const categories = [
    {
      title: 'Reporting Fraud',
      description: 'If you think you have been scammed or targeted, report it here.',
      color: 'text-rose-600',
      borderColor: 'border-rose-200',
      bgColor: 'bg-rose-50',
      resources: [
        { title: 'Action Fraud (UK)', description: 'The UK national reporting centre for fraud and cybercrime.', url: 'https://www.actionfraud.police.uk/', icon: Landmark },
        { title: 'An Garda Síochána', description: 'Report cybercrime to Irish police.', url: 'https://www.garda.ie/en/crime/fraud/', icon: Shield },
        { title: 'FraudSMART (Ireland)', description: 'Banking and Payments Federation Ireland fraud awareness.', url: 'https://www.fraudsmart.ie/', icon: AlertTriangle },
      ],
    },
    {
      title: 'Learning More',
      description: 'Trusted resources to continue building your digital skills.',
      color: 'text-zinc-700',
      borderColor: 'border-zinc-200',
      bgColor: 'bg-zinc-100',
      resources: [
        { title: 'National Cyber Security Centre', description: 'UK government guidance on staying safe online.', url: 'https://www.ncsc.gov.uk/cyberaware', icon: Globe },
        { title: 'Age Action Ireland', description: 'Digital literacy programmes for older adults.', url: 'https://www.ageaction.ie/', icon: Users },
        { title: 'Google Phishing Quiz', description: 'Test your phishing detection skills with Google.', url: 'https://phishingquiz.withgoogle.com/', icon: FileText },
      ],
    },
    {
      title: 'Password Tools',
      description: 'Recommended tools for managing your passwords securely.',
      color: 'text-violet-600',
      borderColor: 'border-violet-200',
      bgColor: 'bg-violet-50',
      resources: [
        { title: 'Bitwarden', description: 'Free, open-source password manager. Works on all devices.', url: 'https://bitwarden.com/', icon: Lock },
        { title: 'Have I Been Pwned', description: 'Check if your email has been in a data breach.', url: 'https://haveibeenpwned.com/', icon: AlertTriangle },
        { title: 'How Secure Is My Password', description: 'See how long it would take to crack your password.', url: 'https://www.security.org/how-secure-is-my-password/', icon: Shield },
      ],
    },
    {
      title: 'Get Help',
      description: 'Organisations that can support you if you need assistance.',
      color: 'text-emerald-600',
      borderColor: 'border-emerald-200',
      bgColor: 'bg-emerald-50',
      resources: [
        { title: 'Citizens Information (Ireland)', description: 'Free information and advice on public services.', url: 'https://www.citizensinformation.ie/', icon: BookOpen },
        { title: 'Age UK Helpline', description: 'Free advice line for older people: 0800 678 1602.', url: 'https://www.ageuk.org.uk/', icon: Phone },
        { title: 'Victim Support', description: 'Free support for victims of crime including fraud.', url: 'https://www.victimsupport.org.uk/', icon: Users },
      ],
    },
  ];

  return (
    <main className="relative overflow-hidden min-h-screen bg-[#FAF9F6]">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/3 w-[600px] h-[600px] bg-zinc-200/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-zinc-100/40 rounded-full blur-[100px]" />
      </div>

      <section className="relative px-6 pt-28 pb-20">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="mb-14"
          >
            <motion.p variants={fadeUp} custom={0} className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">
              Further Reading
            </motion.p>
            <motion.h1
              variants={fadeUp}
              custom={1}
              className="text-3xl md:text-5xl font-bold text-zinc-900"
            >
              Resources &amp; Support
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="text-zinc-500 mt-4 max-w-2xl text-lg">
              Trusted links to help you stay safe, report fraud, and continue learning beyond CyberEscape.
            </motion.p>
          </motion.div>

          {/* Categories */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="space-y-12"
          >
            {categories.map((category, catIdx) => (
              <motion.div key={catIdx} variants={fadeUp} custom={catIdx}>
                <div className="mb-5">
                  <h2 className={`text-xl font-semibold ${category.color}`}>
                    {category.title}
                  </h2>
                  <p className="text-sm text-zinc-500 mt-1">{category.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {category.resources.map((resource, resIdx) => (
                    <a
                      key={resIdx}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group flex flex-col p-5 rounded-xl border ${category.borderColor} bg-white hover:shadow-sm transition-all duration-300`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className={`w-9 h-9 rounded-lg ${category.bgColor} flex items-center justify-center`}>
                          <resource.icon className={`w-4 h-4 ${category.color}`} />
                        </div>
                        <ExternalLink strokeWidth={1.5} className="w-4 h-4 text-zinc-300 group-hover:text-zinc-500 transition-colors" />
                      </div>
                      <h3 className="text-sm font-semibold text-zinc-900 mb-1 group-hover:text-zinc-700 transition-colors">
                        {resource.title}
                      </h3>
                      <p className="text-xs text-zinc-500 leading-relaxed">
                        {resource.description}
                      </p>
                    </a>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Disclaimer */}
          <div className="mt-16 pt-8 border-t border-zinc-200">
            <p className="text-xs text-zinc-400 text-center">
              All resources link to external websites. CyberEscape is not affiliated with these organisations.
              Links were verified at the time of publication but may change.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
