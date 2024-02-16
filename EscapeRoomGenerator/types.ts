import { v4 as uuidv4 } from 'uuid';

export class EscapeRoom {
    id: string;
    rooms: Room[];

    constructor() {
        this.id = uuidv4();
        this.rooms = []
    }
}

export class Room {
    id: string;
    x: number;
    y: number;
    left: number | null;
    right: number | null;
    up: number | null;
    down: number | null;
    is_unlocked: boolean;
    slots: any[]

    constructor(x: number, y: number, slots: number) {
        this.id = uuidv4();
        this.x = x;
        this.y = y;
        this.left = null;
        this.right = null;
        this.up = null;
        this.down = null;
        this.is_unlocked = false;
        this.slots = new Array(slots).fill(null)
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