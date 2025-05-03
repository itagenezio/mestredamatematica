
import { Student, GameResult, Ranking } from "../types";

// Student
export const saveStudent = (student: Student): void => {
  localStorage.setItem('currentStudent', JSON.stringify(student));
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
export const saveGameResult = (result: GameResult): void => {
  const results = getGameResults();
  results.push(result);
  localStorage.setItem('gameResults', JSON.stringify(results));
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
