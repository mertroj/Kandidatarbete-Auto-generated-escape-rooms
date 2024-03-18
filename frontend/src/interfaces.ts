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