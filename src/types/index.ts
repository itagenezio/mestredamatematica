
export type GradeLevel = 6 | 7 | 8 | 9;

export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
}

export type Student = {
  id: string;
  name: string;
  grade: GradeLevel;
  xp: number;
  totalGames: number;
  achievements: string[]; // IDs of unlocked achievements
  createdAt: Date;
}

export type DifficultyLevel = 'multiplication' | 'division' | 'hard' | 'grade9';

export type Operation = '+' | '-' | '*' | '/' | '^' | 'sqrt' | 'eq';

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
  xpEarned: number;
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
  xp: number;
  score: number;
  time: number;
  difficulty: DifficultyLevel;
}
