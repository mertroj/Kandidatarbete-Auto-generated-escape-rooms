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
    id: number;
    tag: PuzzleTypes;
    question: string;
    solution: string;
}
class PuzzleInfo{
    time: number;
    question: string;
    constructor(t: number, q: string){
        this.time = t;
        this.question = q;
    }
}

export class MathPuzzle implements Puzzle{
    id: number;
    tag: PuzzleTypes.MATH;
    question: string;
    solution: string;
    async generate(): Promise<PuzzleInfo>{
        return new PuzzleInfo(1, this.question);
    }
    getSolution(): string{
        return this.solution;
    }
    constructor(){
        this.id = Number(new Date());
        this.tag = PuzzleTypes.MATH;
        this.question = "What is 2+2?";
        this.solution = "4";
    }

}

export type point = [number, number]