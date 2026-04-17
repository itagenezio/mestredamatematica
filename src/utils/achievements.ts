import { Achievement, Student, GameResult } from "../types";

export const ALL_ACHIEVEMENTS: Achievement[] = [
    {
        id: "first_game",
        title: "Primeiro Passo",
        description: "Concluiu sua primeira batalha matemática!",
        icon: "🚀"
    },
    {
        id: "perfectionist",
        title: "Perfeccionista",
        description: "Acertou todas as questões em uma partida fácil.",
        icon: "💎"
    },
    {
        id: "speedster",
        title: "Velocista",
        description: "Terminou uma partida em menos de 30 segundos.",
        icon: "⚡"
    },
    {
        id: "math_master",
        title: "Mestre dos Cálculos",
        description: "Venceu uma partida no nível Difícil.",
        icon: "🧠"
    },
    {
        id: "xp_collector",
        title: "Colecionador de XP",
        description: "Alcançou 1000 pontos de XP total.",
        icon: "💰"
    },
    {
        id: "marathoner",
        title: "Maratonista",
        description: "Concluiu 10 partidas totais.",
        icon: "🏃"
    }
];

export const checkNewAchievements = (student: Student, lastResult: GameResult): Achievement[] => {
    const newAchievements: Achievement[] = [];
    const currentIds = student.achievements || [];

    // Check: Primeiro Passo
    if (!currentIds.includes("first_game")) {
        newAchievements.push(ALL_ACHIEVEMENTS.find(a => a.id === "first_game")!);
    }

    // Check: Perfeccionista
    if (!currentIds.includes("perfectionist") && lastResult.correctAnswers === 10 && lastResult.difficulty === "easy") {
        newAchievements.push(ALL_ACHIEVEMENTS.find(a => a.id === "perfectionist")!);
    }

    // Check: Velocista
    if (!currentIds.includes("speedster") && lastResult.totalTime < 30) {
        newAchievements.push(ALL_ACHIEVEMENTS.find(a => a.id === "speedster")!);
    }

    // Check: Mestre dos Cálculos
    if (!currentIds.includes("math_master") && lastResult.difficulty === "hard" && lastResult.correctAnswers >= 8) {
        newAchievements.push(ALL_ACHIEVEMENTS.find(a => a.id === "math_master")!);
    }

    // Check: XP Collector
    if (!currentIds.includes("xp_collector") && student.xp + lastResult.xpEarned >= 1000) {
        newAchievements.push(ALL_ACHIEVEMENTS.find(a => a.id === "xp_collector")!);
    }

    // Check: Maratonista
    if (!currentIds.includes("marathoner") && student.totalGames + 1 >= 10) {
        newAchievements.push(ALL_ACHIEVEMENTS.find(a => a.id === "marathoner")!);
    }

    return newAchievements;
};
