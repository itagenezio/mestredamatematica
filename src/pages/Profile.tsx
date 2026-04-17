
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
          <Card className="mb-8 border-none shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/20 to-mathPurple/20 rounded-t-lg">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-3xl font-black text-slate-800">{student.name}</CardTitle>
                  <CardDescription className="font-bold text-primary/70">
                    {student.grade}º Ano • Registro: {new Date(student.createdAt).toLocaleDateString('pt-BR')}
                  </CardDescription>
                </div>
                <div className="bg-white/50 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white shadow-sm">
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">XP Total</div>
                  <div className="text-2xl font-black text-primary">{student.xp || 0}</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#f0f9ff] rounded-2xl p-4 text-center border border-blue-100">
                  <BarChart4 className="h-6 w-6 mx-auto mb-1 text-blue-500" />
                  <div className="text-xs font-bold text-slate-500 uppercase">Jogos</div>
                  <div className="text-2xl font-black text-slate-800">{totalGames}</div>
                </div>

                <div className="bg-[#f0fdf4] rounded-2xl p-4 text-center border border-emerald-100">
                  <Medal className="h-6 w-6 mx-auto mb-1 text-emerald-500" />
                  <div className="text-xs font-bold text-slate-500 uppercase">Precisão</div>
                  <div className="text-2xl font-black text-slate-800">{averageAccuracy}%</div>
                </div>

                <div className="bg-[#fdf4ff] rounded-2xl p-4 text-center border border-purple-100">
                  <Clock className="h-6 w-6 mx-auto mb-1 text-purple-500" />
                  <div className="text-xs font-bold text-slate-500 uppercase">Média</div>
                  <div className="text-2xl font-black text-slate-800">{formatTime(averageTime)}</div>
                </div>

                <div className="bg-[#fffbeb] rounded-2xl p-4 text-center border border-amber-100">
                  <Award className="h-6 w-6 mx-auto mb-1 text-amber-500" />
                  <div className="text-xs font-bold text-slate-500 uppercase">Pontos</div>
                  <div className="text-2xl font-black text-slate-800">{totalScore}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Tabs */}
          <Tabs defaultValue="best" className="w-full">
            <TabsList className="grid grid-cols-3 mb-8 bg-slate-100 p-1 rounded-2xl">
              <TabsTrigger value="best" className="rounded-xl font-bold">Recordes</TabsTrigger>
              <TabsTrigger value="achievements" className="rounded-xl font-bold">Conquistas</TabsTrigger>
              <TabsTrigger value="history" className="rounded-xl font-bold">Histórico</TabsTrigger>
            </TabsList>

            <TabsContent value="achievements">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {/* Dynamically checking ACHIEVEMENTS */}
                {(() => {
                  const { ALL_ACHIEVEMENTS } = require("../utils/achievements");
                  return ALL_ACHIEVEMENTS.map((ach: any) => {
                    const isUnlocked = student.achievements?.includes(ach.id);
                    return (
                      <Card key={ach.id} className={`border-none shadow-sm transition-all ${isUnlocked ? 'bg-white' : 'bg-slate-50 opacity-60'}`}>
                        <CardContent className="p-6 flex flex-col items-center text-center">
                          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-3 shadow-md border-2 ${isUnlocked ? 'bg-gradient-to-br from-yellow-400 to-amber-600 border-white/50 text-white' : 'bg-slate-200 border-slate-300 grayscale text-slate-400'}`}>
                            {ach.icon}
                          </div>
                          <h4 className={`font-black text-sm mb-1 ${isUnlocked ? 'text-slate-800' : 'text-slate-400'}`}>{ach.title}</h4>
                          <p className="text-[10px] font-medium text-slate-400 leading-tight">{ach.description}</p>
                        </CardContent>
                      </Card>
                    );
                  });
                })()}
              </div>
            </TabsContent>

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
                        <div className={`h-2 ${result.difficulty === 'easy' ? 'bg-mathGreen' :
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
