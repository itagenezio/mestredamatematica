
import { Button } from "@/components/ui/button";
import { DifficultyLevel } from "@/types";
import { useNavigate } from "react-router-dom";
import { BarChart3, Sparkles, Star, Activity, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { getStudent } from "@/utils/storage";

const GameLevels = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const student = getStudent();
    if (!student) {
      navigate('/');
    } else {
      setIsLoggedIn(true);
    }
  }, [navigate]);

  const handleSelectLevel = (level: DifficultyLevel) => {
    navigate(`/game/${level}`);
  };

  if (!isLoggedIn) {
    return null; // Don't render anything while checking login state
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
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
            <h1 className="text-2xl font-bold text-white">Escolha um Nível</h1>
          </div>
        </div>
      </header>

      <main className="flex-grow container py-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">
            Selecione o Nível de <span className="text-primary">Dificuldade</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Easy Level Card */}
            <div 
              className="math-card cursor-pointer transform hover:-translate-y-2 transition-all hover:shadow-xl"
              onClick={() => handleSelectLevel('easy')}
            >
              <div className="rounded-full bg-softGreen mx-auto w-24 h-24 flex items-center justify-center mb-4">
                <Sparkles size={40} className="text-mathGreen" />
              </div>
              <h3 className="text-2xl font-bold text-center text-mathGreen mb-2">Fácil</h3>
              <p className="text-center text-gray-600 mb-4">
                Operações básicas com números menores que 20
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center">
                  <Star className="w-4 h-4 mr-2 text-mathGreen" />
                  <span>Adição e subtração simples</span>
                </li>
                <li className="flex items-center">
                  <Star className="w-4 h-4 mr-2 text-mathGreen" />
                  <span>Multiplicações até 5</span>
                </li>
                <li className="flex items-center">
                  <Star className="w-4 h-4 mr-2 text-mathGreen" />
                  <span>Divisões exatas simples</span>
                </li>
              </ul>
            </div>

            {/* Medium Level Card */}
            <div 
              className="math-card cursor-pointer transform hover:-translate-y-2 transition-all hover:shadow-xl"
              onClick={() => handleSelectLevel('medium')}
            >
              <div className="rounded-full bg-softBlue mx-auto w-24 h-24 flex items-center justify-center mb-4">
                <BarChart3 size={40} className="text-mathBlue" />
              </div>
              <h3 className="text-2xl font-bold text-center text-mathBlue mb-2">Médio</h3>
              <p className="text-center text-gray-600 mb-4">
                Operações com números até 50
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center">
                  <Star className="w-4 h-4 mr-2 text-mathBlue" />
                  <span>Adição e subtração com dezenas</span>
                </li>
                <li className="flex items-center">
                  <Star className="w-4 h-4 mr-2 text-mathBlue" />
                  <span>Multiplicações até 10</span>
                </li>
                <li className="flex items-center">
                  <Star className="w-4 h-4 mr-2 text-mathBlue" />
                  <span>Divisões com resto</span>
                </li>
              </ul>
            </div>

            {/* Hard Level Card */}
            <div 
              className="math-card cursor-pointer transform hover:-translate-y-2 transition-all hover:shadow-xl"
              onClick={() => handleSelectLevel('hard')}
            >
              <div className="rounded-full bg-softPink mx-auto w-24 h-24 flex items-center justify-center mb-4">
                <Activity size={40} className="text-mathRed" />
              </div>
              <h3 className="text-2xl font-bold text-center text-mathRed mb-2">Difícil</h3>
              <p className="text-center text-gray-600 mb-4">
                Operações com números até 100
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center">
                  <Star className="w-4 h-4 mr-2 text-mathRed" />
                  <span>Adições e subtrações complexas</span>
                </li>
                <li className="flex items-center">
                  <Star className="w-4 h-4 mr-2 text-mathRed" />
                  <span>Multiplicações de dois dígitos</span>
                </li>
                <li className="flex items-center">
                  <Star className="w-4 h-4 mr-2 text-mathRed" />
                  <span>Divisões complexas com resto</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white py-4 shadow-inner">
        <div className="container mx-auto text-center text-gray-500">
          <p>Math Match Masters - Escolha o nível adequado para seu conhecimento</p>
        </div>
      </footer>
    </div>
  );
};

export default GameLevels;
