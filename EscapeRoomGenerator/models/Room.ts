import { v4 as uuidv4 } from 'uuid';
import { Puzzle } from './PuzzleGeneration/Puzzle';
import { Observable, Observer } from './ObserverPattern';

export class Room implements Observable, Observer {
    private static rooms : {[Key: string]: Room} = {};

    private observers: Observer[] = [];

    id: string = uuidv4();
    x: number;
    y: number;
    left: number = -1;
    right: number = -1;
    up: number = -1;
    down: number = -1;
    puzzles: Puzzle[];
    isSolved: boolean = false;

    constructor(x: number, y: number, puzzles: Puzzle[]) {
        this.x = x;
        this.y = y;
        this.puzzles = puzzles;
        puzzles.forEach((p) => p.addObserver(this));
        Room.rooms[this.id] = this;
    }

    static get(roomId: string): Room {
        return Room.rooms[roomId];
    }

    addObserver(observer: Observer): void {
        this.observers.push(observer);
    }
    notifyObservers(): void {
        this.observers.map(observer => observer.update(this.id)).filter((id) => id);
    }
    update(id: string): void {
        if (this.isSolved) return;
        
        if (this.puzzles.every((p) => p.isSolved)) {
            this.isSolved = true;
            this.notifyObservers();
        }
    }

    strip() {
        return {
            id: this.id,
            x: this.x,
            y: this.y,
            left: this.left,
            right: this.right,
            up: this.up,
            down: this.down,
            isSolved: this.isSolved,
            puzzles: this.puzzles.filter((p) => !p.isLocked).map((p) => p.strip()),
            hasLockedPuzzles: this.puzzles.some((p) => p.isLocked)
        };
    }
}

