'use client';

import React, { createContext, useContext } from 'react';

export type SoundEvent = 'correct' | 'wrong' | 'hint' | 'complete' | 'click';

interface AudioContextType {
  isPlaying: boolean;
  toggleAudio: () => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  playSound: (event?: SoundEvent) => void;
}

const noop = () => {};

const AudioContext = createContext<AudioContextType>({
  isPlaying: false,
  toggleAudio: noop,
  soundEnabled: false,
  toggleSound: noop,
  playSound: noop,
});

export const useAudio = () => useContext(AudioContext);

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <AudioContext.Provider
      value={{
        isPlaying: false,
        toggleAudio: noop,
        soundEnabled: false,
        toggleSound: noop,
        playSound: noop,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};
