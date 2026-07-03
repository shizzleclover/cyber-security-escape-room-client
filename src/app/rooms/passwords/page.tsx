'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import ProtectedRoute from '@/features/auth/ProtectedRoute';
import api from '@/lib/api';
import { 
  Lock, ArrowRight, Trophy, CheckCircle2, XCircle,
  KeyRound, ShieldCheck, AlertTriangle, Zap
} from 'lucide-react';

const shakeAnimation = {
  x: [-10, 10, -10, 10, -5, 5, 0],
  transition: { duration: 0.4 }
};

// ─── Challenge 1: Rank Passwords ──────────────────────────────────────────────

function RankPasswordsChallenge({ onComplete }: { onComplete: (correct: boolean) => void }) {
  const passwords = [
    { id: 'a', value: 'password123', crackTime: 'Less than 1 second', explanation: 'One of the most commonly used passwords. Hackers try it first.' },
    { id: 'b', value: 'J@m3s!', crackTime: 'About 5 minutes', explanation: 'Short with symbol substitutions. Only 6 characters.' },
    { id: 'c', value: 'Sunshine2024!', crackTime: 'About 3 days', explanation: 'Common word with predictable pattern (word + year + symbol).' },
    { id: 'd', value: 'correct-horse-battery-staple', crackTime: 'Over 500 years', explanation: 'Long passphrase. 28 characters makes brute-force impossible.' },
  ];

  const [selected, setSelected] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [shake, setShake] = useState(false);
  const correctOrder = ['a', 'b', 'c', 'd'];

  const handleSelect = (id: string) => {
    if (showResult) return;
    if (selected.includes(id)) {
      setSelected(selected.filter((s) => s !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const handleSubmit = () => {
    setShowResult(true);
    const isCorrect = JSON.stringify(selected) === JSON.stringify(correctOrder);
    if (!isCorrect) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
    onComplete(isCorrect);
  };

  return (
    <motion.div animate={shake ? shakeAnimation : {}}>
      <div className="flex items-center gap-3 mb-4">
        <Zap strokeWidth={2} className="w-6 h-6 text-amber-500" />
        <h2 className="text-xl font-bold text-zinc-900 tracking-tight">
          Rate These Passwords
        </h2>
      </div>
      <p className="text-[15px] text-zinc-500 mb-6 leading-relaxed">
        Click the passwords in order from <span className="text-rose-600 font-bold">weakest</span> to <span className="text-emerald-600 font-bold">strongest</span>.
        {selected.length > 0 && <span className="text-zinc-900 font-bold"> ({selected.length}/4 selected)</span>}
      </p>

      <div className="grid gap-3 mb-6">
        {passwords.map((pw) => {
          const orderIndex = selected.indexOf(pw.id);
          const isSelected = orderIndex !== -1;

          let style = 'border-zinc-200 hover:border-zinc-400 bg-white';
          if (showResult) {
            const correctIndex = correctOrder.indexOf(pw.id);
            style = orderIndex === correctIndex
              ? 'border-emerald-300 bg-emerald-50'
              : 'border-rose-300 bg-rose-50';
          } else if (isSelected) {
            style = 'border-zinc-900 bg-zinc-50 ring-1 ring-zinc-900';
          }

          return (
            <motion.button
              whileHover={!showResult ? { scale: 1.01 } : {}}
              whileTap={!showResult ? { scale: 0.99 } : {}}
              key={pw.id}
              onClick={() => handleSelect(pw.id)}
              disabled={showResult}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${style}`}
            >
              <div className="flex items-center justify-between">
                <code className="text-[15px] text-zinc-800 font-mono font-bold tracking-tight">{pw.value}</code>
                {isSelected && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-sm font-bold shadow-md">
                    {orderIndex + 1}
                  </motion.span>
                )}
              </div>
              <AnimatePresence>
                {showResult && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-3 text-[14px] text-zinc-600 leading-relaxed overflow-hidden">
                    <span className="text-amber-600 font-bold">Crack time:</span> {pw.crackTime} — {pw.explanation}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>

      {!showResult && (
        <motion.div className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={selected.length !== 4}
            className="inline-flex items-center gap-2 px-6 py-3.5 text-[15px] font-bold text-white rounded-full bg-zinc-900 hover:bg-zinc-800 shadow-sm transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Check My Order
          </motion.button>
        </motion.div>
      )}

      <AnimatePresence>
        {showResult && (
          <motion.div initial={{ opacity: 0, height: 0, marginTop: 0 }} animate={{ opacity: 1, height: 'auto', marginTop: 24 }} className="overflow-hidden">
            <div className="p-5 rounded-2xl border border-zinc-200 bg-zinc-50">
              <p className="text-zinc-900 font-bold text-[15px] mb-2 flex items-center gap-2">
                <CheckCircle2 strokeWidth={2} className="w-5 h-5 text-emerald-500" />
                Key Lesson
              </p>
              <p className="text-zinc-600 text-[15px] leading-relaxed">
                Length matters more than complexity. A long passphrase beats a short complex password every time.
                &quot;correct-horse-battery-staple&quot; is 28 characters and would take centuries to crack, while &quot;P@ssw0rd!&quot; falls in seconds.
              </p>
              <div className="mt-4">
                <a 
                  href="https://www.ncsc.gov.uk/collection/passwords" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[13px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full transition-colors"
                >
                  NCSC Password Guidance
                  <ArrowRight strokeWidth={2} className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Challenge 2: Build a Password ───────────────────────────────────────────

function BuildPasswordChallenge({ onComplete }: { onComplete: (correct: boolean) => void }) {
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const commonPasswords = [
    'password', 'password123', '123456', 'qwerty', 'letmein', 'welcome',
    'monkey', 'dragon', 'master', 'football', 'shadow', 'sunshine',
  ];

  const checks = {
    length: password.length >= 12,
    notCommon: !commonPasswords.some((cp) => password.toLowerCase().includes(cp)),
    hasNumberOrSymbol: /[\d!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password),
  };

  const allPassed = checks.length && checks.notCommon && checks.hasNumberOrSymbol;

  const strengthScore = (() => {
    let score = 0;
    if (password.length >= 8) score += 20;
    if (password.length >= 12) score += 20;
    if (password.length >= 16) score += 15;
    if (password.length >= 20) score += 15;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 10;
    if (/\d/.test(password)) score += 10;
    if (/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) score += 10;
    return Math.min(score, 100);
  })();

  const strengthLabel = strengthScore <= 20 ? 'Very Weak' : strengthScore <= 40 ? 'Weak' : strengthScore <= 60 ? 'Fair' : strengthScore <= 80 ? 'Strong' : 'Very Strong';
  const strengthColor = strengthScore <= 20 ? 'bg-red-500' : strengthScore <= 40 ? 'bg-orange-500' : strengthScore <= 60 ? 'bg-amber-500' : strengthScore <= 80 ? 'bg-emerald-500' : 'bg-emerald-600';

  const handleSubmit = () => {
    setSubmitted(true);
    onComplete(allPassed);
  };

  return (
    <motion.div>
      <div className="flex items-center gap-3 mb-4">
        <KeyRound strokeWidth={2} className="w-6 h-6 text-zinc-900" />
        <h2 className="text-xl font-bold text-zinc-900 tracking-tight">
          Build a Strong Password
        </h2>
      </div>
      <p className="text-[15px] text-zinc-500 mb-6 leading-relaxed">
        Create a password that meets all the requirements. Watch the strength meter as you type.
      </p>

      <div className="mb-6">
        <input
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Type your password here..."
          disabled={submitted}
          className="w-full px-5 py-4 rounded-2xl bg-white border border-zinc-200 text-zinc-900 text-lg font-mono focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 transition-all placeholder:text-zinc-400 placeholder:font-sans"
        />

        {password.length > 0 && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
            <div className="flex justify-between text-[13px] mb-2 font-bold uppercase tracking-wider">
              <span className="text-zinc-400">Strength</span>
              <span className={strengthScore >= 80 ? 'text-emerald-600' : 'text-zinc-900'}>{strengthLabel}</span>
            </div>
            <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
              <motion.div
                animate={{ width: `${strengthScore}%` }}
                className={`h-full rounded-full ${strengthColor}`}
                transition={{ duration: 0.3, type: 'spring' }}
              />
            </div>
          </motion.div>
        )}
      </div>

      {/* Requirements Checklist */}
      <div className="space-y-3 mb-8">
        {[
          { check: checks.length, label: 'At least 12 characters long' },
          { check: checks.notCommon, label: 'Not a common word or phrase' },
          { check: checks.hasNumberOrSymbol, label: 'Contains at least one number or symbol' },
        ].map((req, i) => (
          <div key={i} className="flex items-center gap-3 text-[15px] font-medium">
            {req.check ? (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                <CheckCircle2 strokeWidth={2} className="w-5 h-5 text-emerald-600" />
              </motion.div>
            ) : (
              <div className="w-5 h-5 rounded-full border-2 border-zinc-200" />
            )}
            <span className={req.check ? 'text-zinc-900' : 'text-zinc-400'}>{req.label}</span>
          </div>
        ))}
      </div>

      {!submitted ? (
        <motion.div className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={!allPassed}
            className="inline-flex items-center gap-2 px-6 py-3.5 text-[15px] font-bold text-white rounded-full bg-zinc-900 hover:bg-zinc-800 shadow-sm transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Submit Password
          </motion.button>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden">
          <div className="p-5 rounded-2xl border border-zinc-200 bg-zinc-50">
            <p className="text-zinc-900 font-bold text-[15px] mb-2 flex items-center gap-2">
              <CheckCircle2 strokeWidth={2} className="w-5 h-5 text-emerald-500" />
              Key Lesson
            </p>
            <p className="text-zinc-600 text-[15px] leading-relaxed">
              The best passwords are long, memorable passphrases. Try combining 3-4 random words with a number or symbol between them.
              Something like &quot;purple-elephant-dancing-42&quot; is both strong and easy to remember.
            </p>
            <div className="mt-4">
              <a 
                href="https://www.security.org/how-secure-is-my-password/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[13px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full transition-colors"
              >
                Test Your Password Strength
                <ArrowRight strokeWidth={2} className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

// ─── Challenge 3: Reuse Scenario ─────────────────────────────────────────────

function ReuseScenarioChallenge({ onComplete }: { onComplete: (correct: boolean) => void }) {
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [shake, setShake] = useState(false);

  const accounts = [
    { id: 'email', name: 'Gmail', samePassword: true },
    { id: 'bank', name: 'Online Banking', samePassword: true },
    { id: 'social', name: 'Facebook', samePassword: true },
    { id: 'shopping', name: 'Amazon', samePassword: true },
    { id: 'streaming', name: 'Netflix', samePassword: false },
    { id: 'work', name: 'Work Email', samePassword: false },
  ];

  const correctAnswers = ['email', 'bank', 'social', 'shopping'];

  const toggleAccount = (id: string) => {
    if (submitted) return;
    setSelectedAccounts((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const isCorrect =
      selectedAccounts.length === correctAnswers.length &&
      correctAnswers.every((a) => selectedAccounts.includes(a));
      
    if (!isCorrect) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
    onComplete(isCorrect);
  };

  return (
    <motion.div animate={shake ? shakeAnimation : {}}>
      <div className="flex items-center gap-3 mb-4">
        <AlertTriangle strokeWidth={2} className="w-6 h-6 text-rose-500" />
        <h2 className="text-xl font-bold text-zinc-900 tracking-tight">
          The Danger of Password Reuse
        </h2>
      </div>

      <div className="p-5 rounded-2xl border border-red-200 bg-red-50 mb-6">
        <p className="text-[15px] text-zinc-700 leading-relaxed">
          <span className="text-red-600 font-bold uppercase tracking-wider text-[12px] block mb-1">Scenario</span> 
          You used the password <code className="text-amber-800 bg-amber-100 px-2 py-0.5 rounded font-bold font-mono">MyDog2019!</code> for
          multiple accounts. A hacker just got this password from a data breach at <strong className="text-zinc-900 font-bold">FitnessPal</strong>.
        </p>
      </div>

      <p className="text-[15px] text-zinc-500 mb-4 font-medium">Select ALL accounts that are now at risk:</p>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {accounts.map((account) => {
          let style = 'border-zinc-200 hover:border-zinc-400 bg-white';
          if (submitted) {
            if (account.samePassword) {
              style = selectedAccounts.includes(account.id)
                ? 'border-emerald-300 bg-emerald-50'
                : 'border-rose-300 bg-rose-50 ring-2 ring-rose-500/20'; // Missed
            } else {
              style = selectedAccounts.includes(account.id)
                ? 'border-rose-300 bg-rose-50'
                : 'border-emerald-300 bg-emerald-50 opacity-60';
            }
          } else if (selectedAccounts.includes(account.id)) {
            style = 'border-zinc-900 bg-zinc-50 ring-1 ring-zinc-900';
          }

          return (
            <motion.button
              whileHover={!submitted ? { scale: 1.02 } : {}}
              whileTap={!submitted ? { scale: 0.98 } : {}}
              key={account.id}
              onClick={() => toggleAccount(account.id)}
              disabled={submitted}
              className={`p-4 rounded-xl border transition-all duration-200 text-left ${style}`}
            >
              <p className="font-bold text-[15px] text-zinc-800">{account.name}</p>
              <AnimatePresence>
                {submitted && (
                  <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="text-[13px] font-medium text-zinc-500 mt-2 overflow-hidden">
                    {account.samePassword ? 'Same password used' : 'Different password'}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>

      {!submitted ? (
        <motion.div className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={selectedAccounts.length === 0}
            className="inline-flex items-center gap-2 px-6 py-3.5 text-[15px] font-bold text-white rounded-full bg-zinc-900 hover:bg-zinc-800 shadow-sm transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Check My Answer
          </motion.button>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden">
          <div className="p-5 rounded-2xl border border-zinc-200 bg-zinc-50">
            <p className="text-zinc-900 font-bold text-[15px] mb-2 flex items-center gap-2">
              <CheckCircle2 strokeWidth={2} className="w-5 h-5 text-emerald-500" />
              Key Lesson
            </p>
            <p className="text-zinc-600 text-[15px] leading-relaxed">
              Every account where you used the same password is now compromised. Attackers use &quot;credential stuffing&quot; to try
              your leaked password on banking, email, and shopping sites within minutes. Never reuse passwords across accounts.
            </p>
            <div className="mt-4">
              <a 
                href="https://haveibeenpwned.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[13px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full transition-colors"
              >
                Check if you have been breached
                <ArrowRight strokeWidth={2} className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

// ─── Challenge 4: Password Manager ──────────────────────────────────────────

function PasswordManagerChallenge({ onComplete }: { onComplete: (correct: boolean) => void }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(0);

  const questions = [
    {
      question: 'How many passwords do you need to remember when using a password manager?',
      options: ['One (the master password)', 'One for each account', 'None, it remembers everything', 'Two (master + backup)'],
      correctAnswer: 0,
    },
    {
      question: 'Which of these is a FREE password manager?',
      options: ['All password managers cost money', 'Bitwarden', 'Only Apple users get free ones', 'You have to pay monthly'],
      correctAnswer: 1,
    },
  ];

  const storedAccounts = [
    { site: 'Gmail', password: 'kX9#mP2$vL7@nQ4w' },
    { site: 'AIB Banking', password: 'Hy8&jR3!bN5*cT9z' },
    { site: 'Facebook', password: 'wQ4#fK7$mX2@pL6n' },
    { site: 'Amazon', password: 'nT5&hJ8!vR3*yW7q' },
  ];

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [shake, setShake] = useState(false);

  const handleAnswer = (index: number) => {
    if (showExplanation) return;
    setSelectedAnswer(index);
    setShowExplanation(true);
    if (index === questions[currentQuestion].correctAnswer) {
      setCorrect((prev) => prev + 1);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setAnswered(true);
      onComplete(true);
    }
  };

  if (!answered) {
    return (
      <motion.div animate={shake ? shakeAnimation : {}}>
        <div className="flex items-center gap-3 mb-4">
          <ShieldCheck strokeWidth={2} className="w-6 h-6 text-emerald-500" />
          <h2 className="text-xl font-bold text-zinc-900 tracking-tight">
            Your Digital Key Ring
          </h2>
        </div>
        <p className="text-[15px] text-zinc-500 mb-6 leading-relaxed">
          A password manager stores unique, strong passwords for every account. You only remember one master password.
        </p>

        {/* Demo */}
        <div className="p-5 rounded-2xl border border-zinc-200 bg-white mb-8 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <p className="text-[11px] text-zinc-400 mb-4 uppercase tracking-wider font-bold">Example: What a manager stores</p>
          <div className="space-y-3">
            {storedAccounts.map((acc) => (
              <div key={acc.site} className="flex items-center justify-between py-2 border-b border-zinc-100 last:border-0">
                <span className="text-zinc-900 font-bold text-[14px]">{acc.site}</span>
                <code className="text-[13px] text-zinc-700 font-mono bg-zinc-100 px-2 py-1 rounded font-bold">{acc.password}</code>
              </div>
            ))}
          </div>
        </div>

        {/* Question */}
        <motion.div layout className="p-6 rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <p className="font-bold text-zinc-900 text-[16px] mb-5">{questions[currentQuestion].question}</p>
          <div className="space-y-3 mb-5">
            {questions[currentQuestion].options.map((opt, i) => {
              let style = 'border-zinc-200 hover:border-zinc-400 bg-white';
              let iconEl = null;
              
              if (showExplanation) {
                if (i === questions[currentQuestion].correctAnswer) {
                  style = 'border-emerald-300 bg-emerald-50';
                  iconEl = <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><CheckCircle2 strokeWidth={2} className="w-5 h-5 text-emerald-600" /></motion.div>;
                } else if (i === selectedAnswer) {
                  style = 'border-rose-300 bg-rose-50';
                  iconEl = <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><XCircle strokeWidth={2} className="w-5 h-5 text-red-500" /></motion.div>;
                } else style = 'border-zinc-100 opacity-50';
              } else if (selectedAnswer === i) {
                style = 'border-zinc-900 bg-zinc-50';
              }
              return (
                <motion.button
                  whileHover={!showExplanation ? { scale: 1.01 } : {}}
                  whileTap={!showExplanation ? { scale: 0.99 } : {}}
                  key={i}
                  onClick={() => handleAnswer(i)}
                  disabled={showExplanation}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border text-[15px] font-medium transition-all duration-200 text-zinc-700 ${style}`}
                >
                  {opt}
                  {iconEl}
                </motion.button>
              );
            })}
          </div>
          <AnimatePresence>
            {showExplanation && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="flex justify-end overflow-hidden">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNext}
                  className="inline-flex mt-4 items-center gap-2 px-6 py-3.5 text-[15px] font-bold text-white rounded-full bg-zinc-900 hover:bg-zinc-800 transition-all duration-300"
                >
                  {currentQuestion < questions.length - 1 ? 'Next Question' : 'Complete Challenge'}
                  <ArrowRight strokeWidth={2} className="w-4 h-4" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden">
      <div className="p-5 rounded-2xl border border-zinc-200 bg-zinc-50">
        <p className="text-zinc-900 font-bold text-[15px] mb-2 flex items-center gap-2">
          <CheckCircle2 strokeWidth={2} className="w-5 h-5 text-emerald-500" />
          Key Lesson
        </p>
        <p className="text-zinc-600 text-[15px] leading-relaxed mb-3">
          A password manager lets you have a unique, strong password for every account while only needing to remember one master password.
          Many are completely free: Bitwarden, Apple Keychain, and Google Password Manager.
        </p>
        <p className="text-zinc-400 font-medium text-[13px] mb-3">
          Benefits: unique passwords everywhere, auto-fill so no typing, alerts if a site is breached, works across all your devices.
        </p>
        <div className="mt-4">
          <a 
            href="https://bitwarden.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[13px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full transition-colors"
          >
            Get Bitwarden (Free Password Manager)
            <ArrowRight strokeWidth={2} className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Password Room ──────────────────────────────────────────────────────

export default function PasswordRoomPage() {
  return (
    <ProtectedRoute>
      <PasswordRoomContent />
    </ProtectedRoute>
  );
}

function PasswordRoomContent() {
  const router = useRouter();
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [scores, setScores] = useState<boolean[]>([]);
  const [roomComplete, setRoomComplete] = useState(false);
  const [startTime] = useState(Date.now());
  const [hintsUsed] = useState(0);

  const totalChallenges = 4;

  const handleChallengeComplete = (correct: boolean) => {
    setScores((prev) => [...prev, correct]);
  };

  const handleNext = () => {
    if (currentChallenge < totalChallenges - 1) {
      setCurrentChallenge((prev) => prev + 1);
    } else {
      handleRoomComplete();
    }
  };

  const handleRoomComplete = async () => {
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    const score = scores.filter(Boolean).length;
    setRoomComplete(true);
    try {
      await api.post('/scores', { roomId: 'passwords', score, maxScore: totalChallenges, hintsUsed, timeSpent });
      await api.put('/progress/passwords', { status: 'completed', currentStep: totalChallenges });
    } catch {}
  };

  if (roomComplete) {
    const score = scores.filter(Boolean).length;
    const percentage = Math.round((score / totalChallenges) * 100);
    return (
      <main className="relative min-h-screen flex items-center justify-center px-6 py-12 bg-[#F7F7F8]">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, type: 'spring', stiffness: 100, damping: 20 }} className="relative w-full max-w-lg">
          <div className="p-10 rounded-2xl border border-zinc-200/80 bg-white shadow-sm text-center">
            <Trophy strokeWidth={1.5} className="w-16 h-16 text-zinc-900 mx-auto mb-6" />
            <h2 className="text-3xl font-extrabold text-zinc-900 mb-2">
              Password Room Complete!
            </h2>
            <p className="text-zinc-500 mb-6 text-[15px]">
              You completed <span className="text-zinc-900 font-bold">{score}</span> of <span className="text-zinc-900 font-bold">{totalChallenges}</span> challenges correctly ({percentage}%)
            </p>
            <div className="mb-8">
              <div className="h-3 rounded-full bg-zinc-100 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1.2, delay: 0.3, type: 'spring', stiffness: 100, damping: 20 }}
                  className="h-full rounded-full bg-zinc-900"
                />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/debrief?room=passwords')}
                className="group w-full inline-flex items-center justify-center gap-2 py-4 text-[15px] font-bold text-white rounded-full bg-zinc-900 hover:bg-zinc-800 shadow-sm transition-all duration-300"
              >
                View Debrief
                <ArrowRight strokeWidth={2} className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/hub')}
                className="w-full py-4 text-[15px] font-bold text-zinc-600 hover:text-zinc-900 rounded-full border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 transition-all duration-300"
              >
                Back to Rooms
              </motion.button>
            </div>
          </div>
        </motion.div>
      </main>
    );
  }

  const challengeCompleted = scores.length > currentChallenge;

  return (
    <main className="relative min-h-screen bg-[#F7F7F8] flex items-center justify-center">
      <div className="relative w-full max-w-3xl px-6 py-16">
        {/* Header */}
        <motion.div layout className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Lock strokeWidth={1.5} className="w-8 h-8 text-zinc-900" />
            <div>
              <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
                Password Security
              </h1>
              <p className="text-[13px] font-medium text-zinc-400 uppercase tracking-wider mt-1">Challenge {currentChallenge + 1} of {totalChallenges}</p>
            </div>
          </div>
          <div className="h-1.5 rounded-full bg-zinc-100 overflow-hidden mt-6">
            <motion.div
              initial={false}
              animate={{ width: `${((currentChallenge + 1) / totalChallenges) * 100}%` }}
              transition={{ duration: 0.4, type: 'spring', stiffness: 100, damping: 20 }}
              className="h-full rounded-full bg-zinc-900"
            />
          </div>
        </motion.div>

        {/* Challenge Content */}
        <AnimatePresence mode="wait">
          <motion.div key={currentChallenge} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4, type: 'spring', stiffness: 100, damping: 20 }}>
            <motion.div layout className="p-8 rounded-2xl border border-zinc-200 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
              {currentChallenge === 0 && <RankPasswordsChallenge onComplete={handleChallengeComplete} />}
              {currentChallenge === 1 && <BuildPasswordChallenge onComplete={handleChallengeComplete} />}
              {currentChallenge === 2 && <ReuseScenarioChallenge onComplete={handleChallengeComplete} />}
              {currentChallenge === 3 && <PasswordManagerChallenge onComplete={handleChallengeComplete} />}
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Next Button */}
        <AnimatePresence>
          {challengeCompleted && (
            <motion.div initial={{ opacity: 0, y: 10, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} className="mt-8 flex justify-end overflow-hidden">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNext}
                className="group inline-flex items-center gap-2 px-8 py-3.5 text-[15px] font-bold text-white rounded-full bg-zinc-900 hover:bg-zinc-800 shadow-sm transition-all duration-300"
              >
                {currentChallenge < totalChallenges - 1 ? 'Next Challenge' : 'Finish Room'}
                <ArrowRight strokeWidth={2} className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
