
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Trophy, 
  UserCircle, 
  Play, 
  LogOut,
  BookOpen,
  PlusCircle
} from "lucide-react";
import MathIllustration from "@/components/MathIllustration";
import { useEffect, useState } from "react";
import { Student } from "@/types";
import { getStudent } from "@/utils/storage";
import RegistrationModal from "@/components/RegistrationModal";

const Index = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [showRegistration, setShowRegistration] = useState(false);

  useEffect(() => {
    // Check if a student is registered
    const loadedStudent = getStudent();
    if (loadedStudent) {
      setStudent(loadedStudent);
    } else {
      // Show registration modal if no student is found
      setShowRegistration(true);
    }
  }, []);

  const handleStartGame = () => {
    if (student) {
      navigate("/game-levels");
    } else {
      setShowRegistration(true);
    }
  };

  const handleRegistrationComplete = (newStudent: Student) => {
    setStudent(newStudent);
    setShowRegistration(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-mathPurple p-4 shadow-lg">
        <div className="container flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BookOpen className="text-white h-8 w-8" />
            <h1 className="text-2xl font-bold text-white">Math Match Masters</h1>
          </div>
          {student && (
            <div className="flex items-center gap-2 bg-white/20 py-1 px-3 rounded-full">
              <UserCircle className="text-white" />
              <span className="text-white font-medium">
                {student.name} - {student.grade}º Ano
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container py-8 md:py-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground">EEB PROFESSOR PEDRO TEIXEIRA BARROSO</h2>
          <p className="text-lg text-muted-foreground mt-2">PROJETO DESENVOLVIDO pelo Prof. Genezio de Lavor</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Column - Illustration */}
          <div className="flex justify-center">
            <MathIllustration />
          </div>

          {/* Right Column - Menu Buttons */}
          <div className="flex flex-col items-center md:items-start gap-6">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Aprenda Matemática <span className="text-primary">Brincando!</span>
            </h2>
            
            <p className="text-lg text-muted-foreground mb-6 text-center md:text-left">
              Conecte operações matemáticas com suas respostas corretas e veja seu progresso!
            </p>

            <div className="space-y-4 w-full max-w-sm">
              <Button 
                onClick={handleStartGame}
                className="btn-primary w-full flex justify-between items-center py-6"
              >
                <Play className="mr-2" />
                <span className="flex-grow text-left text-lg">Jogar</span>
              </Button>
              
              <Button 
                onClick={() => navigate("/ranking")} 
                className="btn-secondary w-full flex justify-between items-center py-6"
              >
                <Trophy className="mr-2" />
                <span className="flex-grow text-left text-lg">Ranking</span>
              </Button>
              
              <Button 
                onClick={() => navigate("/profile")} 
                className="w-full flex justify-between items-center py-6 bg-white text-primary hover:bg-primary/10"
              >
                <UserCircle className="mr-2" />
                <span className="flex-grow text-left text-lg">Meu Perfil</span>
              </Button>

              {!student ? (
                <Button 
                  onClick={() => setShowRegistration(true)} 
                  className="w-full flex justify-between items-center py-6 bg-softPink text-mathRed hover:bg-softPink/80"
                >
                  <PlusCircle className="mr-2" />
                  <span className="flex-grow text-left text-lg">Cadastrar</span>
                </Button>
              ) : (
                <Button 
                  onClick={() => {
                    localStorage.removeItem('currentStudent');
                    setStudent(null);
                  }} 
                  className="w-full flex justify-between items-center py-6 bg-white text-mathRed hover:bg-softPink"
                >
                  <LogOut className="mr-2" />
                  <span className="flex-grow text-left text-lg">Sair</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white py-4 shadow-inner">
        <div className="container text-center text-muted-foreground">
          <p>Ita Tecnologia Educacional / Clube de Robotica Criativa de Itapipoca</p>
        </div>
      </footer>

      {/* Registration Modal */}
      <RegistrationModal 
        isOpen={showRegistration} 
        onClose={() => setShowRegistration(false)}
        onComplete={handleRegistrationComplete}
      />
    </div>
  );
};

export default Index;
