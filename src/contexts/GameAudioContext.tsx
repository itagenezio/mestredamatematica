import React, { createContext, useContext, useEffect, useRef } from 'react';

type AudioContextType = {
  playCorrect: () => void;
  playIncorrect: () => void;
  playCompletion: () => void;
  isMuted: boolean;
  toggleMute: () => void;
};

const defaultContext: AudioContextType = {
  playCorrect: () => {},
  playIncorrect: () => {},
  playCompletion: () => {},
  isMuted: false,
  toggleMute: () => {},
};

const GameAudioContext = createContext<AudioContextType>(defaultContext);

export const GameAudioProvider = ({ children }: { children: React.ReactNode }) => {
  const [isMuted, setIsMuted] = React.useState(() => {
    try {
      const saved = localStorage.getItem('gameMuted');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const correctSound = useRef<HTMLAudioElement | null>(null);
  const incorrectSound = useRef<HTMLAudioElement | null>(null);
  const completionSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const loadAudio = (path: string) => {
      const audio = new Audio(window.location.origin + path);
      audio.preload = "auto";
      audio.load();
      return audio;
    };

    correctSound.current = loadAudio('/sounds/correct.mp3');
    incorrectSound.current = loadAudio('/sounds/incorrect.mp3');
    completionSound.current = loadAudio('/sounds/final.mp3');
  }, []);

  const playSound = (audioRef: React.MutableRefObject<HTMLAudioElement | null>) => {
    if (isMuted) return;

    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;

        audioRef.current.play().catch(error => {
          console.log("Erro ao tocar áudio:", error);
        });
      }
    } catch (e) {
      console.error("Erro ao tentar tocar som:", e);
    }
  };

  const playCorrect = () => playSound(correctSound);
  const playIncorrect = () => playSound(incorrectSound);
  const playCompletion = () => playSound(completionSound);

  const toggleMute = () => {
    const newState = !isMuted;
    setIsMuted(newState);
    try {
      localStorage.setItem('gameMuted', String(newState));
    } catch {}
  };

  return (
    <GameAudioContext.Provider
      value={{ playCorrect, playIncorrect, playCompletion, isMuted, toggleMute }}
    >
      {children}
    </GameAudioContext.Provider>
  );
};

export const useGameAudio = () => {
  return useContext(GameAudioContext);
};
