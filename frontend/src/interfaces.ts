export const backendURL = `http://${window.location.hostname}:8080`
export const socketsURL = `ws://${window.location.hostname}:8081`

export interface EscapeRoom {
    startTime: number;
    id: string;
    rooms: Room[];
    endPuzzle: Puzzle;
    theme: string;
    allRoomsSolved: boolean;
    isSolved: boolean;
}

export interface Room {
    id: string;
    x: number;
    y: number;
    left: number;
    right: number;
    up: number;
    down: number;
    isSolved: boolean;
    puzzles: Puzzle[];
    hasLockedPuzzles: boolean;
}

export interface RoomStatus {
    solved: boolean;
    unlocked: boolean;
    hint: boolean;
}

export type Puzzle = AnagramPuzzle | LettersMathPuzzle | OperatorsMathPuzzle | SlidePuzzle | JigsawPuzzle | MastermindPuzzle | MemoryPuzzle | SpotTheDifferencePuzzle;

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
    cells: Cell[];
    valuesToSymbols: Array<[number, string]>;
    hintActive: boolean;
}

export interface Cell{
    value: number;
    isFlipped: boolean;
    isMatched: boolean;
}

export interface OperatorsMathPuzzle {
    id: string;
    type: string;
    isSolved: boolean;
    isLocked: boolean;
    hints: string[];
    numberOfOperators: number;
    question: string;
    description: string;
}

export interface MastermindPuzzle {
    id: string;
    type: string;
    isSolved: boolean;
    isLocked: boolean;
    hints: string[];
    question: string;
    description: string;
    length: number;
    previousGuesses: [string, string][];
}

export interface SlidePuzzle {
    id: string;
    type: string;
    isSolved: boolean;
    isLocked: boolean;
    hints: number;

    question: string;
    description: string;
    pieces: (number | null)[][];
}

export interface JigsawPiece {
    id: number;
    row: number;
    col: number;
    curRow: number | null;
    curCol: number | null;
    left:   number;
    right:  number;
    top:    number;
    bottom: number;
    x: number;
    y: number;
    prevX: number;
    prevY: number;
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
    rows: number;
    columns: number;
}

export interface Difference {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    found: boolean;
}

export interface SpotTheDifferencePuzzle {
    id: string;
    type: string;
    isSolved: boolean;
    isLocked: boolean;
    hints: number;
    question: string;
    description: string;
    estimatedTime: number;
    differences: Difference[];
    originalImagePath: string;
    changedImagePath: string;
    width: number;
    height: number;
    maximumHints: number;
}