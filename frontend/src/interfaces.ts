import exp from "node:constants";

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
    slots: Puzzle[]
}

export interface Puzzle {
    id: string;
    type: string;
    question:string;
    description: string;
    hintLevel: number;
    solved: boolean;
    estimatedTime: number;
}

export interface NewHint{
    hint: string;
}

export interface Timer {
    elapsedTime: number;
}

export interface Piece {
    rowIndex: number;
    colIndex: number;
    correct: boolean;
    bottom: any;
    right: any;
    left: any;
    top: any;
}

export interface JigsawPuzzle extends Puzzle{
    pieces: Piece[];
    size: {rows: number, columns: number};

}