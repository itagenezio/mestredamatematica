import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import GameLevels from "./pages/GameLevels";
import Game from "./pages/Game";
import Profile from "./pages/Profile";
import Ranking from "./pages/Ranking";
import TeacherDashboard from "./pages/TeacherDashboard";
import QwenTestPage from "./pages/QwenTestPage";
import QwenSimple from "./pages/QwenSimple";
import NotFound from "./pages/NotFound";
import ErrorBoundary from "@/components/ErrorBoundary";
import AchievementToast from "@/components/AchievementToast";
import { useEffect } from "react";
import { initOfflineSync } from "./utils/sync";
import { GameAudioProvider } from "./contexts/GameAudioContext";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    initOfflineSync();
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <GameAudioProvider>
            <Toaster />
            <Sonner />
            <AchievementToast />
            <HashRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/game-levels" element={<GameLevels />} />
                <Route path="/game/:level" element={<Game />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/ranking" element={<Ranking />} />
                <Route path="/teacher" element={<TeacherDashboard />} />
                <Route path="/qwen-simple" element={<QwenSimple />} />
                <Route path="/qwen-test" element={<QwenTestPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </HashRouter>
          </GameAudioProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;