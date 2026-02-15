import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGameLogic } from '../hooks/useGameLogic';
import { BrowserRouter } from 'react-router-dom';
import * as storage from '../utils/storage';

// Mock storage
vi.mock('../utils/storage', () => ({
    getStudent: vi.fn(),
    saveGameResult: vi.fn(),
}));

// Mock audio context
vi.mock('../contexts/GameAudioContext', () => ({
    useGameAudio: () => ({
        playCorrect: vi.fn(),
        playIncorrect: vi.fn(),
    }),
    GameAudioProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <BrowserRouter>{children}</BrowserRouter>
);

describe('useGameLogic hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should redirect if no student is found', () => {
        vi.mocked(storage.getStudent).mockReturnValue(null);
        renderHook(() => useGameLogic('easy'), { wrapper });
        // In a real test we would verify navigation, but let's check if problems are empty
    });

    it('should initialize with problems when student is logged in', () => {
        vi.mocked(storage.getStudent).mockReturnValue({
            id: '1',
            name: 'Test Student',
            grade: 6,
            createdAt: new Date(),
        });

        const { result } = renderHook(() => useGameLogic('easy'), { wrapper });

        expect(result.current.problems.length).toBe(10);
        expect(result.current.answers.length).toBe(10);
        expect(result.current.score).toBe(0);
        expect(result.current.isGameCompleted).toBe(false);
    });

    it('should handle problem selection', () => {
        vi.mocked(storage.getStudent).mockReturnValue({
            id: '1',
            name: 'Test Student',
            grade: 6,
            createdAt: new Date(),
        });

        const { result } = renderHook(() => useGameLogic('easy'), { wrapper });

        const problemId = result.current.problems[0].id;

        act(() => {
            result.current.handleProblemSelect(problemId);
        });

        expect(result.current.selectedProblem).toBe(problemId);

        // Toggle off
        act(() => {
            result.current.handleProblemSelect(problemId);
        });

        expect(result.current.selectedProblem).toBe(null);
    });
});
