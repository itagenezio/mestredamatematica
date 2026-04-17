
import { Student, GameResult, Ranking } from "../types";
import { supabase } from "@/integrations/supabase/client";

// Student
export const saveStudent = async (student: Student): Promise<void> => {
  // Ensure default values
  const updatedStudent = {
    ...student,
    xp: student.xp || 0,
    totalGames: student.totalGames || 0,
    achievements: student.achievements || [],
  };

  // Save locally for offline use
  localStorage.setItem('currentStudent', JSON.stringify(updatedStudent));
  saveStudentToCollection(updatedStudent);

  try {
    // Save to Supabase (Upsert)
    const { error } = await supabase.from('students').upsert({
      id: updatedStudent.id,
      name: updatedStudent.name,
      grade: updatedStudent.grade.toString(),
      total_xp: updatedStudent.xp,
      total_games: updatedStudent.totalGames,
      achievements: updatedStudent.achievements,
      updated_at: new Date().toISOString()
    });

    if (error) console.error('Error syncing student with Supabase:', error);
  } catch (err) {
    console.error('Offline mode: student saved locally only.');
  }
};

export const getStudent = (): Student | null => {
  const studentJson = localStorage.getItem('currentStudent');
  if (!studentJson) return null;

  const student = JSON.parse(studentJson);
  return {
    ...student,
    xp: student.xp || 0,
    totalGames: student.totalGames || 0,
    achievements: student.achievements || [],
    createdAt: new Date(student.createdAt)
  };
};

// Game Results
export const saveGameResult = async (result: GameResult): Promise<void> => {
  // 1. Get current student and update their stats
  const student = getStudent();
  if (student) {
    student.xp += result.xpEarned;
    student.totalGames += 1;

    // Check for new achievements (imported dynamically to avoid circular deps if any)
    const { checkNewAchievements } = await import("./achievements");
    const newAchievements = checkNewAchievements(student, result);

    if (newAchievements.length > 0) {
      student.achievements = [...(student.achievements || []), ...newAchievements.map(a => a.id)];
      // Trigger a custom event for the UI to show achievement toast
      window.dispatchEvent(new CustomEvent('new-achievements', { detail: newAchievements }));
    }

    await saveStudent(student);
  }

  // 2. Save result locally
  const results = getGameResults();
  results.push(result);
  localStorage.setItem('gameResults', JSON.stringify(results));

  try {
    // 3. Save to Supabase
    const { error } = await supabase.from('game_results').insert({
      id: result.id,
      student_id: result.studentId,
      difficulty: result.difficulty,
      correct_answers: result.correctAnswers,
      total_time: result.totalTime,
      score: result.score,
      xp_earned: result.xpEarned,
      created_at: new Date().toISOString()
    });

    if (error) console.error('Error saving game result to Supabase:', error);
  } catch (err) {
    console.error('Offline mode: result saved locally only.');
  }
};

export const getGameResults = (): GameResult[] => {
  const resultsJson = localStorage.getItem('gameResults');
  if (!resultsJson) return [];

  const results = JSON.parse(resultsJson);
  return results.map((result: GameResult) => ({
    ...result,
    createdAt: new Date(result.createdAt)
  }));
};

export const getStudentResults = (studentId: string): GameResult[] => {
  const allResults = getGameResults();
  return allResults.filter(result => result.studentId === studentId);
};

// Rankings
export const getRankings = (grade?: number): Ranking[] => {
  const allStudentsJson = localStorage.getItem('allStudents');
  if (!allStudentsJson) return [];

  const allStudents: Student[] = JSON.parse(allStudentsJson);
  const rankings: Ranking[] = allStudents
    .filter(s => grade === undefined || s.grade === grade)
    .map(s => {
      const results = getStudentResults(s.id);
      const bestResult = results.sort((a, b) => b.score - a.score)[0];

      return {
        studentId: s.id,
        studentName: s.name,
        grade: s.grade,
        xp: s.xp || 0,
        score: bestResult?.score || 0,
        time: bestResult?.totalTime || 0,
        difficulty: bestResult?.difficulty || 'easy'
      };
    });

  return rankings.sort((a, b) => b.xp - a.xp); // Sort by total XP primarily
};

// Helper function to get student by ID
export const getStudentById = (id: string): Student | null => {
  const allStudentsJson = localStorage.getItem('allStudents');
  if (!allStudentsJson) {
    const currentStudent = getStudent();
    return currentStudent && currentStudent.id === id ? currentStudent : null;
  }

  const allStudents: Student[] = JSON.parse(allStudentsJson);
  const student = allStudents.find(s => s.id === id);
  return student || null;
};

// Save student in all students collection
export const saveStudentToCollection = (student: Student): void => {
  const allStudentsJson = localStorage.getItem('allStudents');
  let allStudents: Student[] = allStudentsJson ? JSON.parse(allStudentsJson) : [];

  const existingIndex = allStudents.findIndex(s => s.id === student.id);
  if (existingIndex >= 0) {
    allStudents[existingIndex] = student;
  } else {
    allStudents.push(student);
  }

  localStorage.setItem('allStudents', JSON.stringify(allStudents));
};

// Function to fetch rankings from Supabase
export const fetchRankingsFromSupabase = async (grade?: number): Promise<Ranking[]> => {
  try {
    const { data: studentsData, error: sError } = await supabase
      .from('students')
      .select('id, name, grade, total_xp')
      .order('total_xp', { ascending: false });

    if (sError) throw sError;

    const rankings: Ranking[] = studentsData
      .filter(s => !grade || s.grade === grade.toString())
      .map(s => ({
        studentId: s.id,
        studentName: s.name,
        grade: parseInt(s.grade) as any,
        xp: s.total_xp || 0,
        score: 0, // In this view we focus on XP
        time: 0,
        difficulty: 'easy'
      }));

    return rankings;
  } catch (err) {
    console.error('Supabase fetch failed, falling back to local rankings');
    return getRankings(grade);
  }
};
