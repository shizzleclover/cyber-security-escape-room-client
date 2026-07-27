'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

export type FontScale = 'normal' | 'large' | 'xl';

interface AccessibilityContextType {
  fontScale: FontScale;
  setFontScale: (scale: FontScale) => void;
}

const STORAGE_KEY = 'cyberescape:fontScale';
const SCALE_CLASSES: Record<FontScale, string> = {
  normal: '',
  large: 'font-scale-large',
  xl: 'font-scale-xl',
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [fontScale, setFontScaleState] = useState<FontScale>('normal');

  // Apply the scale class to <html> and persist it (FR-13).
  const applyScale = useCallback((scale: FontScale) => {
    const root = document.documentElement;
    Object.values(SCALE_CLASSES).forEach((cls) => {
      if (cls) root.classList.remove(cls);
    });
    if (SCALE_CLASSES[scale]) root.classList.add(SCALE_CLASSES[scale]);
  }, []);

  // Restore the saved preference on mount.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as FontScale | null;
      if (saved && saved in SCALE_CLASSES) {
        setFontScaleState(saved);
        applyScale(saved);
      }
    } catch {
      // localStorage unavailable — fall back to default scale.
    }
  }, [applyScale]);

  const setFontScale = useCallback(
    (scale: FontScale) => {
      setFontScaleState(scale);
      applyScale(scale);
      try {
        localStorage.setItem(STORAGE_KEY, scale);
      } catch {
        // Ignore persistence failures.
      }
    },
    [applyScale]
  );

  return (
    <AccessibilityContext.Provider value={{ fontScale, setFontScale }}>
      {children}
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
