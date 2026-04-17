import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Sparkles } from 'lucide-react';
import { Achievement } from '@/types';
import confetti from 'canvas-confetti';

const AchievementToast = () => {
    const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
    const [queue, setQueue] = useState<Achievement[]>([]);

    useEffect(() => {
        const handleNewAchievement = (e: any) => {
            const achievements = e.detail as Achievement[];
            setQueue(prev => [...prev, ...achievements]);
        };

        window.addEventListener('new-achievements', handleNewAchievement);
        return () => window.removeEventListener('new-achievements', handleNewAchievement);
    }, []);

    useEffect(() => {
        if (!currentAchievement && queue.length > 0) {
            const next = queue[0];
            setQueue(prev => prev.slice(1));
            setCurrentAchievement(next);

            // Efeito de confete
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#6366f1', '#a855f7', '#ec4899']
            });

            // Tocar som se possível
            try {
                const audio = new Audio('/sounds/achievement.mp3');
                audio.volume = 0.5;
                audio.play().catch(() => { });
            } catch (e) { }

            // Fecha após 5 segundos
            setTimeout(() => {
                setCurrentAchievement(null);
            }, 5000);
        }
    }, [queue, currentAchievement]);

    return (
        <AnimatePresence>
            {currentAchievement && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 50, x: '-50%' }}
                    animate={{ opacity: 1, scale: 1, y: 0, x: '-50%' }}
                    exit={{ opacity: 0, scale: 0.8, y: -20, x: '-50%' }}
                    className="fixed bottom-10 left-1/2 z-[100] w-[90%] max-w-md"
                >
                    <div className="glass-dark p-1 rounded-3xl overflow-hidden shadow-2xl border-2 border-primary/50">
                        <div className="bg-gradient-to-br from-primary/20 via-mathPurple/20 to-mathPink/20 p-6 rounded-[calc(1.5rem-2px)] flex items-center gap-6">
                            <div className="relative">
                                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg border-2 border-white/30 rotate-12">
                                    {currentAchievement.icon || '🏆'}
                                </div>
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="absolute -top-3 -right-3 text-yellow-300"
                                >
                                    <Sparkles size={24} />
                                </motion.div>
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-yellow-400 font-black text-xs uppercase tracking-widest">Nova Medalha!</span>
                                    <div className="h-1 w-1 rounded-full bg-white/30" />
                                    <Trophy size={14} className="text-yellow-400" />
                                </div>
                                <h3 className="text-white font-black text-xl leading-tight">
                                    {currentAchievement.title}
                                </h3>
                                <p className="text-white/70 text-sm font-medium mt-1">
                                    {currentAchievement.description}
                                </p>
                            </div>
                        </div>

                        {/* Barra de progresso visual de tempo */}
                        <motion.div
                            initial={{ width: '100%' }}
                            animate={{ width: '0%' }}
                            transition={{ duration: 5, ease: "linear" }}
                            className="h-1 bg-primary shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AchievementToast;
