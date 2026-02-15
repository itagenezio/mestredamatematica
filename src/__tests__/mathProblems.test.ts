import { describe, it, expect } from 'vitest';
import { generateMathProblems } from '../utils/mathProblems';

describe('mathProblems utility', () => {
    it('should generate the correct number of problems', () => {
        const count = 10;
        const problems = generateMathProblems('easy', count);
        expect(problems.length).toBe(count);
    });

    it('should generate unique problems', () => {
        const count = 10;
        const problems = generateMathProblems('easy', count);
        const problemKeys = problems.map(p => p.problem);
        const uniqueKeys = new Set(problemKeys);
        expect(uniqueKeys.size).toBe(count);
    });

    it('should generate correct answers for addition', () => {
        const problems = generateMathProblems('easy', 50);
        problems.forEach(p => {
            if (p.problem.includes('+')) {
                const parts = p.problem.split(' ');
                const n1 = parseInt(parts[0]);
                const n2 = parseInt(parts[2]);
                expect(n1 + n2).toBe(p.answer);
            }
        });
    });

    it('should generate correct answers for subtraction', () => {
        const problems = generateMathProblems('easy', 50);
        problems.forEach(p => {
            if (p.problem.includes('-')) {
                const parts = p.problem.split(' ');
                const n1 = parseInt(parts[0]);
                const n2 = parseInt(parts[2]);
                expect(n1 - n2).toBe(p.answer);
            }
        });
    });

    it('should generate correct answers for multiplication', () => {
        const problems = generateMathProblems('medium', 50);
        problems.forEach(p => {
            if (p.problem.includes('×')) {
                const parts = p.problem.split(' ');
                const n1 = parseInt(parts[0]);
                const n2 = parseInt(parts[2]);
                expect(n1 * n2).toBe(p.answer);
            }
        });
    });

    it('should generate correct answers for division', () => {
        const problems = generateMathProblems('hard', 50);
        problems.forEach(p => {
            if (p.problem.includes('÷')) {
                const parts = p.problem.split(' ');
                const n1 = parseInt(parts[0]);
                const n2 = parseInt(parts[2]);
                expect(n1 / n2).toBe(p.answer);
                expect(n1 % n2).toBe(0); // Should always be clean division
            }
        });
    });
});
