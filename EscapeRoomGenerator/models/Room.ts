import { v4 as uuidv4 } from 'uuid';
import { Puzzle } from './Puzzles/Puzzle';

export class Room {
    private static rooms : {[Key: string]: Room} = {};

    id: string;
    x: number;
    y: number;
    left: string;
    right: string;
    up: string;
    down: string;
    isLocked: boolean;
    puzzles: Puzzle[];

    constructor(x: number, y: number, puzzles: Puzzle[]) {
        this.id = uuidv4();
        this.x = x;
        this.y = y;
        this.left = '';
        this.right = '';
        this.up = '';
        this.down = '';
        this.isLocked = puzzles.every((puzzle) => puzzle.isLocked);
        this.puzzles = puzzles;
        Room.rooms[this.id] = this;
    }

    static get(roomId: string): Room {
        return Room.rooms[roomId];
    }

    strip() {
        return {
            id: this.id,
            left: this.left,
            right: this.right,
            up: this.up,
            down: this.down,
            isLocked: this.isLocked,
            puzzles: this.puzzles.map((puzzle) => puzzle.strip())
        }
    }
}

