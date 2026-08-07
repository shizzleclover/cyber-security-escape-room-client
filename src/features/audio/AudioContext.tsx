'use client';

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';

export type SoundEvent = 'correct' | 'wrong' | 'hint' | 'complete' | 'click';

interface AudioContextType {
  isPlaying: boolean;
  toggleAudio: () => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  playSound: (event: SoundEvent) => void;
}

const AudioContext = createContext<AudioContextType>({
  isPlaying: false,
  toggleAudio: () => {},
  soundEnabled: true,
  toggleSound: () => {},
  playSound: () => {},
});

export const useAudio = () => useContext(AudioContext);

const SOUND_PREF_KEY = 'cyberescape:soundEnabled';

// Short synthesised cues per event (FR-14). Each is a list of tones played
// via the Web Audio API — no binary assets or external requests required.
const SOUND_RECIPES: Record<SoundEvent, { freq: number; start: number; duration: number; type: OscillatorType }[]> = {
  // Bright ascending two-note "ding" for a correct answer.
  correct: [
    { freq: 660, start: 0, duration: 0.12, type: 'sine' },
    { freq: 880, start: 0.1, duration: 0.16, type: 'sine' },
  ],
  // Low, short "buzz" for a wrong answer (kept gentle — the audience is nervous).
  wrong: [
    { freq: 200, start: 0, duration: 0.18, type: 'triangle' },
    { freq: 150, start: 0.14, duration: 0.2, type: 'triangle' },
  ],
  // Soft single mid tone when a hint is revealed.
  hint: [{ freq: 520, start: 0, duration: 0.18, type: 'sine' }],
  // Triumphant three-note rise on room/quiz completion.
  complete: [
    { freq: 523, start: 0, duration: 0.14, type: 'sine' },
    { freq: 659, start: 0.13, duration: 0.14, type: 'sine' },
    { freq: 784, start: 0.26, duration: 0.28, type: 'sine' },
  ],
  // Subtle tick for general interaction.
  click: [{ freq: 440, start: 0, duration: 0.05, type: 'square' }],
};

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ctxRef = useRef<globalThis.AudioContext | null>(null);

  useEffect(() => {
    // Ambient background track
    // Pointing to a local file avoids Pixabay CORS/hotlinking 403 errors.
    audioRef.current = new Audio('/audio/ambient.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.2; // Keep it ambient and low

    // Restore the saved sound-effects preference.
    try {
      const saved = localStorage.getItem(SOUND_PREF_KEY);
      if (saved !== null) setSoundEnabled(saved === 'true');
    } catch {
      // Ignore — default to enabled.
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (ctxRef.current) {
        ctxRef.current.close().catch(() => {});
        ctxRef.current = null;
      }
    };
  }, []);

  const toggleAudio = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(e => console.log('Audio playback prevented:', e));
      setIsPlaying(true);
    }
  };

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SOUND_PREF_KEY, String(next));
      } catch {
        // Ignore persistence failures.
      }
      return next;
    });
  }, []);

  const playSound = useCallback(
    (event: SoundEvent) => {
      if (!soundEnabled) return;
      const recipe = SOUND_RECIPES[event];
      if (!recipe) return;

      try {
        // Lazily create the AudioContext (must follow a user gesture).
        const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
        if (!Ctor) return;
        if (!ctxRef.current) ctxRef.current = new Ctor();
        const ctx = ctxRef.current;
        if (ctx.state === 'suspended') ctx.resume().catch(() => {});

        const now = ctx.currentTime;
        recipe.forEach((note) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = note.type;
          osc.frequency.value = note.freq;

          // Gentle attack/decay envelope so cues never click or startle.
          const startAt = now + note.start;
          const endAt = startAt + note.duration;
          gain.gain.setValueAtTime(0.0001, startAt);
          gain.gain.exponentialRampToValueAtTime(0.18, startAt + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, endAt);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(startAt);
          osc.stop(endAt + 0.02);
        });
      } catch {
        // Audio unsupported/blocked — fail silently.
      }
    },
    [soundEnabled]
  );

  return (
    <AudioContext.Provider value={{ isPlaying, toggleAudio, soundEnabled, toggleSound, playSound }}>
      {children}
    </AudioContext.Provider>
  );
};
