import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle } from "lucide-react";
import { DifficultyLevel } from "@/types";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import ResultsModal from "@/components/ResultsModal";
import { useGameLogic } from "@/hooks/useGameLogic";
import { GameHeader } from "@/components/game/GameHeader";
import { ConnectionLines } from "@/components/game/ConnectionLines";

const Game = () => {
  const { level } = useParams<{ level: string }>();
  const navigate = useNavigate();
  const difficulty = (level as DifficultyLevel) || 'easy';

  const {
    problems,
    answers,
    selectedProblem,
    connections,
    elapsedTime,
    score,
    showResults,
    setShowResults,
    handleProblemSelect,
    handleAnswerSelect,
  } = useGameLogic(difficulty);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Check if a problem has a correct connection
  const isProblemCorrectlyConnected = (problemId: string) => {
    return connections.some(c => c.problemId === problemId && c.isCorrect);
  };

  // Check if an answer has a correct connection
  const isAnswerCorrectlyConnected = (answerValue: string) => {
    return connections.some(c => c.answerId === answerValue && c.isCorrect);
  };

  const fireConfetti = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 30,
      spread: 50,
      origin: { x, y },
      colors: ['#4ade80', '#22c55e', '#16a34a'] // Green shades
    });
  };

  const onAnswerClick = (answer: string, event: React.MouseEvent | React.KeyboardEvent) => {
    if (selectedProblem) {
      const isCorrect = handleAnswerSelect(answer);
      if (isCorrect) {
        const target = event.currentTarget as HTMLElement;
        fireConfetti(target);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-mathPurple/5 rounded-full blur-3xl" />

      <GameHeader
        difficulty={difficulty}
        onBack={() => navigate('/game-levels')}
        correctCount={connections.filter(c => c.isCorrect).length}
        totalProblems={problems.length}
        elapsedTime={elapsedTime}
        formatTime={formatTime}
        score={score}
      />

      {/* Game Board */}
      <main className="container py-8 flex-grow flex flex-col relative z-10 scale-95 md:scale-100 origin-top">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-black text-slate-800 mb-2">
            Conecte as Operações
          </h2>
          <p className="text-slate-500 font-bold">
            Associe os desafios às respostas corretas para vencer
          </p>
        </div>

        <div className="relative flex-grow flex items-center">
          {/* Problems (left column) */}
          <div className="w-1/2 pr-4 md:pr-12 flex flex-col justify-center items-end" role="group" aria-label="Operações Matemáticas">
            {problems.map((problem) => {
              const connection = connections.find(c => c.problemId === problem.id);
              const isConnected = !!connection;
              const isCorrect = connection?.isCorrect;
              const isSelected = selectedProblem === problem.id;

              return (
                <Tooltip key={problem.id}>
                  <TooltipTrigger asChild>
                    <motion.div
                      id={`problem-${problem.id}`}
                      role="button"
                      whileHover={isConnected ? {} : { scale: 1.05 }}
                      whileTap={isConnected ? {} : { scale: 0.95 }}
                      tabIndex={isConnected ? -1 : 0}
                      className={`${isCorrect ? 'bg-mathGreen text-white' :
                        isConnected ? 'bg-mathRed text-white opacity-60' :
                        isSelected ? 'bg-white border-primary shadow-lg ring-2 ring-primary ring-offset-2 scale-105' : 
                        'bg-white/80 border-slate-200'
                        } rounded-2xl p-5 mb-5 shadow-lg border-2 transition-all cursor-pointer w-full max-w-xs focus:outline-none backdrop-blur-md`}
                      onClick={() => handleProblemSelect(problem.id)}
                    >
                      <div className="text-xl md:text-2xl font-black text-center tracking-tight">
                        {problem.problem}
                      </div>
                      {isConnected && (
                        <div className="mt-2 flex justify-center">
                          {isCorrect ? (
                            <CheckCircle className="text-white h-6 w-6" />
                          ) : (
                            <XCircle className="text-white h-6 w-6" />
                          )}
                        </div>
                      )}
                    </motion.div>
                  </TooltipTrigger>
                  {isConnected && (
                    <TooltipContent>
                      <p>{isCorrect ? "Operação conectada!" : "Resposta incorreta!"}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              );
            })}
          </div>

          <ConnectionLines
            connections={connections}
            problems={problems}
            selectedProblem={selectedProblem}
          />

          {/* Answers (right column) */}
          <div className="w-1/2 pl-4 md:pl-12 flex flex-col justify-center items-start" role="group" aria-label="Respostas">
            {answers.map((answer) => {
              const isConnected = isAnswerCorrectlyConnected(answer);
              return (
                <Tooltip key={answer}>
                  <TooltipTrigger asChild>
                    <motion.div
                      id={`answer-${answer}`}
                      role="button"
                      whileHover={isConnected ? {} : { scale: 1.05 }}
                      whileTap={isConnected ? {} : { scale: 0.95 }}
                      tabIndex={isConnected ? -1 : 0}
                      className={`${isConnected ? 'bg-mathGreen text-white' :
                        selectedProblem ? 'bg-white hover:border-primary border-slate-200 shadow-xl' : 'bg-white/80 border-slate-200'
                        } rounded-2xl p-5 mb-5 border-2 shadow-lg transition-all ${selectedProblem ? 'cursor-pointer' : 'cursor-default'
                        } w-full max-w-xs focus:outline-none backdrop-blur-md`}
                      onClick={(e) => onAnswerClick(answer, e)}
                    >
                      <div className="text-xl md:text-2xl font-black text-center">{answer}</div>
                      {isConnected && (
                        <div className="mt-2 flex justify-center">
                          <CheckCircle className="text-white h-6 w-6" />
                        </div>
                      )}
                    </motion.div>
                  </TooltipTrigger>
                  {isConnected && (
                    <TooltipContent>
                      <p>Resposta já conectada!</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              );
            })}
          </div>
        </div>
      </main>

      <ResultsModal
        isOpen={showResults}
        onClose={() => {
          setShowResults(false);
          navigate('/game-levels');
        }}
        correctAnswers={connections.filter(c => c.isCorrect).length}
        totalProblems={problems.length}
        time={elapsedTime}
        score={score}
        difficulty={difficulty}
      />
    </div>
  );
};

export default Game;
