'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Type, Volume2, VolumeX } from 'lucide-react';
import { useAccessibility, FontScale } from '@/features/accessibility/AccessibilityContext';
import { useAudio } from '@/features/audio/AudioContext';

const SCALES: { value: FontScale; label: string; abbr: string }[] = [
  { value: 'normal', label: 'Normal', abbr: 'A' },
  { value: 'large', label: 'Large', abbr: 'A+' },
  { value: 'xl', label: 'Extra Large', abbr: 'A++' },
];

export default function AccessibilityToolbar() {
  const { fontScale, setFontScale } = useAccessibility();
  const { soundEnabled, toggleSound, playSound } = useAudio();
  const [open, setOpen] = useState(false);

  return (
    <div className="no-print fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.18, type: 'spring', stiffness: 300, damping: 25 }}
            className="bg-white border border-zinc-200 rounded-2xl shadow-lg p-4 w-52"
          >
            <div className="flex items-center gap-2 mb-3">
              <Type strokeWidth={1.5} className="w-4 h-4 text-zinc-500" />
              <span className="text-[13px] font-semibold text-zinc-700 uppercase tracking-wider">Text Size</span>
            </div>
            <div className="flex flex-col gap-1.5">
              {SCALES.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setFontScale(s.value)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-150 ${
                    fontScale === s.value
                      ? 'bg-zinc-900 text-white'
                      : 'text-zinc-700 hover:bg-zinc-100'
                  }`}
                >
                  <span>{s.label}</span>
                  <span className={`font-mono font-bold ${fontScale === s.value ? 'text-zinc-300' : 'text-zinc-400'}`}>
                    {s.abbr}
                  </span>
                </button>
              ))}
            </div>

            {/* Sound effects toggle (FR-14) */}
            <div className="mt-4 pt-4 border-t border-zinc-100">
              <button
                onClick={() => {
                  const wasEnabled = soundEnabled;
                  toggleSound();
                  // Confirm the change audibly when turning sound on.
                  if (!wasEnabled) playSound('correct');
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[14px] font-medium text-zinc-700 hover:bg-zinc-100 transition-all duration-150"
              >
                <span className="flex items-center gap-2">
                  {soundEnabled ? (
                    <Volume2 strokeWidth={1.5} className="w-4 h-4 text-zinc-500" />
                  ) : (
                    <VolumeX strokeWidth={1.5} className="w-4 h-4 text-zinc-400" />
                  )}
                  Sound Effects
                </span>
                <span
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    soundEnabled ? 'bg-zinc-900' : 'bg-zinc-300'
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                      soundEnabled ? 'translate-x-4' : 'translate-x-1'
                    }`}
                  />
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((v) => !v)}
        aria-label="Accessibility settings"
        aria-expanded={open}
        className="w-12 h-12 rounded-full bg-white border border-zinc-200 shadow-md flex items-center justify-center text-zinc-600 hover:text-zinc-900 hover:border-zinc-300 transition-all duration-200"
      >
        <Settings strokeWidth={1.5} className="w-5 h-5" />
      </motion.button>
    </div>
  );
}
