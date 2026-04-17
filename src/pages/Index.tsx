import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  UserCircle,
  Play,
  LogOut,
  BookOpen,
  PlusCircle,
  Sparkles
} from "lucide-react";
import MathIllustration from "@/components/MathIllustration";
import { useEffect, useState } from "react";
import { Student } from "@/types";
import { getStudent } from "@/utils/storage";
import RegistrationModal from "@/components/RegistrationModal";
import { motion, AnimatePresence } from "framer-motion";

const Index = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [showRegistration, setShowRegistration] = useState(false);

  useEffect(() => {
    const loadedStudent = getStudent();
    if (loadedStudent) {
      setStudent(loadedStudent);
    } else {
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 100 }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-mathPurple/10 rounded-full blur-3xl animate-pulse" />

      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="glass sticky top-0 z-50 p-4 border-b border-white/20"
      >
        <div className="container flex justify-between items-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="p-2 bg-primary rounded-xl shadow-lg">
              <BookOpen className="text-white h-6 w-6" />
            </div>
            <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary to-mathPurple">
              Mestres da Matemática
            </h1>
          </motion.div>

          <AnimatePresence>
            {student && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-3 bg-white/40 backdrop-blur-sm py-1.5 px-4 rounded-full border border-white/50 shadow-sm"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-mathPurple rounded-full flex items-center justify-center text-white font-bold">
                  {student.name.charAt(0)}
                </div>
                <span className="text-foreground font-bold text-sm hidden sm:inline">
                  {student.name} • {student.grade}º Ano
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-grow container py-8 md:py-16 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center mb-12"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-wider mb-4 border border-primary/20">
            <Sparkles size={14} />
            Plataforma Educativa de Elite - VERSÃO 2.0 (ATUALIZADO)
          </motion.div>
          <motion.h2 variants={itemVariants} className="text-3xl md:text-5xl font-black text-slate-800 leading-tight">
            CENTRO DE EDUCAÇÃO INTEGRAL<br />
            <span className="text-primary">INOVAÇÃO E TECNOLOGIA</span>
          </motion.h2>
          <motion.p variants={itemVariants} className="text-lg text-slate-500 mt-4 font-medium italic">
            Projeto desenvolvido pelo Prof. Genezio de Lavor
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-primary/5 rounded-3xl blur-2xl transform -rotate-3" />
            <div className="relative glass p-8 rounded-[2rem] border-white/40">
              <MathIllustration />
            </div>
          </motion.div>

          {/* Right Column - Menu Buttons */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center lg:items-start gap-8"
          >
            <div className="space-y-4">
              <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-black text-slate-800 leading-tight text-center lg:text-left">
                Aprenda Matemática <br />
                <span className="premium-gradient bg-clip-text text-transparent italic">Brincando!</span>
              </motion.h2>

              <motion.p variants={itemVariants} className="text-xl text-slate-600 font-medium text-center lg:text-left max-w-md">
                Conecte operações matemáticas com suas respostas corretas e conquiste o topo do ranking!
              </motion.p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <motion.div variants={itemVariants} whileHover={{ y: -5 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={handleStartGame}
                  className="premium-gradient w-full h-20 rounded-2xl shadow-xl shadow-primary/20 flex flex-col items-center justify-center gap-1 border-none"
                >
                  <Play className="h-6 w-6 text-white" />
                  <span className="text-lg font-black text-white">JOGAR AGORA</span>
                </Button>
              </motion.div>

              <motion.div variants={itemVariants} whileHover={{ y: -5 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={() => navigate("/ranking")}
                  className="bg-white text-slate-800 hover:bg-slate-50 w-full h-20 rounded-2xl shadow-lg border border-slate-200 flex flex-col items-center justify-center gap-1"
                >
                  <Trophy className="h-6 w-6 text-yellow-500" />
                  <span className="text-lg font-black">RANKING</span>
                </Button>
              </motion.div>

              <motion.div variants={itemVariants} whileHover={{ y: -5 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={() => navigate("/profile")}
                  className="bg-white text-slate-800 hover:bg-slate-50 w-full h-20 rounded-2xl shadow-lg border border-slate-200 flex flex-col items-center justify-center gap-1"
                >
                  <UserCircle className="h-6 w-6 text-blue-500" />
                  <span className="text-lg font-black">MEU PERFIL</span>
                </Button>
              </motion.div>

              {!student ? (
                <motion.div variants={itemVariants} whileHover={{ y: -5 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={() => setShowRegistration(true)}
                    className="bg-mathRed text-white hover:bg-mathRed/90 w-full h-20 rounded-2xl shadow-lg flex flex-col items-center justify-center gap-1"
                  >
                    <PlusCircle className="h-6 w-6" />
                    <span className="text-lg font-black">CADASTRAR</span>
                  </Button>
                </motion.div>
              ) : (
                <motion.div variants={itemVariants} whileHover={{ y: -5 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={() => {
                      localStorage.removeItem('currentStudent');
                      setStudent(null);
                    }}
                    className="bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-500 w-full h-20 rounded-2xl shadow-lg border border-slate-200 flex flex-col items-center justify-center gap-1 transition-colors"
                  >
                    <LogOut className="h-6 w-6" />
                    <span className="text-lg font-black">SAIR</span>
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="bg-white/50 backdrop-blur-sm py-8 border-t border-slate-100 mt-auto"
      >
        <div className="container flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 font-bold text-sm">
          <p>© 2024 Ita Tecnologia Educacional</p>
          <div className="flex gap-6 items-center">
            <span className="hover:text-primary cursor-pointer transition-colors">SOBRE</span>
            <span className="hover:text-primary cursor-pointer transition-colors">CONTATO</span>
            <button
              onClick={() => navigate('/teacher')}
              className="px-4 py-1.5 rounded-full border border-slate-200 hover:border-primary hover:text-primary transition-all text-[10px] uppercase tracking-widest"
            >
              Acesso Docente
            </button>
          </div>
        </div>
      </motion.footer>

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
