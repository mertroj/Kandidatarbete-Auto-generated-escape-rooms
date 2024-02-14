export class EscapeRoom {
    rooms: Room[];
    constructor() {
        this.rooms = []
    }
}

export class Room {
    left: number | null;
    right: number | null;
    up: number | null;
    down: number | null;
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.left = null;
        this.right = null;
        this.up = null;
        this.down = null;
    }
}
enum PuzzleTypes{
    MATH,
    MASTERMIND,
    ANAGRAMS
}
interface Puzzle{
    id: string;
    tag: PuzzleTypes;
    question: string;
    solution: string;
}

export class MathPuzzle implements Puzzle{
    id: string;
    tag: PuzzleTypes.MATH;
    question: string;
    solution: string;
    isDone: boolean;
    async generate(et: number | undefined): Promise<string>{
        return "2+2";
    }
}

export type point = [number, number]