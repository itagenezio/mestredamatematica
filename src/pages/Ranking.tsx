
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Medal, Trophy, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getRankings, fetchRankingsFromSupabase } from "@/utils/storage";
import { GradeLevel, Ranking } from "@/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const RankingPage = () => {
  const navigate = useNavigate();
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel | 'all'>('all');
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Load rankings based on selected grade
  useEffect(() => {
    const loadRankings = async () => {
      setLoading(true);
      
      try {
        let filteredRankings: Ranking[];
        
        if (selectedGrade === 'all') {
          // Try to fetch from Supabase first, fall back to local storage
          filteredRankings = await fetchRankingsFromSupabase();
        } else {
          // Try to fetch from Supabase with grade filter, fall back to local storage
          filteredRankings = await fetchRankingsFromSupabase(selectedGrade);
        }
        
        if (filteredRankings.length === 0) {
          // If no results from Supabase, use local storage
          if (selectedGrade === 'all') {
            filteredRankings = getRankings();
          } else {
            filteredRankings = getRankings(selectedGrade);
          }
        }
        
        setRankings(filteredRankings);
      } catch (error) {
        console.error("Error loading rankings:", error);
        
        // Fall back to local storage
        if (selectedGrade === 'all') {
          setRankings(getRankings());
        } else {
          setRankings(getRankings(selectedGrade));
        }
      } finally {
        setLoading(false);
      }
    };
    
    loadRankings();
  }, [selectedGrade]);
  
  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Get medal color based on position
  const getMedalColor = (position: number) => {
    switch (position) {
      case 0: return "text-yellow-500"; // Gold
      case 1: return "text-gray-400"; // Silver
      case 2: return "text-amber-600"; // Bronze
      default: return "text-gray-300"; // Other
    }
  };

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
            <h1 className="text-2xl font-bold text-white">Ranking</h1>
          </div>
        </div>
      </header>

      {/* Ranking Content */}
      <main className="container py-8 flex-grow">
        <div className="max-w-3xl mx-auto">
          {/* Trophy Image */}
          <div className="flex justify-center mb-8">
            <div className="bg-gradient-to-r from-mathYellow/20 to-mathOrange/20 rounded-full p-6">
              <Trophy className="text-mathOrange h-16 w-16" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-center mb-8">
            Melhores <span className="text-mathOrange">Pontuações</span>
          </h2>
          
          {/* Grade Filter Tabs */}
          <Tabs 
            defaultValue="all" 
            value={selectedGrade.toString()} 
            onValueChange={(value) => setSelectedGrade(value === 'all' ? 'all' : Number(value) as GradeLevel)}
            className="w-full mb-6"
          >
            <TabsList className="grid grid-cols-5">
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="6">6º Ano</TabsTrigger>
              <TabsTrigger value="7">7º Ano</TabsTrigger>
              <TabsTrigger value="8">8º Ano</TabsTrigger>
              <TabsTrigger value="9">9º Ano</TabsTrigger>
            </TabsList>
          </Tabs>
          
          {/* Ranking List */}
          <Card>
            <CardHeader className="bg-gradient-to-r from-mathOrange/10 to-mathYellow/10 pb-2">
              <CardTitle className="flex items-center justify-center gap-2">
                <Trophy className="h-5 w-5" />
                <span>
                  {selectedGrade === 'all' 
                    ? 'Ranking Geral' 
                    : `Ranking do ${selectedGrade}º Ano`}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {loading ? (
                <div className="py-8 text-center">
                  <p className="text-gray-500">Carregando ranking...</p>
                </div>
              ) : rankings.length > 0 ? (
                <div className="space-y-3">
                  {/* Header Row */}
                  <div className="grid grid-cols-12 text-sm font-medium text-gray-500 border-b pb-2">
                    <div className="col-span-1 text-center">#</div>
                    <div className="col-span-5">Aluno</div>
                    <div className="col-span-2 text-center">Série</div>
                    <div className="col-span-2 text-center">Tempo</div>
                    <div className="col-span-2 text-right">Pontos</div>
                  </div>
                  
                  {rankings.slice(0, 20).map((ranking, index) => (
                    <div 
                      key={`${ranking.studentId}-${index}`}
                      className={`grid grid-cols-12 py-3 ${
                        index < 3 ? 'bg-gradient-to-r from-mathYellow/5 to-transparent' : ''
                      } ${
                        index % 2 === 0 ? 'bg-gray-50' : ''
                      } rounded-lg`}
                    >
                      <div className="col-span-1 flex justify-center items-center">
                        {index < 3 ? (
                          <Medal className={`h-5 w-5 ${getMedalColor(index)}`} />
                        ) : (
                          <span className="text-gray-500 font-medium">{index + 1}</span>
                        )}
                      </div>
                      <div className="col-span-5 font-medium flex items-center">
                        {ranking.studentName}
                      </div>
                      <div className="col-span-2 text-center flex items-center justify-center">
                        <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-sm">
                          {ranking.grade}º
                        </span>
                      </div>
                      <div className="col-span-2 text-center flex items-center justify-center">
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1 text-gray-400" />
                          {formatTime(ranking.time)}
                        </span>
                      </div>
                      <div className="col-span-2 text-right font-bold flex items-center justify-end">
                        {ranking.score}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-gray-500">
                  <p className="mb-4">Nenhum resultado registrado ainda.</p>
                  <Button 
                    onClick={() => navigate('/game-levels')} 
                    className="btn-primary"
                  >
                    Começar a Jogar
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white py-4 shadow-inner">
        <div className="container text-center text-muted-foreground">
          <p>Math Match Masters &copy; 2025 - Competição saudável!</p>
        </div>
      </footer>
    </div>
  );
};

export default RankingPage;
