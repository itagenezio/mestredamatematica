
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Clock, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DifficultyLevel, 
  MathProblem, 
  GameResult, 
  MatchConnection 
} from "@/types";
import { generateMathProblems } from "@/utils/mathProblems";
import { getStudent, saveGameResult } from "@/utils/storage";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import ResultsModal from "@/components/ResultsModal";

const Game = () => {
  const { level } = useParams<{ level: string }>();
  const navigate = useNavigate();
  const difficulty = (level as DifficultyLevel) || 'easy';
  
  const [problems, setProblems] = useState<MathProblem[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selectedProblem, setSelectedProblem] = useState<string | null>(null);
  const [connections, setConnections] = useState<MatchConnection[]>([]);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [gameCompleted, setGameCompleted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [showResults, setShowResults] = useState<boolean>(false);
  
  const svgRef = useRef<SVGSVGElement>(null);
  const timerRef = useRef<number | null>(null);

  // Set up the game
  useEffect(() => {
    const student = getStudent();
    if (!student) {
      navigate('/');
      return;
    }
    
    const generatedProblems = generateMathProblems(difficulty, 10);
    setProblems(generatedProblems);
    
    // Shuffle the answers
    const shuffledAnswers = [...generatedProblems.map(p => p.answer.toString())]
      .sort(() => Math.random() - 0.5);
    setAnswers(shuffledAnswers);
    
    setStartTime(Date.now());
    setConnections([]);
    setSelectedProblem(null);
    setGameCompleted(false);
    setScore(0);
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [difficulty, navigate]);
  
  // Start the timer
  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [startTime]);
  
  // Check if game is completed
  useEffect(() => {
    const correctConnections = connections.filter(c => c.isCorrect);
    
    if (correctConnections.length === problems.length && problems.length > 0) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      const totalTime = Math.floor((Date.now() - startTime) / 1000);
      const correctCount = correctConnections.length;
      
      // Calculate score based on difficulty, time, and correct answers
      let baseScore = 0;
      switch (difficulty) {
        case 'easy': baseScore = 100; break;
        case 'medium': baseScore = 200; break;
        case 'hard': baseScore = 300; break;
      }
      
      // Faster completion gives better score, max time bonus is the base score
      const timeBonus = Math.max(0, baseScore - Math.floor(totalTime / 2));
      const calculatedScore = (correctCount * baseScore) + timeBonus;
      
      setScore(calculatedScore);
      setGameCompleted(true);
      
      // Save the result
      const student = getStudent();
      if (student) {
        const gameResult: GameResult = {
          id: Date.now().toString(),
          studentId: student.id,
          difficulty,
          correctAnswers: correctCount,
          totalTime,
          score: calculatedScore,
          createdAt: new Date()
        };
        
        saveGameResult(gameResult);
        
        // Show results modal after a short delay
        setTimeout(() => {
          setShowResults(true);
        }, 1000);
      }
    }
  }, [connections, problems, difficulty, startTime]);
  
  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Handle problem selection
  const handleProblemSelect = (problemId: string) => {
    // Don't allow selection if the problem is already connected correctly
    const alreadyConnected = connections.find(c => c.problemId === problemId && c.isCorrect);
    if (alreadyConnected) return;
    
    // Toggle selection
    setSelectedProblem(selectedProblem === problemId ? null : problemId);
  };
  
  // Handle answer selection
  const handleAnswerSelect = (answerValue: string) => {
    if (!selectedProblem) return;
    
    // Find the selected problem
    const problem = problems.find(p => p.id === selectedProblem);
    if (!problem) return;
    
    // Check if this answer is correct for the selected problem
    const isCorrect = problem.answer.toString() === answerValue;
    
    // Remove any existing connection for this problem
    const updatedConnections = connections.filter(c => c.problemId !== selectedProblem);
    
    // Add the new connection
    updatedConnections.push({
      problemId: selectedProblem,
      answerId: answerValue,
      isCorrect
    });
    
    // Play the appropriate sound
    if (isCorrect) {
      window.gameAudio.playCorrect();
    } else {
      window.gameAudio.playIncorrect();
    }
    
    setConnections(updatedConnections);
    setSelectedProblem(null);
  };
  
  // Calculate line coordinates between problem and answer
  const getLineCoordinates = (problemId: string, answerValue: string) => {
    if (!svgRef.current) return { x1: 0, y1: 0, x2: 0, y2: 0 };
    
    const problemElement = document.getElementById(`problem-${problemId}`);
    const answerElement = document.getElementById(`answer-${answerValue}`);
    
    if (!problemElement || !answerElement) return { x1: 0, y1: 0, x2: 0, y2: 0 };
    
    const svgRect = svgRef.current.getBoundingClientRect();
    const problemRect = problemElement.getBoundingClientRect();
    const answerRect = answerElement.getBoundingClientRect();
    
    return {
      x1: problemRect.right - svgRect.left,
      y1: problemRect.top + problemRect.height / 2 - svgRect.top,
      x2: answerRect.left - svgRect.left,
      y2: answerRect.top + answerRect.height / 2 - svgRect.top
    };
  };
  
  // Get the appropriate line class based on connection status
  const getLineClass = (connection: MatchConnection) => {
    return connection.isCorrect ? "line-correct" : "line-incorrect";
  };
  
  // Check if a problem has a correct connection
  const isProblemCorrectlyConnected = (problemId: string) => {
    return connections.some(c => c.problemId === problemId && c.isCorrect);
  };
  
  // Check if an answer has a correct connection
  const isAnswerCorrectlyConnected = (answerValue: string) => {
    return connections.some(c => c.answerId === answerValue && c.isCorrect);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-mathPurple p-4 shadow-md">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate('/game-levels')}
                className="text-white hover:bg-white/20 mr-2"
              >
                <ArrowLeft />
              </Button>
              <h1 className="text-2xl font-bold text-white">
                Nível: {difficulty === 'easy' ? 'Fácil' : difficulty === 'medium' ? 'Médio' : 'Difícil'}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-white/20 rounded-lg px-3 py-1">
                <CheckCircle className="text-white mr-1 h-4 w-4" />
                <span className="text-white">
                  {connections.filter(c => c.isCorrect).length}/{problems.length}
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
          <div className="w-1/2 pr-8 flex flex-col justify-center items-end">
            {problems.map((problem) => {
              const isConnected = isProblemCorrectlyConnected(problem.id);
              return (
                <Tooltip key={problem.id}>
                  <TooltipTrigger asChild>
                    <div 
                      id={`problem-${problem.id}`}
                      className={`${
                        isConnected ? 'bg-softGreen' : 
                        selectedProblem === problem.id ? 'bg-primary/10 border-primary' : 'bg-white'
                      } rounded-lg p-4 mb-4 border-2 shadow-sm hover:shadow-md transition-all cursor-pointer w-full max-w-xs`}
                      onClick={() => handleProblemSelect(problem.id)}
                    >
                      <div className="text-xl font-bold text-center">
                        {problem.problem}
                      </div>
                      {isConnected && (
                        <div className="mt-1 flex justify-center">
                          <CheckCircle className="text-mathGreen h-5 w-5" />
                        </div>
                      )}
                    </div>
                  </TooltipTrigger>
                  {isConnected && (
                    <TooltipContent>
                      <p>Operação já conectada!</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              );
            })}
          </div>

          {/* SVG for connection lines */}
          <div className="absolute inset-0 pointer-events-none">
            <svg ref={svgRef} className="w-full h-full">
              {connections.map((connection) => {
                const problem = problems.find(p => p.id === connection.problemId);
                if (!problem) return null;
                
                const coords = getLineCoordinates(connection.problemId, connection.answerId);
                
                return (
                  <line
                    key={`${connection.problemId}-${connection.answerId}`}
                    x1={coords.x1}
                    y1={coords.y1}
                    x2={coords.x2}
                    y2={coords.y2}
                    className={`line ${getLineClass(connection)}`}
                    strokeWidth={connection.isCorrect ? 4 : 3}
                  />
                );
              })}
              
              {selectedProblem && (
                <line
                  x1={getLineCoordinates(selectedProblem, "").x1}
                  y1={getLineCoordinates(selectedProblem, "").y1}
                  x2={getLineCoordinates(selectedProblem, "").x1 + 30}
                  y2={getLineCoordinates(selectedProblem, "").y1}
                  className="line"
                  strokeDasharray="5,5"
                  strokeWidth="2"
                />
              )}
            </svg>
          </div>

          {/* Answers (right column) */}
          <div className="w-1/2 pl-8 flex flex-col justify-center items-start">
            {answers.map((answer) => {
              const isConnected = isAnswerCorrectlyConnected(answer);
              return (
                <Tooltip key={answer}>
                  <TooltipTrigger asChild>
                    <div 
                      id={`answer-${answer}`}
                      className={`${
                        isConnected ? 'bg-softGreen' : 
                        selectedProblem ? 'bg-white hover:bg-primary/10 hover:border-primary' : 'bg-white'
                      } rounded-lg p-4 mb-4 border-2 shadow-sm hover:shadow-md transition-all ${
                        selectedProblem ? 'cursor-pointer' : 'cursor-default'
                      } w-full max-w-xs`}
                      onClick={() => selectedProblem && handleAnswerSelect(answer)}
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

      {/* Results Modal */}
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
