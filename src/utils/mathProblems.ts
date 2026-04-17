
import { DifficultyLevel, MathProblem, Operation } from "../types";

// Generate a random number between min and max (inclusive)
const getRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Generate a random operation
const getRandomOperation = (difficulty: DifficultyLevel): Operation => {
  const operations: Operation[] = ['+', '-', '*', '/', '^', 'sqrt', 'eq'];
  let weights: number[];
  
  switch (difficulty) {
    case 'multiplication':
      weights = [0, 0, 100, 0, 0, 0, 0]; // Only multiplication
      break;
    case 'division':
      weights = [0, 0, 0, 100, 0, 0, 0]; // Only division
      break;
    case 'hard':
      weights = [25, 25, 25, 25, 0, 0, 0]; // The four operations
      break;
    case 'grade9':
      weights = [0, 0, 0, 30, 25, 25, 20]; // Division, Power, Root, and Equation
      break;
    default:
      weights = [25, 25, 25, 25, 0, 0, 0];
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
      } else if (difficulty === 'hard') {
        num1 = getRandomNumber(10, 50);
        num2 = getRandomNumber(10, 50);
      } else {
        num1 = getRandomNumber(20, 100);
        num2 = getRandomNumber(20, 100);
      }
      answer = num1 + num2;
      problem = `${num1} + ${num2} = ?`;
      break;
      
    case '-':
      if (difficulty === 'easy') {
        num2 = getRandomNumber(1, 10);
        num1 = getRandomNumber(num2, 15); // Ensure positive
      } else if (difficulty === 'medium') {
        num2 = getRandomNumber(5, 20);
        num1 = getRandomNumber(num2, 35);
      } else if (difficulty === 'hard') {
        num2 = getRandomNumber(10, 30);
        num1 = getRandomNumber(num2, 70);
      } else {
        num1 = getRandomNumber(10, 100);
        num2 = getRandomNumber(10, 100); // Can be negative result
      }
      answer = num1 - num2;
      problem = `${num1} - ${num2} = ?`;
      break;
      
    case '*':
      if (difficulty === 'multiplication') {
        num1 = getRandomNumber(1, 10);
        num2 = getRandomNumber(1, 10);
      } else if (difficulty === 'hard') {
        num1 = getRandomNumber(2, 12);
        num2 = getRandomNumber(2, 10);
      } else {
        num1 = getRandomNumber(5, 20);
        num2 = getRandomNumber(2, 15);
      }
      answer = num1 * num2;
      problem = `${num1} × ${num2} = ?`;
      break;
      
    case '/':
      if (difficulty === 'division') {
        num2 = getRandomNumber(1, 10);
        num1 = num2 * getRandomNumber(1, 10);
      } else if (difficulty === 'hard') {
        num2 = getRandomNumber(2, 10);
        num1 = num2 * getRandomNumber(1, 10);
      } else {
        num2 = getRandomNumber(2, 20);
        num1 = num2 * getRandomNumber(2, 15);
      }
      answer = num1 / num2;
      problem = `${num1} ÷ ${num2} = ?`;
      break;

    case '^':
      // Potentiation: a^b
      if (difficulty === 'grade9') {
        num1 = getRandomNumber(2, 12); // Base
        num2 = (num1 > 5) ? 2 : getRandomNumber(2, 3); // Exponent (limit to 2 or 3 for large bases)
      } else {
        num1 = getRandomNumber(1, 5);
        num2 = 2;
      }
      answer = Math.pow(num1, num2);
      problem = `${num1}${num2 === 2 ? '²' : num2 === 3 ? '³' : '^' + num2} = ?`;
      break;

    case 'sqrt':
      // Square Root: √x
      const root = difficulty === 'grade9' ? getRandomNumber(2, 15) : getRandomNumber(1, 10);
      num1 = root * root; // x is a perfect square
      answer = root;
      problem = `√${num1} = ?`;
      break;

    case 'eq':
      // 1st-degree equation: ax + b = c
      const a = getRandomNumber(2, 8);
      const x = getRandomNumber(1, 10);
      const b = getRandomNumber(-10, 20);
      const c = a * x + b;
      answer = x;
      const bSymbol = b >= 0 ? '+' : '-';
      const absB = Math.abs(b);
      problem = `${a}x ${bSymbol} ${absB} = ${c}`;
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
