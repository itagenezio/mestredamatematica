import { supabase } from "@/integrations/supabase/client";
import { getGameResults, getStudent, saveStudent } from "./storage";

export const syncOfflineData = async () => {
    console.log("Iniciando sincronização de dados offline...");

    // 1. Sincronizar Estudante Atual
    const student = getStudent();
    if (student) {
        try {
            const { error } = await supabase.from('students').upsert({
                id: student.id,
                name: student.name,
                grade: student.grade.toString(),
                total_xp: student.xp,
                total_games: student.totalGames,
                achievements: student.achievements,
                updated_at: new Date().toISOString()
            });
            if (!error) console.log("Estudante sincronizado com sucesso.");
        } catch (e) {
            console.error("Falha ao sincronizar estudante:", e);
        }
    }

    // 2. Sincronizar Resultados de Jogos (Apenas os que faltam)
    // Nota: Em um sistema real, poderíamos ter uma flag 'synced' no GameResult.
    // Aqui, o Supabase já ignora duplicatas se o ID for o mesmo (Primary Key).
    const results = getGameResults();
    if (results.length > 0) {
        try {
            const formattedResults = results.map(r => ({
                id: r.id,
                student_id: r.studentId,
                difficulty: r.difficulty,
                correct_answers: r.correctAnswers,
                total_time: r.totalTime,
                score: r.score,
                xp_earned: r.xpEarned,
                created_at: r.createdAt.toISOString()
            }));

            const { error } = await supabase.from('game_results').upsert(formattedResults);
            if (!error) console.log(`${results.length} resultados sincronizados.`);
        } catch (e) {
            console.error("Falha ao sincronizar resultados:", e);
        }
    }
};

// Listener para reconexão
export const initOfflineSync = () => {
    window.addEventListener('online', syncOfflineData);

    // Tentar sincronizar ao abrir o app se estiver online
    if (navigator.onLine) {
        syncOfflineData();
    }
};
