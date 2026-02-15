import confetti from "canvas-confetti";
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
    <div className="min-h-screen flex flex-col bg-background">
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
      <main className="container py-8 flex-grow flex flex-col">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold">
            Conecte as operações às respostas corretas
          </h2>
          <p className="text-gray-600">
            Clique em uma operação e depois na resposta correspondente
          </p>
        </div>

        <div className="relative flex-grow flex">
          {/* Problems (left column) */}
          <div className="w-1/2 pr-8 flex flex-col justify-center items-end" role="group" aria-label="Operações Matemáticas">
            {problems.map((problem) => {
              const connection = connections.find(c => c.problemId === problem.id);
              const isConnected = !!connection;
              const isCorrect = connection?.isCorrect;
              const isSelected = selectedProblem === problem.id;

              return (
                <Tooltip key={problem.id}>
                  <TooltipTrigger asChild>
                    <div
                      id={`problem-${problem.id}`}
                      role="button"
                      tabIndex={isConnected ? -1 : 0}
                      aria-label={`Operação: ${problem.problem}`}
                      aria-pressed={isSelected}
                      aria-disabled={isConnected}
                      className={`${isCorrect ? 'bg-softGreen animate-pop' :
                        isConnected ? 'bg-softRed' :
                          isSelected ? 'bg-primary/10 border-2 border-primary ring-2 ring-primary ring-offset-2' : 'bg-white border-2'
                        } rounded-lg p-4 mb-4 shadow-sm hover:shadow-md transition-all cursor-pointer w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
                      onClick={() => handleProblemSelect(problem.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleProblemSelect(problem.id);
                        }
                      }}
                    >
                      <div className="text-xl font-bold text-center">
                        {problem.problem}
                      </div>
                      {isConnected && (
                        <div className="mt-1 flex justify-center">
                          {isCorrect ? (
                            <CheckCircle className="text-mathGreen h-5 w-5" />
                          ) : (
                            <XCircle className="text-mathRed h-5 w-5" />
                          )}
                        </div>
                      )}
                    </div>
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
          <div className="w-1/2 pl-8 flex flex-col justify-center items-start" role="group" aria-label="Respostas">
            {answers.map((answer) => {
              const isConnected = isAnswerCorrectlyConnected(answer);
              return (
                <Tooltip key={answer}>
                  <TooltipTrigger asChild>
                    <div
                      id={`answer-${answer}`}
                      role="button"
                      tabIndex={isConnected ? -1 : 0}
                      aria-label={`Resposta: ${answer}`}
                      aria-disabled={isConnected}
                      className={`${isConnected ? 'bg-softGreen animate-pop' :
                        selectedProblem ? 'bg-white hover:bg-primary/10 hover:border-primary' : 'bg-white'
                        } rounded-lg p-4 mb-4 border-2 shadow-sm hover:shadow-md transition-all ${selectedProblem ? 'cursor-pointer' : 'cursor-default'
                        } w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
                      onClick={(e) => onAnswerClick(answer, e)}
                      onKeyDown={(e) => {
                        if ((e.key === 'Enter' || e.key === ' ') && selectedProblem) {
                          e.preventDefault();
                          onAnswerClick(answer, e);
                        }
                      }}
                    >
                      <div className="text-xl font-bold text-center">{answer}</div>
                      {isConnected && (
                        <div className="mt-1 flex justify-center">
                          <CheckCircle className="text-mathGreen h-5 w-5" />
                        </div>
                      )}
                    </div>
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
