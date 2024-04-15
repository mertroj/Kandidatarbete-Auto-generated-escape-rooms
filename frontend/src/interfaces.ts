export interface EscapeRoom {
    timer: Timer;
    id: string;
    rooms: Room[];
    endPuzzle: Puzzle;
    theme: string;
}

export type Puzzle = AnagramPuzzle | LettersMathPuzzle | OperatorsMathPuzzle | SlidePuzzle | JigsawPuzzle | MastermindPuzzle | MemoryPuzzle;
export enum FeedbackMessages{
    CORRECT = "Puzzle Solved!",
    INCORRECT = "Incorrect answer!",
    UNLOCKED = "Puzzle Unlocked!",
}

export interface Room {
    id: string;
    left: number;
    right: number;
    up: number;
    down: number;
    isLocked: boolean;
    puzzles: Puzzle[];
}

export interface AnagramPuzzle {
    id: string;
    type: string;
    isSolved: boolean;
    isLocked: boolean;
    hints: string[];

    question: string;
    description: string;
}

export interface LettersMathPuzzle {
    id: string;
    type: string;
    isSolved: boolean;
    isLocked: boolean;
    hints: string[];

    question: string;
    description: string;
}

export interface MemoryPuzzle {
    id: string;
    type: string;
    isSolved: boolean;
    isLocked: boolean;
    hints: number;
    difficulty: number;
    question: string;
    description: string;
    cellsMatrix: Cell[][];
    valuesToSymbols: Array<[number, string]>;
}

export interface Cell{
    value: number;
    isFlipped: boolean;
}

export interface OperatorsMathPuzzle {
    id: string;
    type: string;
    isSolved: boolean;
    isLocked: boolean;
    hints: string[];

    question: string;
    description: string;
}

export interface NewHint{
    hint: string;
}

export interface Timer {
    elapsedTime: number;
}

export interface SlidePuzzle {
    id: string;
    type: string;
    isSolved: boolean;
    isLocked: boolean;
    hints: number;

    question: string;
    description: string;
    pieces: (Piece | null)[][];
}

export interface Piece {
    number: number;
    position: Position;
}

export interface Position {
    x: number;
    y: number;
}

export interface JigsawPiece {
    id: string;
    rowIndex: number;
    colIndex: number;
    correct: boolean;
    bottom: any;
    right: any;
    left: any;
    top: any;

    setCorrect(correct: boolean): void;
}

export interface JigsawPuzzle {
    id: string;
    type: string;
    isSolved: boolean;
    isLocked: boolean;
    hints: number;

    question: string;
    description: string;
    pieces: JigsawPiece[];
    size: {rows: number, columns: number};

}

export interface MastermindPuzzle {
    id: string;
    type: string;
    isSolved: boolean;
    isLocked: boolean;
    hints: string[];
    question: string;
    length: number;
    previousGuesses: [string, string][];
}