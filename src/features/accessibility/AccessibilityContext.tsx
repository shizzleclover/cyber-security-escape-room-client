'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { MotionConfig } from 'framer-motion';

interface AccessibilityContextType {
  textSizeMultiplier: number;
  increaseTextSize: () => void;
  decreaseTextSize: () => void;
  highContrast: boolean;
  toggleHighContrast: () => void;
  reduceMotion: boolean;
  toggleReduceMotion: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [textSizeMultiplier, setTextSizeMultiplier] = useState(1);
  const [highContrast, setHighContrast] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('cyberescape:a11y');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.textSizeMultiplier) setTextSizeMultiplier(parsed.textSizeMultiplier);
        if (parsed.highContrast !== undefined) setHighContrast(parsed.highContrast);
        if (parsed.reduceMotion !== undefined) setReduceMotion(parsed.reduceMotion);
      }
    } catch {}
    setMounted(true);
  }, []);

  // Save to localStorage when changed
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem('cyberescape:a11y', JSON.stringify({
        textSizeMultiplier,
        highContrast,
        reduceMotion
      }));
    } catch {}
  }, [textSizeMultiplier, highContrast, reduceMotion, mounted]);

  // Apply text size to root
  useEffect(() => {
    document.documentElement.style.fontSize = `${textSizeMultiplier * 100}%`;
  }, [textSizeMultiplier]);

  // Apply high contrast class
  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [highContrast]);

  // Apply reduce motion class (for non-framer animations)
  useEffect(() => {
    if (reduceMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  }, [reduceMotion]);

  const increaseTextSize = useCallback(() => setTextSizeMultiplier(prev => Math.min(prev + 0.1, 1.5)), []);
  const decreaseTextSize = useCallback(() => setTextSizeMultiplier(prev => Math.max(prev - 0.1, 0.9)), []);
  const toggleHighContrast = useCallback(() => setHighContrast(prev => !prev), []);
  const toggleReduceMotion = useCallback(() => setReduceMotion(prev => !prev), []);

  return (
    <AccessibilityContext.Provider
      value={{
        textSizeMultiplier,
        increaseTextSize,
        decreaseTextSize,
        highContrast,
        toggleHighContrast,
        reduceMotion,
        toggleReduceMotion
      }}
    >
      <MotionConfig reducedMotion={reduceMotion ? "always" : "user"}>
        {children}
      </MotionConfig>
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}
