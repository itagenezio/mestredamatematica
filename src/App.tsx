
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import GameLevels from "./pages/GameLevels";
import Game from "./pages/Game";
import Profile from "./pages/Profile";
import Ranking from "./pages/Ranking";
import NotFound from "./pages/NotFound";

// Audio files for game sounds
const correctSound = new Audio('/sounds/correct.mp3');
const incorrectSound = new Audio('/sounds/incorrect.mp3');

// Make audio available globally
window.gameAudio = {
  playCorrect: () => correctSound.play().catch(err => console.error("Audio error:", err)),
  playIncorrect: () => incorrectSound.play().catch(err => console.error("Audio error:", err))
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/game-levels" element={<GameLevels />} />
          <Route path="/game/:level" element={<Game />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/ranking" element={<Ranking />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
