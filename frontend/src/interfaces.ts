export interface EscapeRoom {
    timer: Timer;
    id: string;
    rooms: Room[];
    endPuzzle: Puzzle;
}

export type Puzzle = AnagramPuzzle | LettersMathPuzzle | OperatorsMathPuzzle | SlidePuzzle | JigsawPuzzle | MastermindPuzzle;
export enum FeedbackMessages{
    CORRECT = "Puzzle Solved!",
    INCORRECT = "Incorrect answer!",
    UNLOCKED = "Puzzle Unlocked!",
}

export interface Room {
    id: string;
    left: string;
    right: string;
    up: string;
    down: string;
    isLocked: boolean;
    puzzles: Puzzle[];
}

export interface AnagramPuzzle {
    id: string;
    type: string;
    isSolved: boolean;
    isLocked: boolean;
    hintLevel: number;

    question: string;
    description: string;
}

export interface LettersMathPuzzle {
    id: string;
    type: string;
    isSolved: boolean;
    isLocked: boolean;
    hintLevel: number;

    question: string;
    description: string;
}

export interface OperatorsMathPuzzle {
    id: string;
    type: string;
    isSolved: boolean;
    isLocked: boolean;
    hintLevel: number;
    numberOfOperands: number;

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
    hintLevel: number;

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
    hintLevel: number;

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
    hintLevel: number;
    question: string;
    length: number;
}