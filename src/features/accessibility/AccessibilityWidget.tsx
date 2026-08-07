'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Type, ZoomIn, ZoomOut, Contrast, Play, Pause, X } from 'lucide-react';
import { useAccessibility } from './AccessibilityContext';

export function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    textSizeMultiplier,
    increaseTextSize,
    decreaseTextSize,
    highContrast,
    toggleHighContrast,
    reduceMotion,
    toggleReduceMotion
  } = useAccessibility();

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-zinc-900 text-white rounded-full shadow-lg hover:bg-zinc-800 transition-colors"
        aria-label="Accessibility Options"
      >
        <Settings className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 z-50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed bottom-24 right-6 w-80 bg-white rounded-2xl shadow-xl border border-zinc-200 z-50 overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-zinc-100 bg-zinc-50">
                <h3 className="font-bold text-zinc-900">Accessibility Settings</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-md hover:bg-zinc-200 text-zinc-500 transition-colors"
                  aria-label="Close settings"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-4 space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Type className="w-4 h-4 text-zinc-500" />
                    <span className="text-sm font-bold text-zinc-700">Text Size ({(textSizeMultiplier * 100).toFixed(0)}%)</span>
                  </div>
                  <div className="flex items-center justify-between bg-zinc-50 rounded-xl p-1 border border-zinc-200">
                    <button
                      onClick={decreaseTextSize}
                      disabled={textSizeMultiplier <= 0.9}
                      className="flex-1 flex justify-center py-2 text-zinc-700 hover:bg-white hover:shadow-sm rounded-lg transition-all disabled:opacity-50"
                      aria-label="Decrease text size"
                    >
                      <ZoomOut className="w-5 h-5" />
                    </button>
                    <span className="w-px h-6 bg-zinc-200 mx-2" />
                    <button
                      onClick={increaseTextSize}
                      disabled={textSizeMultiplier >= 1.5}
                      className="flex-1 flex justify-center py-2 text-zinc-700 hover:bg-white hover:shadow-sm rounded-lg transition-all disabled:opacity-50"
                      aria-label="Increase text size"
                    >
                      <ZoomIn className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={toggleHighContrast}
                    className="w-full flex items-center justify-between p-3 rounded-xl border transition-colors group bg-white"
                    style={{ borderColor: highContrast ? '#10B981' : '#E5E7EB', backgroundColor: highContrast ? '#ECFDF5' : '#FFFFFF' }}
                  >
                    <div className="flex items-center gap-3">
                      <Contrast className={`w-5 h-5 ${highContrast ? 'text-emerald-600' : 'text-zinc-500 group-hover:text-zinc-900'}`} />
                      <span className={`font-medium ${highContrast ? 'text-emerald-900' : 'text-zinc-700'}`}>High Contrast</span>
                    </div>
                    <div className={`w-10 h-6 rounded-full p-1 transition-colors ${highContrast ? 'bg-emerald-500' : 'bg-zinc-200'}`}>
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform ${highContrast ? 'translate-x-4' : 'translate-x-0'}`} />
                    </div>
                  </button>

                  <button
                    onClick={toggleReduceMotion}
                    className="w-full flex items-center justify-between p-3 rounded-xl border transition-colors group bg-white"
                    style={{ borderColor: reduceMotion ? '#10B981' : '#E5E7EB', backgroundColor: reduceMotion ? '#ECFDF5' : '#FFFFFF' }}
                  >
                    <div className="flex items-center gap-3">
                      {reduceMotion ? (
                        <Pause className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Play className="w-5 h-5 text-zinc-500 group-hover:text-zinc-900" />
                      )}
                      <span className={`font-medium ${reduceMotion ? 'text-emerald-900' : 'text-zinc-700'}`}>Reduce Motion</span>
                    </div>
                    <div className={`w-10 h-6 rounded-full p-1 transition-colors ${reduceMotion ? 'bg-emerald-500' : 'bg-zinc-200'}`}>
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform ${reduceMotion ? 'translate-x-4' : 'translate-x-0'}`} />
                    </div>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
