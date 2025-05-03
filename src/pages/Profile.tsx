
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Medal, Clock, BarChart4, Award, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getStudent, getStudentResults } from "@/utils/storage";
import { GameResult, Student } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const Profile = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [results, setResults] = useState<GameResult[]>([]);
  
  useEffect(() => {
    const loadedStudent = getStudent();
    if (!loadedStudent) {
      navigate('/');
      return;
    }
    
    setStudent(loadedStudent);
    const studentResults = getStudentResults(loadedStudent.id);
    setResults(studentResults);
  }, [navigate]);
  
  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Calculate stats
  const totalGames = results.length;
  const totalCorrectAnswers = results.reduce((sum, result) => sum + result.correctAnswers, 0);
  const totalPossibleAnswers = results.length * 10; // Each game has 10 problems
  const averageAccuracy = totalPossibleAnswers > 0 
    ? Math.round((totalCorrectAnswers / totalPossibleAnswers) * 100) 
    : 0;
  const totalScore = results.reduce((sum, result) => sum + result.score, 0);
  const averageTime = results.length > 0 
    ? Math.round(results.reduce((sum, result) => sum + result.totalTime, 0) / results.length) 
    : 0;
  
  // Get best result by difficulty
  const getBestResultByDifficulty = (difficulty: string) => {
    const filteredResults = results.filter(result => result.difficulty === difficulty);
    if (filteredResults.length === 0) return null;
    
    return filteredResults.reduce((best, current) => {
      if (current.score > best.score) return current;
      if (current.score === best.score && current.totalTime < best.totalTime) return current;
      return best;
    }, filteredResults[0]);
  };
  
  const bestEasy = getBestResultByDifficulty('easy');
  const bestMedium = getBestResultByDifficulty('medium');
  const bestHard = getBestResultByDifficulty('hard');

  if (!student) {
    return null; // Don't render if student is not loaded
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-mathPurple p-4 shadow-md">
        <div className="container mx-auto">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/')}
              className="text-white hover:bg-white/20 mr-4"
            >
              <ArrowLeft />
            </Button>
            <h1 className="text-2xl font-bold text-white">Meu Perfil</h1>
          </div>
        </div>
      </header>

      {/* Profile Content */}
      <main className="container py-8 flex-grow">
        <div className="max-w-4xl mx-auto">
          {/* Student Info */}
          <Card className="mb-8 border-none shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/20 to-mathPurple/20 rounded-t-lg">
              <CardTitle className="text-2xl">{student.name}</CardTitle>
              <CardDescription>
                {student.grade}º Ano • Registro: {new Date(student.createdAt).toLocaleDateString('pt-BR')}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-softPink rounded-lg p-3 text-center">
                  <BarChart4 className="h-5 w-5 mx-auto mb-1 text-mathRed" />
                  <div className="text-sm text-gray-500">Jogos</div>
                  <div className="text-xl font-bold">{totalGames}</div>
                </div>
                
                <div className="bg-softBlue rounded-lg p-3 text-center">
                  <Medal className="h-5 w-5 mx-auto mb-1 text-mathBlue" />
                  <div className="text-sm text-gray-500">Precisão</div>
                  <div className="text-xl font-bold">{averageAccuracy}%</div>
                </div>
                
                <div className="bg-softGreen rounded-lg p-3 text-center">
                  <Clock className="h-5 w-5 mx-auto mb-1 text-mathGreen" />
                  <div className="text-sm text-gray-500">Tempo Médio</div>
                  <div className="text-xl font-bold">{formatTime(averageTime)}</div>
                </div>
                
                <div className="bg-softYellow rounded-lg p-3 text-center">
                  <Award className="h-5 w-5 mx-auto mb-1 text-mathYellow" />
                  <div className="text-sm text-gray-500">Pontuação</div>
                  <div className="text-xl font-bold">{totalScore}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Tabs */}
          <Tabs defaultValue="best" className="w-full">
            <TabsList className="grid grid-cols-2 mb-8">
              <TabsTrigger value="best">Melhores Resultados</TabsTrigger>
              <TabsTrigger value="history">Histórico de Jogos</TabsTrigger>
            </TabsList>
            
            <TabsContent value="best">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Easy */}
                <Card className={`border-2 ${bestEasy ? 'border-mathGreen/20' : 'border-gray-200'}`}>
                  <CardHeader className="bg-softGreen pb-2">
                    <CardTitle className="flex items-center gap-2 text-mathGreen">
                      <BarChart size={18} />
                      <span>Fácil</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    {bestEasy ? (
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Pontuação:</span>
                          <span className="font-bold">{bestEasy.score}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Acertos:</span>
                          <span className="font-bold">{bestEasy.correctAnswers}/10</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Tempo:</span>
                          <span className="font-bold">{formatTime(bestEasy.totalTime)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Data:</span>
                          <span className="font-bold">{new Date(bestEasy.createdAt).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        Você ainda não jogou este nível
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Medium */}
                <Card className={`border-2 ${bestMedium ? 'border-mathBlue/20' : 'border-gray-200'}`}>
                  <CardHeader className="bg-softBlue pb-2">
                    <CardTitle className="flex items-center gap-2 text-mathBlue">
                      <BarChart size={18} />
                      <span>Médio</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    {bestMedium ? (
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Pontuação:</span>
                          <span className="font-bold">{bestMedium.score}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Acertos:</span>
                          <span className="font-bold">{bestMedium.correctAnswers}/10</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Tempo:</span>
                          <span className="font-bold">{formatTime(bestMedium.totalTime)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Data:</span>
                          <span className="font-bold">{new Date(bestMedium.createdAt).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        Você ainda não jogou este nível
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Hard */}
                <Card className={`border-2 ${bestHard ? 'border-mathRed/20' : 'border-gray-200'}`}>
                  <CardHeader className="bg-softPink pb-2">
                    <CardTitle className="flex items-center gap-2 text-mathRed">
                      <BarChart size={18} />
                      <span>Difícil</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    {bestHard ? (
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Pontuação:</span>
                          <span className="font-bold">{bestHard.score}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Acertos:</span>
                          <span className="font-bold">{bestHard.correctAnswers}/10</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Tempo:</span>
                          <span className="font-bold">{formatTime(bestHard.totalTime)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Data:</span>
                          <span className="font-bold">{new Date(bestHard.createdAt).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        Você ainda não jogou este nível
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="history">
              {results.length > 0 ? (
                <div className="space-y-4">
                  {results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((result) => (
                    <Card key={result.id} className="overflow-hidden">
                      <div className={`h-2 ${
                        result.difficulty === 'easy' ? 'bg-mathGreen' :
                        result.difficulty === 'medium' ? 'bg-mathBlue' :
                        'bg-mathRed'
                      }`}></div>
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-bold">
                              Nível: {result.difficulty === 'easy' ? 'Fácil' : result.difficulty === 'medium' ? 'Médio' : 'Difícil'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(result.createdAt).toLocaleDateString('pt-BR')} • {formatTime(result.totalTime)}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold">{result.score} pts</div>
                            <div className="text-sm text-gray-500">{result.correctAnswers}/10 acertos</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-8 text-center text-gray-500">
                    <div className="mb-3">Você ainda não tem resultados registrados.</div>
                    <Button onClick={() => navigate('/game-levels')} className="btn-primary">
                      Começar a Jogar
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white py-4 shadow-inner">
        <div className="container text-center text-muted-foreground">
          <p>Math Match Masters &copy; 2025</p>
        </div>
      </footer>
    </div>
  );
};

export default Profile;
