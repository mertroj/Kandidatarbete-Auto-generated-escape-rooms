import {Observer, Puzzle} from './Puzzle';
import {v4 as uuidv4} from "uuid";

export class Jigsaw implements Puzzle {
    private static puzzles: {[key: string]: Jigsaw} = {}
    id: string = uuidv4();
    static get(puzzleId: string): Jigsaw {
        return Jigsaw.puzzles[puzzleId]
    }

    private observers: Observer[] = []; //All puzzles that depend on this one (outgoing)
    private dependentPuzzles: string[]; //All puzzles that need to be solved before this one can be attempted (incoming)

    description: string = "Solve the jigsaw puzzle";
    estimatedTime: number;
    hintLevel: number = 0;
    question: string = "";
    solved: boolean = false;
    type: string = 'jigsawpuzzle';
    isLocked: boolean = false;

    pieces: Piece[] = [];

    size: Size = {rows: 0, columns: 0 }

    constructor(difficulty: number, dependentPuzzles: string[]) {  // 1 = easy, 2 = medium, 3 = hard
        this.dependentPuzzles = dependentPuzzles;
        if (this.dependentPuzzles.length > 0) this.isLocked = true;

        switch (difficulty) {
            case 1:
                this.size = {rows: 3, columns: 3}
                this.estimatedTime = 2;
                break;
            case 2:
                this.size = {rows: 5, columns: 5}
                this.estimatedTime = 4;
                break;
            case 3:
                this.size = {rows: 10, columns: 10}
                this.estimatedTime = 10;
                break;
            default:
                this.estimatedTime = 0
                break;
        }
        this.pieces = createPieces(this.size);
        Jigsaw.puzzles[this.id] = this;

    }
    checkAnswer(): boolean {
        for (let piece of this.pieces) {
            if (!piece.correct) {
                return false;
            }
        }
        this.solved = true;
        return true;
    }

    getHint(): string {
        return "Perhaps start with the corners";
    }


    addObserver(observer: Observer): void {
        this.observers.push(observer);
    }
    notifyObservers(): void {
        this.observers.forEach(observer => {
            observer.update(this.id);
        });
    }
    update(id: string): void{
        this.dependentPuzzles = this.dependentPuzzles.filter(puzzleId => puzzleId !== id);
        if (this.dependentPuzzles.length === 0) {
            this.isLocked = false;
        }
    }

}


interface Size {
    rows: number;
    columns: number;
}
function createPieces(size: Size): Piece[]{
    let rows = size.rows;
    let columns = size.columns;
    let pieces: Piece[] = [];
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            pieces.push(new Piece(i, j));
        }
    }

    let count: number = 0;
    for (let i = 0; i < size.rows; i++) {
        for (let j = 0; j < size.columns; j++) {
            const piece: Piece = pieces[count];
            if (i==size.rows-1) {
                piece.bottom = NaN;
            }
            else {
                const sgn = (Math.random() - 0.5) < 0 ? -1 : 1;
                piece.bottom = sgn * (Math.random() * 0.4 + 0.3);
            }

            if (j == size.columns-1){
                piece.right = NaN
            }
            else{
                const sgn = (Math.random()-0.5)<0? -1:1;
                piece.right = sgn*(Math.random()*0.4+0.3);
            }

            if(j == 0){
                piece.left = NaN;
            }
            else {
                piece.left = -pieces[count-1].right;
            }
            if (i==0){
                piece.top = NaN;
            }
            else {
                piece.top = -pieces[count - size.columns].bottom;
            }
            count++;
        }
    }
    return pieces;
}

export class Piece {
    id: string;
    rowIndex: number;
    colIndex: number;
    correct: boolean;
    bottom: any = null;
    right: any = null;
    left: any = null;
    top: any = null;
    constructor(rowIndex: number, colIndex: number) {
        this.id = uuidv4();
        this.rowIndex = rowIndex;
        this.colIndex = colIndex;
        this.correct = true;
    }

    setCorrect(boolean: boolean){
        this.correct = boolean
    }
}