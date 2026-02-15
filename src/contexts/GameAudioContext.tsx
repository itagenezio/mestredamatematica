import React, { createContext, useContext, useEffect, useRef } from 'react';

type AudioContextType = {
  playCorrect: () => void;
  playIncorrect: () => void;
  playCompletion: () => void;
  isMuted: boolean;
  toggleMute: () => void;
};

const GameAudioContext = createContext<AudioContextType | null>(null);

export const GameAudioProvider = ({ children }: { children: React.ReactNode }) => {
  const [isMuted, setIsMuted] = React.useState(() => {
    const saved = localStorage.getItem('gameMuted');
    return saved === 'true';
  });

  const correctSound = useRef<HTMLAudioElement | null>(null);
  const incorrectSound = useRef<HTMLAudioElement | null>(null);
  const completionSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    correctSound.current = new Audio('/sounds/correct.mp3');
    incorrectSound.current = new Audio('/sounds/incorrect.mp3');
    completionSound.current = new Audio('/sounds/final.mp3'); // We saw final.mp3 earlier

    correctSound.current.load();
    incorrectSound.current.load();
    completionSound.current.load();
  }, []);

  const toggleMute = () => {
    const newState = !isMuted;
    setIsMuted(newState);
    localStorage.setItem('gameMuted', String(newState));
  };

  const playSound = (audioRef: React.RefObject<HTMLAudioElement | null>) => {
    if (isMuted) return;
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.error("Erro ao tocar o som:", e));
    }
  };

  const playCorrect = () => playSound(correctSound);
  const playIncorrect = () => playSound(incorrectSound);
  const playCompletion = () => playSound(completionSound);

  return (
    <GameAudioContext.Provider value={{ playCorrect, playIncorrect, playCompletion, isMuted, toggleMute }}>
      {children}
    </GameAudioContext.Provider>
  );
};

export const useGameAudio = () => {
  const context = useContext(GameAudioContext);
  if (!context) {
    throw new Error('useGameAudio deve ser usado dentro de um GameAudioProvider');
  }
  return context;
};
