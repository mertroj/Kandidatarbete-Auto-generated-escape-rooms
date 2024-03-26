import { Puzzle } from './Puzzle';
import {v4 as uuidv4} from "uuid";



export class Jigsaw implements Puzzle {
    private static puzzles: {[key: string]: Jigsaw} = {}
    id: string = uuidv4();
    static get(puzzleId: string): Jigsaw {
        return Jigsaw.puzzles[puzzleId]
    }

    description: string = "Solve the jigsaw puzzle";
    estimatedTime: number;
    hintLevel: number = 0;
    question: string = "";
    solved: boolean = false;
    type: string = 'jigsawpuzzle';

    pieces: Piece[] = [];

    size: Size = {rows: 0, columns: 0 }

    constructor(difficulty: number) {  // 1 = easy, 2 = medium, 3 = hard
        switch (difficulty) {
            case 1:
                this.size = {rows: 3, columns: 3}
                this.estimatedTime = 2
                break;
            case 2:
                this.size = {rows: 5, columns: 5}
                this.estimatedTime = 5
                break;
            case 3:
                this.size = {rows: 10, columns: 10}
                this.estimatedTime = 12
                break;
            default:
                this.estimatedTime = 0
                break;
        }
        this.pieces = createPieces(this.size);


        // TODO: add generator related elements

    }
    checkAnswer(answer: string): boolean {
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
    rowIndex: number;
    colIndex: number;
    correct: boolean;
    bottom: any = null;
    right: any = null;
    left: any = null;
    top: any = null;
    constructor(rowIndex: number, colIndex: number) {
        this.rowIndex = rowIndex;
        this.colIndex = colIndex;
        this.correct = true;
    }

    setCorrect(boolean: boolean){
        this.correct = boolean
    }
}