
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DifficultyLevel } from "@/types";
import { Award, Clock, Star, TrendingUp } from "lucide-react";
import confetti from "canvas-confetti";
import { useEffect, useState } from "react";

interface ResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  correctAnswers: number;
  totalProblems: number;
  time: number;
  score: number;
  difficulty: DifficultyLevel;
}

const ResultsModal: React.FC<ResultsModalProps> = ({
  isOpen,
  onClose,
  correctAnswers,
  totalProblems,
  time,
  score,
  difficulty
}) => {
  const [isSaving, setIsSaving] = useState(false);
  
  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Trigger confetti on modal open if score is good
  useEffect(() => {
    if (isOpen && correctAnswers >= totalProblems * 0.7) {
      const end = Date.now() + 1000;
      
      const colors = ['#9b87f5', '#1EAEDB', '#F97316', '#10B981'];
      
      (function frame() {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors
        });
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors
        });
        
        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    }
  }, [isOpen, correctAnswers, totalProblems]);
  
  // Calculate performance text based on correct answers
  const getPerformanceText = () => {
    const percentage = (correctAnswers / totalProblems) * 100;
    
    if (percentage === 100) return "Perfeito! Você é um mestre da matemática!";
    if (percentage >= 80) return "Excelente trabalho! Você está no caminho certo!";
    if (percentage >= 60) return "Bom trabalho! Continue praticando!";
    if (percentage >= 40) return "Continue tentando. Você pode melhorar!";
    return "Não desista! A prática leva à perfeição!";
  };
  
  // Play sounds based on performance
  useEffect(() => {
    if (isOpen) {
      if (correctAnswers === totalProblems) {
        window.gameAudio?.playCorrect();
      } else if (correctAnswers >= totalProblems * 0.7) {
        window.gameAudio?.playCorrect();
      } else {
        window.gameAudio?.playIncorrect();
      }
    }
  }, [isOpen, correctAnswers, totalProblems]);
  
  const handleContinue = () => {
    setIsSaving(false);
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleContinue()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            <div className="text-2xl font-bold">Resultados</div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="mb-6 text-center">
            <div className="mx-auto w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-2">
              <Award className={`h-10 w-10 ${correctAnswers === totalProblems ? "text-mathYellow animate-celebrate" : "text-primary"}`} />
            </div>
            <h3 className="text-xl font-bold">
              {getPerformanceText()}
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-softPink rounded-lg p-3 text-center">
              <Star className="h-5 w-5 mx-auto mb-1 text-mathRed" />
              <div className="text-sm text-gray-500">Acertos</div>
              <div className="text-xl font-bold">{correctAnswers}/{totalProblems}</div>
            </div>
            
            <div className="bg-softBlue rounded-lg p-3 text-center">
              <Clock className="h-5 w-5 mx-auto mb-1 text-mathBlue" />
              <div className="text-sm text-gray-500">Tempo</div>
              <div className="text-xl font-bold">{formatTime(time)}</div>
            </div>
            
            <div className="bg-softYellow rounded-lg p-3 text-center col-span-2">
              <TrendingUp className="h-5 w-5 mx-auto mb-1 text-mathYellow" />
              <div className="text-sm text-gray-500">Pontuação Total</div>
              <div className="text-2xl font-bold animate-pop">{score}</div>
            </div>
          </div>

          <div className="text-center text-sm text-gray-500 mb-4">
            Dificuldade: <span className="font-medium">{
              difficulty === 'easy' ? 'Fácil' : 
              difficulty === 'medium' ? 'Médio' : 
              'Difícil'
            }</span>
          </div>
        </div>
        
        <DialogFooter>
          <div className="w-full flex flex-col sm:flex-row gap-2 justify-center">
            <Button 
              onClick={handleContinue} 
              className="btn-primary w-full" 
              disabled={isSaving}
            >
              {isSaving ? 'Salvando...' : 'Continuar'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResultsModal;
