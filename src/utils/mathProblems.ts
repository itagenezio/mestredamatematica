
import { DifficultyLevel, MathProblem, Operation } from "../types";

// Generate a random number between min and max (inclusive)
const getRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Generate a random operation
const getRandomOperation = (difficulty: DifficultyLevel): Operation => {
  const operations: Operation[] = ['+', '-', '*', '/'];
  let weights: number[];
  
  switch (difficulty) {
    case 'easy':
      weights = [40, 40, 15, 5]; // Higher weights for addition and subtraction
      break;
    case 'medium':
      weights = [30, 30, 25, 15]; // Balanced weights
      break;
    case 'hard':
      weights = [20, 20, 30, 30]; // Higher weights for multiplication and division
      break;
    default:
      weights = [25, 25, 25, 25]; // Equal weights
  }
  
  // Calculate total weight
  const totalWeight = weights.reduce((acc, w) => acc + w, 0);
  
  // Generate a random number between 0 and totalWeight
  const random = Math.random() * totalWeight;
  
  // Determine which operation was "hit" by the random number
  let weightSum = 0;
  for (let i = 0; i < operations.length; i++) {
    weightSum += weights[i];
    if (random < weightSum) {
      return operations[i];
    }
  }
  
  // Fallback to addition
  return '+';
};

// Generate a math problem based on difficulty and operation
const generateProblem = (difficulty: DifficultyLevel, operation: Operation): MathProblem => {
  let num1: number;
  let num2: number;
  let answer: number;
  let problem: string;
  let id = Date.now().toString() + Math.random().toString(36).substring(2, 8);
  
  switch (operation) {
    case '+':
      if (difficulty === 'easy') {
        num1 = getRandomNumber(1, 10);
        num2 = getRandomNumber(1, 10);
      } else if (difficulty === 'medium') {
        num1 = getRandomNumber(5, 25);
        num2 = getRandomNumber(5, 25);
      } else {
        num1 = getRandomNumber(10, 50);
        num2 = getRandomNumber(10, 50);
      }
      answer = num1 + num2;
      problem = `${num1} + ${num2} = ?`;
      break;
      
    case '-':
      if (difficulty === 'easy') {
        num2 = getRandomNumber(1, 10);
        num1 = getRandomNumber(num2, 15); // Ensure num1 > num2 to avoid negative results
      } else if (difficulty === 'medium') {
        num2 = getRandomNumber(5, 20);
        num1 = getRandomNumber(num2, 35);
      } else {
        num2 = getRandomNumber(10, 30);
        num1 = getRandomNumber(num2, 70);
      }
      answer = num1 - num2;
      problem = `${num1} - ${num2} = ?`;
      break;
      
    case '*':
      if (difficulty === 'easy') {
        num1 = getRandomNumber(1, 5);
        num2 = getRandomNumber(1, 5);
      } else if (difficulty === 'medium') {
        num1 = getRandomNumber(2, 10);
        num2 = getRandomNumber(2, 10);
      } else {
        num1 = getRandomNumber(5, 12);
        num2 = getRandomNumber(5, 12);
      }
      answer = num1 * num2;
      problem = `${num1} × ${num2} = ?`;
      break;
      
    case '/':
      if (difficulty === 'easy') {
        num2 = getRandomNumber(1, 5);
        num1 = num2 * getRandomNumber(1, 5); // Ensure clean division
      } else if (difficulty === 'medium') {
        num2 = getRandomNumber(2, 10);
        num1 = num2 * getRandomNumber(1, 8);
      } else {
        num2 = getRandomNumber(2, 12);
        num1 = num2 * getRandomNumber(1, 10);
      }
      answer = num1 / num2;
      problem = `${num1} ÷ ${num2} = ?`;
      break;
      
    default:
      // Fallback to addition
      num1 = getRandomNumber(1, 10);
      num2 = getRandomNumber(1, 10);
      answer = num1 + num2;
      problem = `${num1} + ${num2} = ?`;
  }
  
  return {
    id,
    problem,
    answer,
    operator: operation
  };
};

// Generate a set of unique math problems
export const generateMathProblems = (difficulty: DifficultyLevel, count: number): MathProblem[] => {
  const problems: MathProblem[] = [];
  const usedProblems = new Set<string>();
  
  while (problems.length < count) {
    // Choose a random operation based on difficulty
    const operation = getRandomOperation(difficulty);
    
    // Generate a problem
    const problem = generateProblem(difficulty, operation);
    
    // Check if this problem (or an equivalent) already exists
    const problemKey = `${problem.problem}-${problem.answer}`;
    if (!usedProblems.has(problemKey)) {
      usedProblems.add(problemKey);
      problems.push(problem);
    }
  }
  
  return problems;
};
