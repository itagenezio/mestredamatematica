
import React, { useRef, useEffect, useState } from 'react';
import { MatchConnection, MathProblem } from '@/types';

interface ConnectionLinesProps {
    connections: MatchConnection[];
    problems: MathProblem[];
    selectedProblem: string | null;
}

export const ConnectionLines: React.FC<ConnectionLinesProps> = ({
    connections,
    problems,
    selectedProblem
}) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const [redrawTrigger, setRedrawTrigger] = useState(0);

    // Force redraw on window resize or when connections/selection change
    useEffect(() => {
        const handleResize = () => setRedrawTrigger(prev => prev + 1);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Also trigger redraw when connections change (though React should handle this, 
    // sometimes DOM positions haven't settled yet if we don't wait a tick)
    useEffect(() => {
        // Small timeout to allow DOM to settle if necessary
        const t = setTimeout(() => setRedrawTrigger(prev => prev + 1), 50);
        return () => clearTimeout(t);
    }, [connections, selectedProblem, problems]);

    const getLineCoordinates = (problemId: string, answerValue: string) => {
        if (!svgRef.current) return { x1: 0, y1: 0, x2: 0, y2: 0 };

        // We assume elements have IDs like 'problem-[id]' and 'answer-[value]'
        const problemElement = document.getElementById(`problem-${problemId}`);
        const answerElement = document.getElementById(`answer-${answerValue}`);

        // If it's a selected problem line (phantom line), we might not have an answer element
        if (problemElement && !answerElement && answerValue === "") {
            const svgRect = svgRef.current.getBoundingClientRect();
            const problemRect = problemElement.getBoundingClientRect();
            return {
                x1: problemRect.right - svgRect.left,
                y1: problemRect.top + (problemRect.height / 2) - svgRect.top,
                x2: problemRect.right - svgRect.left + 30, // Short stub
                y2: problemRect.top + (problemRect.height / 2) - svgRect.top
            };
        }

        if (!problemElement || !answerElement) return { x1: 0, y1: 0, x2: 0, y2: 0 };

        const svgRect = svgRef.current.getBoundingClientRect();
        const problemRect = problemElement.getBoundingClientRect();
        const answerRect = answerElement.getBoundingClientRect();

        return {
            x1: problemRect.right - svgRect.left,
            y1: problemRect.top + (problemRect.height / 2) - svgRect.top,
            x2: answerRect.left - svgRect.left,
            y2: answerRect.top + (answerRect.height / 2) - svgRect.top
        };
    };

    const getLineClass = (connection: MatchConnection) => {
        return connection.isCorrect ? "line-correct" : "line-incorrect";
    };

    return (
        <div className="absolute inset-0 pointer-events-none">
            <svg ref={svgRef} className="w-full h-full">
                {connections.map((connection) => {
                    const problem = problems.find(p => p.id === connection.problemId);
                    if (!problem) return null;

                    const coords = getLineCoordinates(connection.problemId, connection.answerId);

                    return (
                        <g key={`${connection.problemId}-${connection.answerId}`}>
                            <line
                                x1={coords.x1}
                                y1={coords.y1}
                                x2={coords.x2}
                                y2={coords.y2}
                                className={`line ${getLineClass(connection)}`}
                                strokeWidth={connection.isCorrect ? 4 : 3}
                            />
                            {connection.isCorrect && (
                                <>
                                    <circle cx={coords.x1} cy={coords.y1} r="4" className="fill-mathGreen" />
                                    <circle cx={coords.x2} cy={coords.y2} r="4" className="fill-mathGreen" />
                                </>
                            )}
                        </g>
                    );
                })}

                {selectedProblem && (
                    <line
                        x1={getLineCoordinates(selectedProblem, "").x1}
                        y1={getLineCoordinates(selectedProblem, "").y1}
                        x2={getLineCoordinates(selectedProblem, "").x2}
                        y2={getLineCoordinates(selectedProblem, "").y2}
                        className="line"
                        strokeDasharray="5,5"
                        strokeWidth="2"
                    />
                )}
            </svg>
        </div>
    );
};
