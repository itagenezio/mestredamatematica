
import { Student, GameResult, Ranking } from "../types";
import { supabase } from "@/integrations/supabase/client";

// Student
export const saveStudent = async (student: Student): Promise<void> => {
  // Save locally for offline use
  localStorage.setItem('currentStudent', JSON.stringify(student));
  
  try {
    // Save to Supabase
    const { error } = await supabase.from('students').insert({
      id: student.id,
      name: student.name,
      grade: student.grade.toString(),
      created_at: new Date().toISOString()
    });
    
    if (error) {
      console.error('Error saving student to Supabase:', error);
    }
  } catch (err) {
    console.error('Failed to save student to Supabase:', err);
    // Continue with local storage only
  }
  
  // Also save to local collection for ranking display
  saveStudentToCollection(student);
};

export const getStudent = (): Student | null => {
  const studentJson = localStorage.getItem('currentStudent');
  if (!studentJson) return null;
  
  const student = JSON.parse(studentJson);
  return {
    ...student,
    createdAt: new Date(student.createdAt)
  };
};

// Game Results
export const saveGameResult = async (result: GameResult): Promise<void> => {
  // Save locally
  const results = getGameResults();
  results.push(result);
  localStorage.setItem('gameResults', JSON.stringify(results));
  
  try {
    // Save to Supabase
    const { error } = await supabase.from('game_results').insert({
      id: result.id,
      student_id: result.studentId,
      difficulty: result.difficulty,
      correct_answers: result.correctAnswers,
      total_time: result.totalTime,
      score: result.score,
      created_at: new Date().toISOString()
    });
    
    if (error) {
      console.error('Error saving game result to Supabase:', error);
    }
  } catch (err) {
    console.error('Failed to save game result to Supabase:', err);
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
  const results = getGameResults();
  const rankings: Ranking[] = [];
  
  results.forEach(result => {
    const student = getStudentById(result.studentId);
    if (!student) return;
    
    // Filter by grade if provided
    if (grade !== undefined && student.grade !== grade) return;
    
    rankings.push({
      studentId: student.id,
      studentName: student.name,
      grade: student.grade,
      score: result.score,
      time: result.totalTime,
      difficulty: result.difficulty
    });
  });
  
  // Sort by score (descending) and time (ascending)
  return rankings.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.time - b.time;
  });
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
    let query = supabase
      .from('game_results')
      .select(`
        id,
        score,
        total_time,
        difficulty,
        students (
          id,
          name,
          grade
        )
      `);
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching rankings from Supabase:', error);
      return getRankings(grade); // Fall back to local storage
    }
    
    if (!data) {
      return getRankings(grade);
    }
    
    const rankings: Ranking[] = data
      .filter(item => item.students && (!grade || item.students.grade === grade.toString()))
      .map(item => ({
        studentId: item.students.id,
        studentName: item.students.name,
        grade: parseInt(item.students.grade) as any,
        score: item.score,
        time: item.total_time,
        difficulty: item.difficulty as any
      }));

    // Sort rankings
    return rankings.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.time - b.time;
    });
  } catch (err) {
    console.error('Failed to fetch rankings from Supabase:', err);
    return getRankings(grade); // Fall back to local storage
  }
};
