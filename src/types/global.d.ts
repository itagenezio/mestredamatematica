interface GameAudio {
  playCorrect: () => void;
  playIncorrect: () => void;
}

declare global {
  interface Window {
    gameAudio: GameAudio;
  }
} 