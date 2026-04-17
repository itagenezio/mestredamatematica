
import { generateMathProblems } from './src/utils/mathProblems.ts';

console.log("--- TESTANDO GERAÇÃO DE QUESTÕES 9º ANO ---");
const problems = generateMathProblems('grade9', 10);

problems.forEach((p, i) => {
    console.log(`${i+1}. Problema: ${p.problem} | Resposta: ${p.answer}`);
});
