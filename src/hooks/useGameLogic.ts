
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
    DifficultyLevel,
    MathProblem,
    GameResult,
    MatchConnection
} from "@/types";
import { generateMathProblems } from "@/utils/mathProblems";
import { getStudent, saveGameResult } from "@/utils/storage";
import { useGameAudio } from "@/contexts/GameAudioContext";

export const useGameLogic = (difficulty: DifficultyLevel) => {
    const navigate = useNavigate();
    const { playCorrect, playIncorrect } = useGameAudio();

    const [problems, setProblems] = useState<MathProblem[]>([]);
    const [answers, setAnswers] = useState<string[]>([]);
    const [selectedProblem, setSelectedProblem] = useState<string | null>(null);
    const [connections, setConnections] = useState<MatchConnection[]>([]);
    const [startTime, setStartTime] = useState<number>(Date.now());
    const [elapsedTime, setElapsedTime] = useState<number>(0);
    const [gameCompleted, setGameCompleted] = useState<boolean>(false);
    const [score, setScore] = useState<number>(0);
    const [showResults, setShowResults] = useState<boolean>(false);

    const timerRef = useRef<number | null>(null);

    // Initialize game
    useEffect(() => {
        const student = getStudent();
        if (!student) {
            navigate('/');
            return;
        }

        const generatedProblems = generateMathProblems(difficulty, 10);
        setProblems(generatedProblems);

        // Shuffle the answers
        const shuffledAnswers = [...generatedProblems.map(p => p.answer.toString())]
            .sort(() => Math.random() - 0.5);
        setAnswers(shuffledAnswers);

        setStartTime(Date.now());
        setConnections([]);
        setSelectedProblem(null);
        setGameCompleted(false);
        setScore(0);

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [difficulty, navigate]);

    // Timer
    useEffect(() => {
        timerRef.current = window.setInterval(() => {
            setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
        }, 1000);

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [startTime]);

    // Completion check
    useEffect(() => {
        // Game is completed when all problems have a connection (correct or incorrect)
        if (connections.length === problems.length && problems.length > 0) {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }

            const totalTime = Math.floor((Date.now() - startTime) / 1000);
            const correctConnections = connections.filter(c => c.isCorrect);
            const correctCount = correctConnections.length;

            let baseScore = 0;
            switch (difficulty) {
                case 'easy': baseScore = 100; break;
                case 'medium': baseScore = 200; break;
                case 'hard': baseScore = 300; break;
            }

            const timeBonus = Math.max(0, baseScore - Math.floor(totalTime / 2));
            const calculatedScore = (correctCount * baseScore) + timeBonus;

            setScore(calculatedScore);
            setGameCompleted(true);

            const student = getStudent();
            if (student) {
                const gameResult: GameResult = {
                    id: Date.now().toString(),
                    studentId: student.id,
                    difficulty,
                    correctAnswers: correctCount,
                    totalTime,
                    score: calculatedScore,
                    createdAt: new Date()
                };

                saveGameResult(gameResult);

                setTimeout(() => {
                    setShowResults(true);
                }, 1000);
            }
        }
    }, [connections, problems, difficulty, startTime]);

    const handleProblemSelect = (problemId: string) => {
        // Prevent selecting if the problem is already connected (whether correct or not)
        const alreadyConnected = connections.find(c => c.problemId === problemId);
        if (alreadyConnected) return; // Locked!

        setSelectedProblem(selectedProblem === problemId ? null : problemId);
    };

    const handleAnswerSelect = (answerValue: string): boolean => {
        if (!selectedProblem) return false;

        const problem = problems.find(p => p.id === selectedProblem);
        if (!problem) return false;

        const isCorrect = problem.answer.toString() === answerValue;

        // We don't filter out existing connections for this problem because handleProblemSelect
        // guarantees we only get here if there isn't one. 
        // But for safety/react-strict-mode, we can keep the filter or just append.

        const newConnection: MatchConnection = {
            problemId: selectedProblem,
            answerId: answerValue,
            isCorrect
        };

        const updatedConnections = [...connections, newConnection];

        if (isCorrect) {
            playCorrect();
        } else {
            playIncorrect();
        }

        setConnections(updatedConnections);
        setSelectedProblem(null);
        return isCorrect;
    };

    return {
        problems,
        answers,
        selectedProblem,
        connections,
        elapsedTime,
        score,
        showResults,
        setShowResults,
        handleProblemSelect,
        handleAnswerSelect,
        isGameCompleted: gameCompleted
    };
};
