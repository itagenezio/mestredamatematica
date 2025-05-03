
export type GradeLevel = 6 | 7 | 8 | 9;

export type Student = {
  id: string;
  name: string;
  grade: GradeLevel;
  createdAt: Date;
}

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export type Operation = '+' | '-' | '*' | '/';

export type MathProblem = {
  id: string;
  problem: string;
  answer: number;
  operator: Operation;
}

export type GameResult = {
  id: string;
  studentId: string;
  difficulty: DifficultyLevel;
  correctAnswers: number;
  totalTime: number;
  score: number;
  createdAt: Date;
}

export type MatchConnection = {
  problemId: string;
  answerId: string;
  isCorrect: boolean;
}

export interface Ranking {
  studentId: string;
  studentName: string;
  grade: GradeLevel;
  score: number;
  time: number;
  difficulty: DifficultyLevel;
}
