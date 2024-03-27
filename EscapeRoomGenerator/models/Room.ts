import { v4 as uuidv4 } from 'uuid';
import { Graph } from 'graphlib';
import { puzzleTreePopulator } from './puzzles/PuzzleTreePopulator';
import { Puzzle } from './puzzles/Puzzle';


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
    graph: Graph;

    constructor(x: number, y: number, difficulty: number) {
        this.id = uuidv4();
        this.x = x;
        this.y = y;
        this.left = '';
        this.right = '';
        this.up = '';
        this.down = '';
        this.isLocked = true;
        this.graph = puzzleTreePopulator(20, difficulty);
        Room.rooms[this.id] = this;
    }

    static get(roomId: string): Room {
        return Room.rooms[roomId]
    }

    strip() {
        return {
            id: this.id,
            left: this.left,
            right: this.right,
            up: this.up,
            down: this.down,
            isLocked: this.isLocked,
            puzzles: this.graph.nodes().map((node) => (this.graph.node(node) as Puzzle).strip())
        }
    }
}

