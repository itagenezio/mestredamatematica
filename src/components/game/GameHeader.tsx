import { ArrowLeft, Clock, CheckCircle, Star, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DifficultyLevel } from "@/types";
import { useGameAudio } from "@/contexts/GameAudioContext";

interface GameHeaderProps {
    difficulty: DifficultyLevel;
    onBack: () => void;
    correctCount: number;
    totalProblems: number;
    elapsedTime: number;
    formatTime: (seconds: number) => string;
    score: number;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
    difficulty,
    onBack,
    correctCount,
    totalProblems,
    elapsedTime,
    formatTime,
    score
}) => {
    const { isMuted, toggleMute } = useGameAudio();

    return (
        <header className="bg-gradient-to-r from-primary to-mathPurple p-4 shadow-md">
            <div className="container mx-auto">
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onBack}
                            className="text-white hover:bg-white/20 mr-2"
                        >
                            <ArrowLeft />
                        </Button>
                        <h1 className="text-xl md:text-2xl font-bold text-white">
                            Nível: {difficulty === 'easy' ? 'Fácil' : difficulty === 'medium' ? 'Médio' : 'Difícil'}
                        </h1>
                    </div>
                    <div className="flex items-center gap-2 md:gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleMute}
                            className="text-white hover:bg-white/20"
                            title={isMuted ? "Ativar som" : "Desativar som"}
                        >
                            {isMuted ? <VolumeX /> : <Volume2 />}
                        </Button>
                        <div className="flex items-center bg-white/20 rounded-lg px-3 py-1">
                            <Star className="text-yellow-300 mr-1 h-4 w-4" />
                            <span className="text-white font-bold">{score}</span>
                        </div>
                        <div className="flex items-center bg-white/20 rounded-lg px-3 py-1">
                            <CheckCircle className="text-white mr-1 h-4 w-4" />
                            <span className="text-white">
                                {correctCount}/{totalProblems}
                            </span>
                        </div>
                        <div className="flex items-center bg-white/20 rounded-lg px-3 py-1">
                            <Clock className="text-white mr-1 h-4 w-4" />
                            <span className="text-white">{formatTime(elapsedTime)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};
