import { Button } from "@/components/ui/button";
import { DifficultyLevel } from "@/types";
import { useNavigate } from "react-router-dom";
import { BarChart3, Sparkles, Star, Activity, ArrowLeft, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { getStudent } from "@/utils/storage";
import { motion } from "framer-motion";

const GameLevels = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
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
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 100 }
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-[-5%] right-[-5%] w-[30%] h-[30%] bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-[-5%] left-[-5%] w-[30%] h-[30%] bg-mathBlue/5 rounded-full blur-3xl" />

      <header className="glass sticky top-0 z-50 p-4 border-b border-white/20">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/')}
                className="text-primary hover:bg-primary/10 mr-4 rounded-xl"
              >
                <ArrowLeft />
              </Button>
            </motion.div>
            <h1 className="text-2xl font-black text-slate-800">Escolha seu <span className="text-primary">Desafio</span></h1>
          </div>

          <div className="flex items-center gap-2 bg-white/50 px-4 py-1.5 rounded-full border border-white shadow-sm">
            <Trophy size={16} className="text-yellow-500" />
            <span className="text-sm font-bold text-slate-600">Nível Atual: Mestre</span>
          </div>
        </div>
      </header>

      <main className="flex-grow container py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto"
        >
          <div className="text-center mb-16">
            <motion.h2
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="text-4xl md:text-5xl font-black text-slate-800 mb-4"
            >
              Pronto para a <span className="premium-gradient bg-clip-text text-transparent italic">Batalha?</span>
            </motion.h2>
            <p className="text-xl text-slate-500 font-medium">Selecione o nível de dificuldade para começar sua jornada.</p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {/* Multiplication Card */}
            <motion.div
              variants={cardVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              className="relative group"
              onClick={() => handleSelectLevel('multiplication')}
            >
              <div className="absolute inset-0 bg-mathGreen/20 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative glass p-8 rounded-[2.5rem] border-white/60 shadow-xl cursor-pointer flex flex-col items-center h-full">
                <div className="rounded-3xl bg-mathGreen/10 w-24 h-24 flex items-center justify-center mb-6 border border-mathGreen/20 group-hover:bg-mathGreen group-hover:text-white transition-colors duration-500">
                  <Sparkles size={48} className="text-mathGreen group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-3xl font-black text-mathGreen mb-2">Multiplicação</h3>
                <p className="text-center text-slate-500 font-bold mb-8">
                  Tabuada completa de 1 a 10
                </p>
                <div className="mt-auto space-y-3 w-full">
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/50 border border-slate-100">
                    <Star size={18} className="text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-bold text-slate-600">Foco em memorização</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/50 border border-slate-100">
                    <Star size={18} className="text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-bold text-slate-600">Multiplicações rápidas</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Division Card */}
            <motion.div
              variants={cardVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              className="relative group"
              onClick={() => handleSelectLevel('division')}
            >
              <div className="absolute inset-0 bg-mathBlue/20 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative glass p-8 rounded-[2.5rem] border-white/60 shadow-xl cursor-pointer flex flex-col items-center h-full border-2 border-primary/20">
                <div className="absolute -top-4 bg-primary text-white text-xs font-black px-4 py-1 rounded-full shadow-lg">FUNDAMENTAL</div>
                <div className="rounded-3xl bg-mathBlue/10 w-24 h-24 flex items-center justify-center mb-6 border border-mathBlue/20 group-hover:bg-mathBlue group-hover:text-white transition-colors duration-500">
                  <BarChart3 size={48} className="text-mathBlue group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-3xl font-black text-mathBlue mb-2">Divisões</h3>
                <p className="text-center text-slate-500 font-bold mb-8">
                  Divisões exatas da tabuada
                </p>
                <div className="mt-auto space-y-3 w-full">
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/50 border border-slate-100">
                    <Star size={18} className="text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-bold text-slate-600">Raciocínio inverso</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/50 border border-slate-100">
                    <Star size={18} className="text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-bold text-slate-600">Divisores de 1 a 10</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 8th Grade Card */}
            <motion.div
              variants={cardVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              className="relative group"
              onClick={() => handleSelectLevel('hard')}
            >
              <div className="absolute inset-0 bg-mathRed/20 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative glass p-8 rounded-[2.5rem] border-white/60 shadow-xl cursor-pointer flex flex-col items-center h-full">
                <div className="rounded-3xl bg-mathRed/10 w-24 h-24 flex items-center justify-center mb-6 border border-mathRed/20 group-hover:bg-mathRed group-hover:text-white transition-colors duration-500">
                  <Activity size={48} className="text-mathRed group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-3xl font-black text-mathRed mb-2">8º Ano</h3>
                <p className="text-center text-slate-500 font-bold mb-8">
                  As quatro operações fundamentais
                </p>
                <div className="mt-auto space-y-3 w-full">
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/50 border border-slate-100">
                    <Star size={18} className="text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-bold text-slate-600">Cálculo mental rápido</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/50 border border-slate-100">
                    <Star size={18} className="text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-bold text-slate-600">Todas as operações</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Grade 9 Level Card */}
            <motion.div
              variants={cardVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              className="relative group"
              onClick={() => handleSelectLevel('grade9')}
            >
              <div className="absolute inset-0 bg-mathPurple/20 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative glass p-8 rounded-[2.5rem] border-white/60 shadow-xl cursor-pointer flex flex-col items-center h-full">
                <div className="rounded-3xl bg-mathPurple/10 w-24 h-24 flex items-center justify-center mb-6 border border-mathPurple/20 group-hover:bg-mathPurple group-hover:text-white transition-colors duration-500">
                  <Trophy size={48} className="text-mathPurple group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-3xl font-black text-mathPurple mb-2">9º Ano</h3>
                <p className="text-center text-slate-500 font-bold mb-8">
                  Nível de elite para o Ensino Fundamental
                </p>
                <div className="mt-auto space-y-3 w-full">
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/50 border border-slate-100">
                    <Star size={18} className="text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-bold text-slate-600">Potência & Raiz</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/50 border border-slate-100">
                    <Star size={18} className="text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-bold text-slate-600">Eq. de 1º Grau</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </main>

      <footer className="bg-white/50 backdrop-blur-sm py-8 border-t border-slate-100 mt-auto">
        <div className="container mx-auto text-center text-slate-400 font-bold text-sm">
          <p>Mestre da Matemática • Sua jornada rumo ao conhecimento começa aqui</p>
        </div>
      </footer>
    </div>
  );
};

export default GameLevels;
