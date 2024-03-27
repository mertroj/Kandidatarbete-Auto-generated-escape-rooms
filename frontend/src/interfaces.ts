export interface EscapeRoom {
    timer: Timer;
    id: string;
    rooms: Room[]
}

export interface Room {
    id: string;
    x: number;
    y: number;
    left: string;
    right: string;
    up: string;
    down: string;
    is_unlocked: boolean;
    puzzles: Puzzle[]
}

export interface Puzzle {
    id: string;
    type: string;
    question:string;
    description: string;
    hintLevel: number;
    solved: boolean;
    isLocked: boolean;
    estimatedTime: number;
}

export interface NewHint{
    hint: string;
}

export interface Timer {
    elapsedTime: number;
}

export interface SlidePuzzles extends Puzzle{
    //question is irrelevant here
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

export interface JigsawPuzzle extends Puzzle{
    pieces: JigsawPiece[];
    size: {rows: number, columns: number};

}